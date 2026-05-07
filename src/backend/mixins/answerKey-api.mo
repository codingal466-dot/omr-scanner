import List        "mo:core/List";
import AKTypes     "../types/answerKey";
import CommonTypes "../types/common";
import AKLib       "../lib/answerKey";

mixin (
  answerKeys : List.List<AKTypes.AnswerKey>
) {
  var nextKeyId : Nat = 0;
  // Create a new answer key
  public shared func createAnswerKey(input : AKTypes.AnswerKeyInput) : async AKTypes.AnswerKey {
    let key = AKLib.create(answerKeys, nextKeyId, input);
    nextKeyId += 1;
    key;
  };

  // List all answer keys
  public query func listAnswerKeys() : async [AKTypes.AnswerKey] {
    AKLib.list(answerKeys);
  };

  // Get a single answer key by id
  public query func getAnswerKey(id : CommonTypes.AnswerKeyId) : async ?AKTypes.AnswerKey {
    AKLib.get(answerKeys, id);
  };

  // Update an existing answer key
  public shared func updateAnswerKey(
    id    : CommonTypes.AnswerKeyId,
    input : AKTypes.AnswerKeyInput
  ) : async Bool {
    AKLib.update(answerKeys, id, input);
  };

  // Delete an answer key
  public shared func deleteAnswerKey(id : CommonTypes.AnswerKeyId) : async Bool {
    AKLib.delete(answerKeys, id);
  };
};
