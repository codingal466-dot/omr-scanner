import List        "mo:core/List";
import CommonTypes "../types/common";
import SRTypes     "../types/scanResult";

module {
  public type ScanResult = SRTypes.ScanResult;

  // Persist a new scan result built from a ScoreBreakdown + metadata
  public func save(
    store     : List.List<ScanResult>,
    nextId    : Nat,
    input     : SRTypes.ScanInput,
    breakdown : SRTypes.ScoreBreakdown,
    timestamp : CommonTypes.Timestamp
  ) : ScanResult {
    let result : ScanResult = {
      id              = nextId;
      answerKeyId     = input.answerKeyId;
      studentName     = input.studentName;
      studentId       = input.studentId;
      studentClass    = input.studentClass;
      questionResults = breakdown.questionResults;
      totalScore      = breakdown.totalScore;
      percentage      = breakdown.percentage;
      timestamp;
    };
    store.add(result);
    result;
  };

  // Return all stored scan results as an array
  public func list(store : List.List<ScanResult>) : [ScanResult] {
    store.toArray();
  };

  // Look up a scan result by id
  public func getById(
    store : List.List<ScanResult>,
    id    : CommonTypes.ScanResultId
  ) : ?ScanResult {
    store.find(func(r) { r.id == id });
  };

  // Delete a scan result by id; returns true if found and removed
  public func delete(
    store : List.List<ScanResult>,
    id    : CommonTypes.ScanResultId
  ) : Bool {
    let sizeBefore = store.size();
    let filtered = store.filter(func(r) { r.id != id });
    store.clear();
    store.append(filtered);
    store.size() < sizeBefore;
  };
};
