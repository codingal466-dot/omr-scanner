import List   "mo:core/List";
import AKTypes "types/answerKey";
import SRTypes "types/scanResult";

import AnswerKeyApi  "mixins/answerKey-api";
import ScanResultApi "mixins/scanResult-api";

actor {
  let answerKeys  = List.empty<AKTypes.AnswerKey>();
  let scanResults = List.empty<SRTypes.ScanResult>();

  include AnswerKeyApi(answerKeys);
  include ScanResultApi(answerKeys, scanResults);
};
