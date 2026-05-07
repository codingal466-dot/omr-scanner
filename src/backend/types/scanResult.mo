import CommonTypes "common";

module {
  // Status of a single detected answer
  public type AnswerStatus = { #correct; #incorrect; #empty; #anomaly };

  // Per-question result detail
  public type QuestionResult = {
    questionNumber : Nat;
    detectedAnswer : { #A; #B; #C; #D; #E; #None };
    status         : AnswerStatus;
    pointsAwarded  : Float;
  };

  // A completed scan result entity
  public type ScanResult = {
    id              : CommonTypes.ScanResultId;
    answerKeyId     : CommonTypes.AnswerKeyId;
    studentName     : Text;
    studentId       : Text;
    studentClass    : Text;
    questionResults : [QuestionResult];
    totalScore      : Float;
    percentage      : Float;     // 0.0 – 100.0
    timestamp       : CommonTypes.Timestamp;
  };

  // Input submitted for grading / saving a scan
  public type ScanInput = {
    answerKeyId  : CommonTypes.AnswerKeyId;
    studentName  : Text;
    studentId    : Text;
    studentClass : Text;
    detectedAnswers : [{ #A; #B; #C; #D; #E; #None }]; // one per question
  };

  // Score breakdown returned by the grading function
  public type ScoreBreakdown = {
    questionResults  : [QuestionResult];
    totalScore       : Float;
    maxPossibleScore : Float;
    percentage       : Float;
    correctCount     : Nat;
    incorrectCount   : Nat;
    emptyCount       : Nat;
    anomalyCount     : Nat;
  };
};
