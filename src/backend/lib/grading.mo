import Array   "mo:core/Array";
import AKTypes "../types/answerKey";
import SRTypes "../types/scanResult";

module {
  // Check whether a detected answer matches the correct answer choice
  func choiceEqual(
    a : { #A; #B; #C; #D; #E; #None },
    b : AKTypes.AnswerChoice
  ) : Bool {
    switch (a, b) {
      case (#A, #A) true;
      case (#B, #B) true;
      case (#C, #C) true;
      case (#D, #D) true;
      case (#E, #E) true;
      case (#None, #None) true;
      case _ false;
    };
  };

  // Grade detected answers against an answer key.
  // anomalyFlags: parallel bool array — true means multiple bubbles filled
  //               for that question → mark as #anomaly, award 0 points.
  public func gradeWithFlags(
    answerKey       : AKTypes.AnswerKey,
    detectedAnswers : [{ #A; #B; #C; #D; #E; #None }],
    anomalyFlags    : [Bool]
  ) : SRTypes.ScoreBreakdown {
    let questions = answerKey.questions;
    let numQ = questions.size();

    var totalScore     : Float = 0.0;
    var maxPossible    : Float = 0.0;
    var correctCount   : Nat   = 0;
    var incorrectCount : Nat   = 0;
    var emptyCount     : Nat   = 0;
    var anomalyCount   : Nat   = 0;

    let qResults = Array.tabulate(numQ, func(i) {
      let qk = questions[i];
      maxPossible += qk.pointValue;

      let detected : { #A; #B; #C; #D; #E; #None } =
        if (i < detectedAnswers.size()) detectedAnswers[i] else #None;

      let isAnomaly = if (i < anomalyFlags.size()) anomalyFlags[i] else false;

      let (status, pts) : (SRTypes.AnswerStatus, Float) =
        if (isAnomaly) {
          anomalyCount += 1;
          (#anomaly, 0.0);
        } else {
          switch detected {
            case (#None) {
              emptyCount += 1;
              (#empty, 0.0);
            };
            case _ {
              if (choiceEqual(detected, qk.correctAnswer)) {
                correctCount += 1;
                (#correct, qk.pointValue);
              } else {
                incorrectCount += 1;
                let deducted = if (answerKey.penaltyPerWrong > 0.0) answerKey.penaltyPerWrong else 0.0;
                (#incorrect, -deducted);
              };
            };
          };
        };

      totalScore += pts;

      {
        questionNumber = qk.questionNumber;
        detectedAnswer = detected;
        status         = status;
        pointsAwarded  = pts;
      };
    });

    // Clamp total score to 0 — never go negative
    let finalScore = if (totalScore < 0.0) 0.0 else totalScore;
    let pct = if (maxPossible > 0.0) (finalScore / maxPossible) * 100.0 else 0.0;

    {
      questionResults  = qResults;
      totalScore       = finalScore;
      maxPossibleScore = maxPossible;
      percentage       = pct;
      correctCount;
      incorrectCount;
      emptyCount;
      anomalyCount;
    };
  };

  // Convenience wrapper with no anomaly flags
  public func grade(
    answerKey       : AKTypes.AnswerKey,
    detectedAnswers : [{ #A; #B; #C; #D; #E; #None }]
  ) : SRTypes.ScoreBreakdown {
    gradeWithFlags(answerKey, detectedAnswers, []);
  };
};
