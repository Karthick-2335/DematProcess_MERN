import { createContext } from "react";
import { Option } from "../components/form/Select";

interface KycContextType {
  isNri: boolean;
  setNri: (val: boolean) => void;
  isMinor: boolean;
  setMinor: (val: boolean) => void;
  isSecondHolder: boolean;
  setSecondHolder: (val: boolean) => void;
  isThirdHolder: boolean;
  setThirdHolder: (val: boolean) => void;
  getStateMaster: Option[];
  setStateMaster: (val: Option[]) => void;
  getCountryMaster: Option[];
  setCountryMaster: (val: Option[]) => void;
  getProofMaster: Option[];
  setProofMaster: (val: Option[]) => void;
  getRelationMaster: Option[];
  setRelationMaster: (val: Option[]) => void;
  jointHolderPanExempt: boolean[];
  setJoinHolderPanExempt: (val: boolean[]) => void;
}

export const KycContext = createContext<KycContextType | undefined>(undefined);
