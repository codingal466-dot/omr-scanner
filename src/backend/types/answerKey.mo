import CommonTypes "common";

module {
  // Possible answer choices for each question
  public type AnswerChoice = { #A; #B; #C; #D; #E; #None };

  // Per-question definition in an answer key
  public type QuestionKey = {
    questionNumber : Nat;        // 1-indexed
    correctAnswer  : AnswerChoice;
    pointValue     : Float;      // points awarded for a correct answer
  };

  // An answer key entity
  public type AnswerKey = {
    id             : CommonTypes.AnswerKeyId;
    name           : Text;
    questionCount  : Nat;
    questions      : [QuestionKey];           // length == questionCount
    penaltyPerWrong : Float;                  // points deducted per wrong answer (>=0)
  };

  // Input record used for create / update (no id)
  public type AnswerKeyInput = {
    name           : Text;
    questionCount  : Nat;
    questions      : [QuestionKey];
    penaltyPerWrong : Float;
  };
};
