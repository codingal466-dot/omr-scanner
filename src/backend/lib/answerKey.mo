import List        "mo:core/List";
import CommonTypes "../types/common";
import AKTypes     "../types/answerKey";

module {
  public type AnswerKey      = AKTypes.AnswerKey;
  public type AnswerKeyInput = AKTypes.AnswerKeyInput;

  // Create a new AnswerKey from input, assigning the given id
  public func create(
    store  : List.List<AnswerKey>,
    nextId : Nat,
    input  : AnswerKeyInput
  ) : AnswerKey {
    let key : AnswerKey = {
      id              = nextId;
      name            = input.name;
      questionCount   = input.questionCount;
      questions       = input.questions;
      penaltyPerWrong = input.penaltyPerWrong;
    };
    store.add(key);
    key;
  };

  // Return all stored answer keys as an array
  public func list(store : List.List<AnswerKey>) : [AnswerKey] {
    store.toArray();
  };

  // Look up a single answer key by id
  public func get(
    store : List.List<AnswerKey>,
    id    : CommonTypes.AnswerKeyId
  ) : ?AnswerKey {
    store.find(func(k) { k.id == id });
  };

  // Update an existing answer key; returns true if found and updated
  public func update(
    store : List.List<AnswerKey>,
    id    : CommonTypes.AnswerKeyId,
    input : AnswerKeyInput
  ) : Bool {
    var found = false;
    store.mapInPlace(func(k) {
      if (k.id == id) {
        found := true;
        { k with
          name            = input.name;
          questionCount   = input.questionCount;
          questions       = input.questions;
          penaltyPerWrong = input.penaltyPerWrong;
        };
      } else { k };
    });
    found;
  };

  // Delete an answer key by id; returns true if found and removed
  public func delete(
    store : List.List<AnswerKey>,
    id    : CommonTypes.AnswerKeyId
  ) : Bool {
    let sizeBefore = store.size();
    let filtered = store.filter(func(k) { k.id != id });
    store.clear();
    store.append(filtered);
    store.size() < sizeBefore;
  };
};
