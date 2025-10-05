import { useContext, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import DatePicker from "../../components/form/date-picker";
import Form from "../../components/form/Form";
import ComponentCard from "../../components/common/ComponentCard";
import Select from "../../components/form/Select";
import WithLoader from "../../components/Loader/WithLoader";
import { getRequest, postRequest } from "../../services/axios";
import { Option } from "../../components/form/Select";
import Switch from "../../components/form/switch/Switch";
import { KycContext } from "../../context/KycContext";
import { useNavigate } from "react-router";

export type StageProps = {
  btnPrevious: () => void;
  btnNext: () => void;
  activeTab: number;
  paramId: string | undefined;
};

interface PrimaryHolder {
  firstName: string;
  middleName: string;
  lastName: string;
  taxStatus: string;
  panExempt: string;
  exemptCategory: string;
  gender: string;
  dob: string;
  pan: string;
  occupationCode: string;
  holdingNature: string;
}
interface SecondHolder {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  pan: string;
  panExempt: string;
  exemptCategory: string;
}
interface ThirdHolder {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  pan: string;
  panExempt: string;
  exemptCategory: string;
}
interface GuardianIfMinor {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  pan: string;
  panExempt: string;
  exemptCategory: string;
  relation: string;
}
interface Others {
  clientType: string;
  pms: string;
  defaultDp: string;
  cdslDpId: string;
  cdslCltid: string;
  cmbpId: string;
  nsdlDpid: string;
  nsdlCltid: string;
  client_code: string;
  aadhaar_updated: string;
  mapin_id: string;
  paperless_flag: string;
  lei_no: string;
  lei_validity: string;
}
interface Registration {
  _id: string;
  id: string;
  primaryHolder: PrimaryHolder;
  secondHolder: SecondHolder;
  thirdHolder: ThirdHolder;
  gurdianIfMinor: GuardianIfMinor;
  others: Others;
  isNri: boolean;
  isKra: boolean;
  isDigiLocker: boolean;
  isMinor: boolean;
  isSecondHolder: boolean;
  isThirdHolder: boolean;
}
interface TaxMaster {
  id: string;
  code: string;
  status: string;
}
interface OccupationMaster {
  id: string;
  code: string;
  details: string;
}
interface HoldingNatureMaster {
  id: string;
  code: string;
  details: string;
}
interface PanExemptCatMaster {
  id: string;
  code: string;
  description: string;
}

const Register = ({ btnPrevious, btnNext, activeTab, paramId }: StageProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [exemptCat, enableExemptCat] = useState<boolean>(false);
  const [exemptCatSH, enableExemptCatSH] = useState<boolean>(false);
  const [exemptCatTH, enableExemptCatTH] = useState<boolean>(false);
  const [exemptCatGuardian, enableExemptCatGuardian] = useState<boolean>(false);
  const [secondHolder, enableSecondHolder] = useState<boolean>(false);
  const [thirdHolder, enableThirdHolder] = useState<boolean>(false);
  const [guardian, enableGuardian] = useState<boolean>(false);
  const [taxMaster, setTaxMaster] = useState<TaxMaster[] | null>(null);
  const [occupation, setOccupation] = useState<OccupationMaster[] | null>(null);
  const [holdingNature, setHoldingNature] = useState<
    HoldingNatureMaster[] | null
  >(null);
  const [panExemptCat, setPanExemptCat] = useState<PanExemptCatMaster[] | null>(
    null
  );
  const contextProvider = useContext(KycContext);
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const panNameRegex = /^[A-Za-z ]+$/;

  const is18Plus = (dob: string): boolean => {
    if (!dob) return false;

    // Expecting DD-MM-YYYY
    const [day, month, year] = dob.split("-").map(Number);
    const birth = new Date(year, month - 1, day); // month is 0-based

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age >= 18;
  };

  const genderOptions: Option[] = [
    { value: "F", label: "Female" },
    { value: "M", label: "Male" },
    { value: "T", label: "TransGender" },
    { value: "O", label: "Others" },
  ];
  const schema = useMemo(
    () =>
      yup.object({
        isNri: yup.boolean().default(false),
        isKra: yup.boolean().default(false),
        isDigiLocker: yup.boolean().default(false),
        isMinor: yup.boolean().default(false),
        isSecondHolder: yup.boolean().default(false),
        isThirdHolder: yup.boolean().default(false),

        primaryHolder: yup.object({
          firstName: yup
            .string()
            .required("First name is required")
            .matches(panNameRegex, "Invalid first name"),
          middleName: yup.string().nullable(),
          lastName: yup
            .string()
            .required("Last name is required")
            .matches(panNameRegex, "Invalid last name"),
          taxStatus: yup.string().required("Tax status is required"),
          panExempt: yup.string().default("N"),
          exemptCategory: exemptCat
            ? yup.string().required("Exempt category is required")
            : yup.string().notRequired(),
          gender: yup.string().required("Gender is required."),
          dob: yup.string().required("Date of Birth is required"),
          pan: yup
            .string()
            .required("Pannumber is required")
            .matches(panRegex, "Invalid Pannumber")
            .transform((val) => val?.toUpperCase()),
          occupationCode: yup.string().required("Occupation is required"),
          holdingNature: yup.string().required("Holding nature is required"),
        }),

        // SECOND HOLDER
        secondHolder: yup.object({
          firstName: secondHolder
            ? yup
                .string()
                .required("First name is required")
                .matches(panNameRegex, "Invalid first name")
            : yup.string().notRequired(),
          middleName: yup.string().nullable(),
          lastName: secondHolder
            ? yup
                .string()
                .required("Last name is required")
                .matches(panNameRegex, "Invalid last name")
            : yup.string().notRequired(),
          dob: secondHolder
            ? yup.string().required("Date of Birth is required")
            : yup.string().notRequired(),
          pan: secondHolder
            ? yup
                .string()
                .required("Pan number is required")
                .matches(panRegex, "Invalid Pannumber")
                .transform((val) => val?.toUpperCase())
            : yup.string().notRequired(),
          panExempt: yup.string().default("N"),
          exemptCategory:
            secondHolder && exemptCatSH
              ? yup.string().required("Exempt category is required")
              : yup.string().notRequired(),
        }),

        // THIRD HOLDER
        thirdHolder: yup.object({
          firstName: thirdHolder
            ? yup
                .string()
                .required("First name is required")
                .matches(panNameRegex, "Invalid first name")
            : yup.string().notRequired(),
          middleName: yup.string().nullable(),
          lastName: thirdHolder
            ? yup
                .string()
                .required("Last name is required")
                .matches(panNameRegex, "Invalid last name")
            : yup.string().notRequired(),
          dob: thirdHolder
            ? yup.string().required("Date of Birth is required")
            : yup.string().notRequired(),
          pan: thirdHolder
            ? yup
                .string()
                .required("Pan number is required")
                .matches(panRegex, "Invalid Pannumber")
                .transform((val) => val?.toUpperCase())
            : yup.string().notRequired(),
          panExempt: yup.string().default("N"),
          exemptCategory:
            thirdHolder && exemptCatTH
              ? yup.string().required("Exempt category is required")
              : yup.string().notRequired(),
        }),

        // GUARDIAN
        gurdianIfMinor: yup.object({
          firstName: guardian
            ? yup
                .string()
                .required("First name is required")
                .matches(panNameRegex, "Invalid first name")
            : yup.string().notRequired(),
          middleName: yup.string().nullable(),
          lastName: guardian
            ? yup
                .string()
                .required("Last name is required")
                .matches(panNameRegex, "Invalid last name")
            : yup.string().notRequired(),
          dob: guardian
            ? yup.string().required("Date of Birth is required")
            : yup.string().notRequired(),
          pan: guardian
            ? yup
                .string()
                .required("Pannumber is required")
                .matches(panRegex, "Please enter valid pan number")
                .transform((val) => val?.toUpperCase())
            : yup.string().notRequired(),
          panExempt: yup.string().default("N"),
          exemptCategory:
            guardian && exemptCatGuardian
              ? yup.string().required("Exempt category is required")
              : yup.string().notRequired(),
          relation: guardian
            ? yup.string().required("Guardian relation is required")
            : yup.string().notRequired(),
        }),

        others: yup.object({
          clientType: yup.string().default(""),
          pms: yup.string().default(""),
          defaultDp: yup.string().default(""),
          cdslDpId: yup.string().default(""),
          cdslCltid: yup.string().default(""),
          cmbpId: yup.string().default(""),
          nsdlDpid: yup.string().default(""),
          nsdlCltid: yup.string().default(""),
          client_code: yup.string().default(generateKRId()),
          aadhaar_updated: yup.string().default(""),
          mapin_id: yup.string().default(""),
          paperless_flag: yup.string().default(""),
          lei_no: yup.string().default(""),
          lei_validity: yup.string().default(""),
        }),
      }),
    [
      secondHolder,
      thirdHolder,
      guardian,
      exemptCat,
      exemptCatSH,
      exemptCatTH,
      exemptCatGuardian,
    ]
  );

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    resetField,
    reset,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<Registration>({
    resolver: yupResolver(schema) as any,
    context: {
      isMinor: guardian,
      isSecondHolder: secondHolder,
      isThirdHolder: thirdHolder,
    },
  });
  function generateKRId(length: number = 6): string {
    // length = number of digits after KR
    const randomDigits = Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, "0"); // ensure fixed length with leading zeros

    return `KR${randomDigits}`;
  }
  const onSubmit = async (data: Registration) => {
    setLoading(true);
    try {
      let resp: any;

      if (paramId) {
        data.id = paramId;
      }

      resp = await postRequest<Registration>("kyc/register", data);

      if (resp.success) {
        console.log(resp);
        contextProvider?.setMinor(data.isMinor);
        contextProvider?.setNri(data.isNri);
        contextProvider?.setSecondHolder(data.isSecondHolder);
        contextProvider?.setThirdHolder(data.isThirdHolder);
        if (!paramId) navigate(`/kyclayout/${resp.data._id}`);
        btnNext();
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisterInfo = async () => {
    if (!paramId) return null;
    setLoading(true);
    try {
      const response = await getRequest("kyc/register/" + paramId);
      if (response.success) {
        const stringResponse = JSON.stringify(response.data);
        const bindRegisterInfo = JSON.parse(stringResponse);
        contextProvider?.setMinor(bindRegisterInfo.isMinor);
        contextProvider?.setNri(bindRegisterInfo.isNri);
        contextProvider?.setSecondHolder(bindRegisterInfo.isSecondHolder);
        contextProvider?.setThirdHolder(bindRegisterInfo.isThirdHolder);
        reset(bindRegisterInfo);
      }
    } catch (err) {
      console.error("Error fetching KYC register:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchPanExemptCat = async () => {
    setLoading(true);
    try {
      const data = await getRequest("master/pan_exemptcat_master");
      if (data.success) {
        setPanExemptCat(data.data);
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchTaxMaster = async () => {
    setLoading(true);
    try {
      const data = await getRequest("master/tax_master");
      if (data.success) {
        setTaxMaster(data.data);
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchOccupation = async () => {
    setLoading(true);
    try {
      const data = await getRequest("master/occupation_master");
      if (data.success) {
        setOccupation(data.data);
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchHoldingNature = async () => {
    setLoading(true);
    try {
      const data = await getRequest("master/holding_nature_master");
      if (data.success) {
        setHoldingNature(data.data);
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const taxOptions: Option[] = useMemo(() => {
    return (
      taxMaster?.map((x) => ({
        ...x,
        label: x.status,
        value: x.code,
      })) ?? []
    );
  }, [taxMaster]);

  const occupationOptions: Option[] = useMemo(() => {
    return (
      occupation?.map((x) => ({
        ...x,
        label: x.details,
        value: x.code,
      })) ?? []
    );
  }, [occupation]);

  const holdingOptions: Option[] = useMemo(() => {
    return (
      holdingNature?.map((x) => ({
        ...x,
        label: x.details,
        value: x.code,
      })) ?? []
    );
  }, [holdingNature]);
  const panExemptCatOptions: Option[] = useMemo(() => {
    return (
      panExemptCat?.map((x) => ({
        ...x,
        label: x.description,
        value: x.code,
      })) ?? []
    );
  }, [panExemptCat]);
  useEffect(() => {
    fetchPanExemptCat();
    fetchTaxMaster();
    fetchOccupation();
    fetchHoldingNature();
    fetchRegisterInfo();
  }, [reset]);
  const PrimaryPanExemptValue = watch("primaryHolder.panExempt");
  const SecondPanExemptValue = watch("secondHolder.panExempt");
  const ThirdPanExemptValue = watch("thirdHolder.panExempt");
  const GuardianPanExemptValue = watch("gurdianIfMinor.panExempt");
  const ensureThirdHolder = watch("isThirdHolder");
  const ensureSecondHolder = watch("isSecondHolder");
  const ensureGuardian = watch("isMinor");
  useEffect(() => {
    const checked = PrimaryPanExemptValue === "Y";
    enableExemptCat(checked);

    const checkedSH = SecondPanExemptValue === "Y";
    enableExemptCatSH(checkedSH);

    const checkedTH = ThirdPanExemptValue === "Y";
    enableExemptCatTH(checkedTH);

    const checkedGuardian = GuardianPanExemptValue === "Y";
    enableExemptCatGuardian(checkedGuardian);
    contextProvider?.setJoinHolderPanExempt([
      checked,
      checkedSH,
      checkedTH,
      checkedGuardian,
    ]);

    const checkedThirdHolder = ensureThirdHolder;
    enableThirdHolder(checkedThirdHolder);

    enableGuardian(ensureGuardian);
    enableSecondHolder(ensureSecondHolder);
  }, [
    PrimaryPanExemptValue,
    SecondPanExemptValue,
    ThirdPanExemptValue,
    GuardianPanExemptValue,
    ensureThirdHolder,
    ensureSecondHolder,
    ensureGuardian,
    resetField,
  ]);

  return (
    <div>
      <WithLoader loading={loading}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <ComponentCard title="PRIMARY HOLDER" enableTitleCard={true}>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="firstName" mandatory={true}>
                    FIRST NAME
                  </Label>
                  <Controller
                    name="primaryHolder.firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your first name"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.primaryHolder?.firstName}
                        hint={errors.primaryHolder?.firstName?.message || ""}
                        success={
                          isSubmitted && !errors.primaryHolder?.firstName
                        }
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/4">
                  <Label htmlFor="middleName" mandatory={false}>
                    MIDDLE NAME
                  </Label>
                  <Controller
                    name="primaryHolder.middleName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your middle name"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.primaryHolder?.middleName}
                        hint={errors.primaryHolder?.middleName?.message || ""}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="lastName" mandatory={true}>
                    LAST NAME
                  </Label>
                  <Controller
                    name="primaryHolder.lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your last name"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.primaryHolder?.lastName}
                        hint={errors.primaryHolder?.lastName?.message || ""}
                        success={isSubmitted && !errors.primaryHolder?.lastName}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="taxStatus" mandatory={true}>
                    TAX STATUS
                  </Label>
                  <Controller
                    name="primaryHolder.taxStatus"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        options={taxOptions}
                        error={!!errors.primaryHolder?.taxStatus}
                        hint={errors.primaryHolder?.taxStatus?.message || ""}
                        success={
                          isSubmitted && !errors.primaryHolder?.taxStatus
                        }
                        onChange={(value: string) => {
                          const nriResident: string[] = [
                            "11",
                            "21",
                            "24",
                            "26",
                            "27",
                            "28",
                            "29",
                          ];
                          setValue("isNri", nriResident.includes(value));
                          setValue("primaryHolder.taxStatus", value);
                        }}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/4">
                  <Label htmlFor="panNumber" mandatory={true}>
                    PAN NUMBER
                  </Label>
                  <Controller
                    name="primaryHolder.pan"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your pan number"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.primaryHolder?.pan}
                        hint={errors.primaryHolder?.pan?.message || ""}
                        success={isSubmitted && !errors.primaryHolder?.pan}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="dob" mandatory={true}>
                    DOB
                  </Label>
                  <Controller
                    name="primaryHolder.dob"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id="date-picker-primary"
                        placeholder="Select a date"
                        onChange={(_, dateString) => {
                          const minor = !is18Plus(dateString); // ✅ calculate directly
                          enableGuardian(minor); // update your UI state
                          setValue("isMinor", minor); // sync with form
                          field.onChange(dateString);
                        }}
                        value={field.value ?? ""}
                        error={!!errors.primaryHolder?.dob}
                        hint={errors.primaryHolder?.dob?.message || ""}
                        success={isSubmitted && !errors.primaryHolder?.dob}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="gender" mandatory={true}>
                    GENDER
                  </Label>
                  <Controller
                    name="primaryHolder.gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        options={genderOptions}
                        error={!!errors.primaryHolder?.gender}
                        hint={errors.primaryHolder?.gender?.message || ""}
                        success={isSubmitted && !errors.primaryHolder?.gender}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/4">
                  <Label htmlFor="occupation" mandatory={true}>
                    OCCUPATION
                  </Label>
                  <Controller
                    name="primaryHolder.occupationCode"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        options={occupationOptions}
                        error={!!errors.primaryHolder?.occupationCode}
                        hint={
                          errors.primaryHolder?.occupationCode?.message || ""
                        }
                        success={
                          isSubmitted && !errors.primaryHolder?.occupationCode
                        }
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="holdingNature" mandatory={true}>
                    HOLDING NATURE
                  </Label>
                  <Controller
                    name="primaryHolder.holdingNature"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        options={holdingOptions}
                        error={!!errors.primaryHolder?.holdingNature}
                        hint={
                          errors.primaryHolder?.holdingNature?.message || ""
                        }
                        onChange={(value: string) => {
                          value === "JO" || value === "AS"
                            ? (enableSecondHolder(true),
                              setValue("isSecondHolder", true))
                            : (enableSecondHolder(false),
                              setValue("isSecondHolder", false));
                          setValue("primaryHolder.holdingNature", value);
                        }}
                        success={
                          isSubmitted && !errors.primaryHolder?.holdingNature
                        }
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                <div className="relative w-full sm:w-1/3">
                  <Controller
                    name="primaryHolder.panExempt"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        label="PAN EXEMPTION"
                        {...field}
                        defaultChecked={field.value === "Y"}
                        onChange={(checked: boolean) => {
                          field.onChange(checked ? "Y" : "N");
                          enableExemptCat(checked);
                          setValue(
                            "primaryHolder.panExempt",
                            checked ? "Y" : "N"
                          );
                          resetField("primaryHolder.exemptCategory");
                        }}
                      />
                    )}
                  />
                </div>
                {exemptCat ? (
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="exemptCategory" mandatory={true}>
                      PAN EXEMPT CATEGORY
                    </Label>
                    <Controller
                      name="primaryHolder.exemptCategory"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={panExemptCatOptions}
                          error={!!errors.primaryHolder?.exemptCategory}
                          hint={
                            errors.primaryHolder?.exemptCategory?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues("primaryHolder.exemptCategory") &&
                            !errors.primaryHolder?.exemptCategory
                          }
                        />
                      )}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </ComponentCard>
            {secondHolder ? (
              <ComponentCard title="SECOND HOLDER" enableTitleCard={true}>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="firstName" mandatory={true}>
                      FIRST NAME
                    </Label>
                    <Controller
                      name="secondHolder.firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your first name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.secondHolder?.firstName}
                          hint={errors.secondHolder?.firstName?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("secondHolder.firstName") &&
                            !errors.secondHolder?.firstName
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="middleName" mandatory={false}>
                      MIDDLE NAME
                    </Label>
                    <Controller
                      name="secondHolder.middleName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your middle name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.secondHolder?.middleName}
                          hint={errors.secondHolder?.middleName?.message || ""}
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="lastName" mandatory={true}>
                      LAST NAME
                    </Label>
                    <Controller
                      name="secondHolder.lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your last name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.secondHolder?.lastName}
                          hint={errors.secondHolder?.lastName?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("secondHolder.lastName") &&
                            !errors.secondHolder?.lastName
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="panNumber" mandatory={true}>
                      PAN NUMBER
                    </Label>
                    <Controller
                      name="secondHolder.pan"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your pan number"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.secondHolder?.pan}
                          hint={errors.secondHolder?.pan?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("secondHolder.pan") &&
                            !errors.secondHolder?.pan
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="dob" mandatory={true}>
                      DOB
                    </Label>
                    <Controller
                      name="secondHolder.dob"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id="date-picker-second"
                          placeholder="Select a date"
                          onChange={(_, dateString) =>
                            field.onChange(dateString)
                          }
                          value={field.value}
                          error={!!errors.secondHolder?.dob}
                          hint={errors.secondHolder?.dob?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("secondHolder.dob") &&
                            !errors.secondHolder?.dob
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Controller
                      name="secondHolder.panExempt"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          label="PAN EXEMPTION"
                          defaultChecked={field.value === "Y"}
                          onChange={(checked: boolean) => {
                            enableExemptCatSH(checked);
                            setValue(
                              "secondHolder.panExempt",
                              checked ? "Y" : "N"
                            );
                            resetField("secondHolder.exemptCategory");
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                  {exemptCatSH ? (
                    <div className="relative w-full sm:w-1/3">
                      <Label htmlFor="exemptCategory" mandatory={true}>
                        PAN EXEMPT CATEGORY
                      </Label>
                      <Controller
                        name="secondHolder.exemptCategory"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={field.value}
                            options={panExemptCatOptions}
                            error={!!errors.secondHolder?.exemptCategory}
                            hint={
                              errors.secondHolder?.exemptCategory?.message || ""
                            }
                            success={
                              isSubmitted &&
                              !!getValues("secondHolder.exemptCategory") &&
                              !errors.secondHolder?.exemptCategory
                            }
                          />
                        )}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex items-center gap-3">
                    <Controller
                      name="isThirdHolder"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          label="Do you want to add third holder information."
                          defaultChecked={field.value}
                          onChange={(checked: boolean) => {
                            enableThirdHolder(checked);
                            setValue("isThirdHolder", true);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </ComponentCard>
            ) : (
              ""
            )}
            {thirdHolder ? (
              <ComponentCard title="THIRD HOLDER" enableTitleCard={true}>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="firstName" mandatory={true}>
                      FIRST NAME
                    </Label>
                    <Controller
                      name="thirdHolder.firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your first name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.thirdHolder?.firstName}
                          hint={errors.thirdHolder?.firstName?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("thirdHolder.firstName") &&
                            !errors.thirdHolder?.firstName
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="middleName" mandatory={false}>
                      MIDDLE NAME
                    </Label>
                    <Controller
                      name="thirdHolder.middleName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your middle name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.thirdHolder?.middleName}
                          hint={errors.thirdHolder?.middleName?.message || ""}
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="lastName" mandatory={true}>
                      LAST NAME
                    </Label>
                    <Controller
                      name="thirdHolder.lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your last name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.thirdHolder?.lastName}
                          hint={errors.thirdHolder?.lastName?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("thirdHolder.lastName") &&
                            !errors.thirdHolder?.lastName
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="panNumber" mandatory={true}>
                      PAN NUMBER
                    </Label>
                    <Controller
                      name="thirdHolder.pan"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your pan number"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.thirdHolder?.pan}
                          hint={errors.thirdHolder?.pan?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("thirdHolder.pan") &&
                            !errors.thirdHolder?.pan
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="dob" mandatory={true}>
                      DOB
                    </Label>
                    <Controller
                      name="thirdHolder.dob"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id="date-picker-third"
                          placeholder="Select a date"
                          onChange={(_, dateString) =>
                            field.onChange(dateString)
                          }
                          value={field.value}
                          error={!!errors.thirdHolder?.dob}
                          hint={errors.thirdHolder?.dob?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("thirdHolder.dob") &&
                            !errors.thirdHolder?.dob
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Controller
                      name="thirdHolder.panExempt"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          label="PAN EXEMPTION"
                          defaultChecked={field.value === "Y"}
                          onChange={(checked: boolean) => {
                            enableExemptCatTH(checked);
                            setValue(
                              "thirdHolder.panExempt",
                              checked ? "Y" : "N"
                            );
                            resetField("thirdHolder.exemptCategory");
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {exemptCatTH ? (
                    <div className="relative w-full sm:w-1/3">
                      <Label htmlFor="exemptCategory" mandatory={true}>
                        PAN EXEMPT CATEGORY
                      </Label>
                      <Controller
                        name="thirdHolder.exemptCategory"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={field.value}
                            options={panExemptCatOptions}
                            error={!!errors.thirdHolder?.exemptCategory}
                            hint={
                              errors.thirdHolder?.exemptCategory?.message || ""
                            }
                            success={
                              isSubmitted &&
                              !!getValues("thirdHolder.exemptCategory") &&
                              !errors.thirdHolder?.exemptCategory
                            }
                          />
                        )}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </ComponentCard>
            ) : (
              ""
            )}
            {guardian ? (
              <ComponentCard title="GUARDIAN" enableTitleCard={true}>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="firstName" mandatory={true}>
                      FIRST NAME
                    </Label>
                    <Controller
                      name="gurdianIfMinor.firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your first name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.gurdianIfMinor?.firstName}
                          hint={errors.gurdianIfMinor?.firstName?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("gurdianIfMinor.firstName") &&
                            !errors.gurdianIfMinor?.firstName
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="middleName" mandatory={false}>
                      MIDDLE NAME
                    </Label>
                    <Controller
                      name="gurdianIfMinor.middleName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your middle name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.gurdianIfMinor?.middleName}
                          hint={
                            errors.gurdianIfMinor?.middleName?.message || ""
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="lastName" mandatory={true}>
                      LAST NAME
                    </Label>
                    <Controller
                      name="gurdianIfMinor.lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your last name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.gurdianIfMinor?.lastName}
                          hint={errors.gurdianIfMinor?.lastName?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("gurdianIfMinor.lastName") &&
                            !errors.gurdianIfMinor?.lastName
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="panNumber" mandatory={true}>
                      PAN NUMBER
                    </Label>
                    <Controller
                      name="gurdianIfMinor.pan"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your pan number"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.gurdianIfMinor?.pan}
                          hint={errors.gurdianIfMinor?.pan?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("gurdianIfMinor.pan") &&
                            !errors.gurdianIfMinor?.pan
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="dob" mandatory={true}>
                      DOB
                    </Label>
                    <Controller
                      name="gurdianIfMinor.dob"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id="date-picker-guardian"
                          placeholder="Select a date"
                          onChange={(_, dateString) =>
                            field.onChange(dateString)
                          }
                          value={field.value}
                          error={!!errors.gurdianIfMinor?.dob}
                          hint={errors.gurdianIfMinor?.dob?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("gurdianIfMinor.dob") &&
                            !errors.gurdianIfMinor?.dob
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Controller
                      name="gurdianIfMinor.panExempt"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          label="PAN EXEMPTION"
                          defaultChecked={field.value === "Y"}
                          onChange={(checked: boolean) => {
                            enableExemptCatGuardian(checked);
                            setValue(
                              "gurdianIfMinor.panExempt",
                              checked ? "Y" : "N"
                            );
                            resetField("gurdianIfMinor.exemptCategory");
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {exemptCatGuardian ? (
                    <div className="relative w-full sm:w-1/3">
                      <Label htmlFor="exemptCategory" mandatory={true}>
                        PAN EXEMPT CATEGORY
                      </Label>
                      <Controller
                        name="gurdianIfMinor.exemptCategory"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={field.value}
                            options={panExemptCatOptions}
                            error={!!errors.gurdianIfMinor?.exemptCategory}
                            hint={
                              errors.gurdianIfMinor?.exemptCategory?.message ||
                              ""
                            }
                            success={
                              isSubmitted &&
                              !!getValues("gurdianIfMinor.exemptCategory") &&
                              !errors.gurdianIfMinor?.exemptCategory
                            }
                          />
                        )}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="guardianRelation" mandatory={true}>
                      GUARDIAN RELATIONSHIP
                    </Label>
                    <Controller
                      name="gurdianIfMinor.relation"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getRelationMaster ?? []}
                          error={!!errors.gurdianIfMinor?.relation}
                          hint={errors.gurdianIfMinor?.relation?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("gurdianIfMinor.relation") &&
                            !errors.gurdianIfMinor?.relation
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              </ComponentCard>
            ) : (
              ""
            )}
            <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3 sm:gap-0">
              <button
                type="button"
                onClick={btnPrevious}
                disabled={activeTab <= 1}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                ⬅ Back
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Next ➡
              </button>
            </div>
          </div>
        </Form>
      </WithLoader>
    </div>
  );
};

export default Register;
