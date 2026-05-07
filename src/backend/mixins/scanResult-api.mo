import List        "mo:core/List";
import Time        "mo:core/Time";
import Runtime     "mo:core/Runtime";
import AKTypes     "../types/answerKey";
import SRTypes     "../types/scanResult";
import CommonTypes "../types/common";
import AKLib       "../lib/answerKey";
import SRLib       "../lib/scanResult";
import Grading     "../lib/grading";

mixin (
  answerKeys  : List.List<AKTypes.AnswerKey>,
  scanResults : List.List<SRTypes.ScanResult>
) {
  var nextScanId : Nat = 0;
  // Grade a set of detected answers and persist the scan result
  public shared func submitScan(input : SRTypes.ScanInput) : async SRTypes.ScanResult {
    let key = switch (AKLib.get(answerKeys, input.answerKeyId)) {
      case (?k) k;
      case null Runtime.trap("Answer key not found");
    };
    let breakdown = Grading.grade(key, input.detectedAnswers);
    let result = SRLib.save(scanResults, nextScanId, input, breakdown, Time.now());
    nextScanId += 1;
    result;
  };

  // List all scan results
  public query func listScanResults() : async [SRTypes.ScanResult] {
    SRLib.list(scanResults);
  };

  // Get a scan result by id
  public query func getScanResult(id : CommonTypes.ScanResultId) : async ?SRTypes.ScanResult {
    SRLib.getById(scanResults, id);
  };

  // Delete a scan result
  public shared func deleteScanResult(id : CommonTypes.ScanResultId) : async Bool {
    SRLib.delete(scanResults, id);
  };

  // Grade answers against a key without saving — returns breakdown only
  public query func gradeAnswers(
    answerKeyId     : CommonTypes.AnswerKeyId,
    detectedAnswers : [{ #A; #B; #C; #D; #E; #None }]
  ) : async ?SRTypes.ScoreBreakdown {
    switch (AKLib.get(answerKeys, answerKeyId)) {
      case (?key) ?Grading.grade(key, detectedAnswers);
      case null null;
    };
  };
};
