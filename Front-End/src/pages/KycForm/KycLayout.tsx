import React, { useEffect, useState, useMemo, useContext } from "react";
import Profile from "./Profile";
import Register from "./Register";
import { useParams } from "react-router";
import Address from "./Address";
import { Option } from "../../components/form/Select";
import { KycContext } from "../../context/KycContext";
import Nominee from "./Nominee";
import { getRequest } from "../../services/axios";
import WithLoader from "../../components/Loader/WithLoader";
import Bank from "./Bank";
import Document from "./Document";

interface stageInfo {
  stageId: number;
  stageName: string;
  hasDone: boolean;
}
interface overallStatusInfo {
  stageName: string;
  statusId: number;
  stageId: number;
}
interface overallCommonInfo {
  isMinor: boolean;
  isNri: boolean;
  isSecondHolder: boolean;
  isThirdHolder: boolean;
}
interface OverallInfo {
  overall: overallStatusInfo[];
  commonData: overallCommonInfo;
}
interface GuardianRelationMaster {
  id: string;
  code: string;
  value: string;
}
interface stateMaster {
  code: string;
  name: string;
}
interface countryMaster {
  code: string;
  name: string;
}
interface addressProofMaster {
  idTypeId: string;
  idType: string;
}
const KycLayout = () => {
  const { id } = useParams();
  const [isNri, setNri] = useState<boolean>(false);
  const [isMinor, setMinor] = useState<boolean>(false);
  const [isSecondHolder, setSecondHolder] = useState<boolean>(false);
  const [isThirdHolder, setThirdHolder] = useState<boolean>(false);
  const [getStateMaster, setStateMaster] = useState<Option[]>([]);
  const [getCountryMaster, setCountryMaster] = useState<Option[]>([]);
  const [getProofMaster, setProofMaster] = useState<Option[]>([]);
  const [getRelationMaster, setRelationMaster] = useState<Option[]>([]);
  const [jointHolderPanExempt, setJoinHolderPanExempt] = useState<boolean[]>(
    []
  );
  const contextProvider = useContext(KycContext);
  const [loading, setLoading] = useState(false);

  const [guardinaRelation, setGuardianRelation] = useState<
    GuardianRelationMaster[] | null
  >(null);
  const [stateMaster, setStateMasterO] = useState<stateMaster[] | null>(null);
  const [addProofMaster, setAddProofMaster] = useState<
    addressProofMaster[] | null
  >(null);
  const [countryMaster, setCountryMasterO] = useState<countryMaster[] | null>(
    null
  );
  const stages: stageInfo[] = [
    { stageId: 1, stageName: "Registration", hasDone: false },
    { stageId: 2, stageName: "Address", hasDone: false },
    { stageId: 3, stageName: "Nominee", hasDone: false },
    { stageId: 4, stageName: "Profile", hasDone: false },
    { stageId: 5, stageName: "Bank", hasDone: false },
    { stageId: 6, stageName: "Document", hasDone: false },
    { stageId: 7, stageName: "Preview", hasDone: false },
  ];

  const [activeTab, setActiveTab] = useState<number>(stages[0].stageId);
  const [stageChange, setStage] = useState<stageInfo[]>(stages);

  const btnPrevious = () => setActiveTab(activeTab - 1);

  const btnNext = () => {
    setStage(
      stageChange.map((x) =>
        x.stageId === activeTab ? { ...x, hasDone: true } : x
      )
    );
    setActiveTab(activeTab + 1);
  };
  const fetchKycOverallStatus = async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const data = await getRequest<OverallInfo>("kyc/kycoverall/" + id);
      if (data.success) {
        const overall: overallStatusInfo[] = data.data.overall;
        const commonData: overallCommonInfo = data.data.commonData;
        setMinor(commonData.isMinor);
        setNri(commonData.isNri);
        setSecondHolder(commonData.isSecondHolder);
        setThirdHolder(commonData.isThirdHolder);

        const completedStageIds = overall
          .filter((o) => o.statusId === 2)
          .map((o) => o.stageId);

        setStage(
          stageChange.map((stage) =>
            completedStageIds.includes(stage.stageId)
              ? { ...stage, hasDone: true }
              : stage
          )
        );

        setActiveTab(completedStageIds.length + 1);
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchGuardianRelation = async () => {
    setLoading(true);
    try {
      const data = await getRequest("master/nomineeandguardrel_masters");
      if (data.success) {
        setGuardianRelation(data.data);
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchStateMaster = async () => {
    setLoading(true);
    try {
      const data = await getRequest("master/state_master");
      if (data.success) {
        setStateMasterO(data.data);
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchCountryMaster = async () => {
    setLoading(true);
    try {
      const data = await getRequest("master/country_master");
      if (data.success) {
        setCountryMasterO(data.data);
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchAddressProofMaster = async () => {
    setLoading(true);
    try {
      const data = await getRequest("master/addressproof_master");
      if (data.success) {
        setAddProofMaster(data.data);
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };

  const guardianRelationOptions: Option[] = useMemo(() => {
    return (
      guardinaRelation?.map((x) => ({
        ...x,
        label: x.value,
        value: x.code,
      })) ?? []
    );
  }, [guardinaRelation]);
  const countryOptions: Option[] = useMemo(() => {
    return (
      countryMaster?.map((x) => ({
        ...x,
        label: x.name,
        value: x.code,
      })) ?? []
    );
  }, [countryMaster]);

  const stateOptions: Option[] = useMemo(() => {
    return (
      stateMaster?.map((x) => ({
        ...x,
        label: x.name,
        value: x.code,
      })) ?? []
    );
  }, [stateMaster]);

  const addressProofOptions: Option[] = useMemo(() => {
    return (
      addProofMaster?.map((x) => ({
        ...x,
        label: x.idType,
        value: x.idTypeId,
      })) ?? []
    );
  }, [addProofMaster]);
  useEffect(() => {
    fetchGuardianRelation();
    fetchCountryMaster();
    fetchStateMaster();
    fetchAddressProofMaster();
    fetchKycOverallStatus();
  }, []);
  useEffect(() => {
    setProofMaster(addressProofOptions);
    setStateMaster(stateOptions);
    setCountryMaster(countryOptions);
    setRelationMaster(guardianRelationOptions);
  }, [
    guardianRelationOptions,
    stateOptions,
    countryOptions,
    addressProofOptions,
  ]);

  return (
    <KycContext.Provider
      value={{
        isNri,
        setNri,
        isMinor,
        setMinor,
        isSecondHolder,
        setSecondHolder,
        isThirdHolder,
        setThirdHolder,
        getStateMaster,
        setStateMaster,
        getCountryMaster,
        setCountryMaster,
        getProofMaster,
        setProofMaster,
        getRelationMaster,
        setRelationMaster,
        jointHolderPanExempt,
        setJoinHolderPanExempt,
      }}
    >
      <WithLoader loading={loading}>
        <div className="w-full mx-auto">
          {/* Tabs */}
          <div className="overflow-x-auto border-b border-gray-200">
            <div className="flex min-w-max">
              {stageChange.map((stage) => (
                <button
                  key={stage.stageId}
                  onClick={() => setActiveTab(stage.stageId)}
                  className={`flex-1 py-2 px-3 text-center text-sm sm:text-base font-medium whitespace-nowrap transition-colors duration-200
                ${
                  activeTab === stage.stageId && !stage.hasDone
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : activeTab === stage.stageId && stage.hasDone
                    ? "border-b-2 border-green-600 text-green-600"
                    : stage.hasDone
                    ? "border-b-2 border-green-600 hover:text-green-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
                >
                  {stage.stageName}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="sm:p-4 shadow rounded-b-lg">
            {activeTab === 1 && (
              <Register
                btnNext={btnNext}
                btnPrevious={btnPrevious}
                activeTab={activeTab}
                paramId={id === undefined || id?.length > 0 ? id : ""}
              />
            )}
            {activeTab === 2 && (
              <div>
                <Address
                  btnNext={btnNext}
                  btnPrevious={btnPrevious}
                  activeTab={activeTab}
                  paramId={id === undefined || id?.length > 0 ? id : ""}
                />
              </div>
            )}
            {activeTab === 3 && (
              <div>
                <Nominee
                  btnNext={btnNext}
                  btnPrevious={btnPrevious}
                  activeTab={activeTab}
                  paramId={id === undefined || id?.length > 0 ? id : ""}
                />
              </div>
            )}
            {activeTab === 4 && (
              <Profile
                btnNext={btnNext}
                btnPrevious={btnPrevious}
                activeTab={activeTab}
                paramId={id === undefined || id?.length > 0 ? id : ""}
              />
            )}
            {activeTab === 5 && (
              <Bank
                btnNext={btnNext}
                btnPrevious={btnPrevious}
                activeTab={activeTab}
                paramId={id === undefined || id?.length > 0 ? id : ""}
              />
            )}
            {activeTab === 6 && <Document />}
            {activeTab === 7 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Preview</h2>
                <p className="text-gray-600">This is the preview info area.</p>
              </div>
            )}
          </div>
        </div>
      </WithLoader>
    </KycContext.Provider>
  );
};

export default KycLayout;
