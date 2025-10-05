import React, { useContext, useEffect, useMemo, useState } from "react";
import Input from "../../components/form/input/InputField";
import { StageProps } from "./Register";
import WithLoader from "../../components/Loader/WithLoader";
import { KycContext } from "../../context/KycContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { Option } from "../../components/form/Select";
import Form from "../../components/form/Form";
import { getRequest, postRequest } from "../../services/axios";

interface Profile {
  kycType: string;
  ckycNumber: string;
  resiPhone: string;
  resiFax: string;
  officePhone: string;
  officeFax: string;
  email: string;
  mobile: string;
  communicationMode: string;
  mobileDeclaration: string;
  emailDeclaration: string;
  isMobileValid: boolean;
  isEmailValid: boolean;
  exemptRefNo: string;
  forginContact: ForginContact;
}
interface ForginContact {
  resiPhone: string;
  resiFax: string;
  officePhone: string;
  officeFax: string;
  indianMobileNo: string;
  isMobileValid: boolean;
}
interface JointHolder {
  kycType: string;
  ckycNumber: string;
  email: string;
  mobile: string;
  mobileDeclaration: string;
  emailDeclaration: string;
  isMobileValid: boolean;
  isEmailValid: boolean;
  exemptRefNo: string;
}
interface ProfileGuardian {
  kycType: string;
  ckycNumber: string;
  relation: string;
  exemptRefNo: string;
}
interface ProfileInfo {
  registerId: string;
  primaryHolder: Profile;
  secondHolder: JointHolder;
  thirdHolder: JointHolder;
  guardianIfMinor: ProfileGuardian;
}
const Profile = ({ btnPrevious, btnNext, activeTab, paramId }: StageProps) => {
  const contextProvider = useContext(KycContext);
  const [loading, setLoading] = useState(false);
  const [CkycNumberPH, enableCkycNumberPH] = useState<boolean>(false);
  const [CkycNumberSH, enableCkycNumberSH] = useState<boolean>(false);
  const [CkycNumberTH, enableCkycNumberTH] = useState<boolean>(false);
  const [CkycNumberG, enableCkycNumberG] = useState<boolean>(false);
  const schema = yup.object({
    primaryHolder: yup
      .object({
        kycType: yup.string().required("Primary Holder KYC Type is required"),
        ckycNumber: CkycNumberPH
          ? yup.string().required("Primary Holder CKYC Number is required")
          : yup.string().notRequired(),
        resiPhone: yup.string().notRequired(),
        resiFax: yup.string().notRequired(),
        officePhone: yup.string().notRequired(),
        officeFax: yup.string().notRequired(),
        email: yup
          .string()
          .email("Invalid email format for Primary Holder")
          .required("Primary Holder Email is required"),
        mobile: yup
          .string()
          .required("Primary Holder Mobile Number is required"),
        communicationMode: yup.string().default("M"),
        mobileDeclaration: yup
          .string()
          .required("Primary Holder Mobile Declaration is required"),
        emailDeclaration: yup
          .string()
          .required("Primary Holder Email Declaration is required"),
        isMobileValid: yup.boolean().optional().default(false),
        isEmailValid: yup.boolean().optional().default(false),
        exemptRefNo: contextProvider?.jointHolderPanExempt[0]
          ? yup.string().required("Pan exemption number is required")
          : yup.string().notRequired(),

        forginContact: yup.object({
          resiPhone: yup.string().default("").notRequired(),
          resiFax: yup.string().default("").notRequired(),
          officePhone: yup.string().default("").notRequired(),
          officeFax: yup.string().default("").notRequired(),
          indianMobileNo: yup.string().default("").notRequired(),
          isMobileValid: yup.boolean().default(false).notRequired(),
        }),
      })
      .required("Primary Holder details are required"),

    secondHolder: yup.object({
      kycType: contextProvider?.isSecondHolder
        ? yup.string().required("Second Holder KYC Type is required")
        : yup.string().notRequired(),
      ckycNumber:
        CkycNumberSH && contextProvider?.isSecondHolder
          ? yup.string().required("Second Holder CKYC Number is required")
          : yup.string().notRequired(),
      email: contextProvider?.isSecondHolder
        ? yup
            .string()
            .email("Invalid email format for Second Holder")
            .required("Second Holder Email is required")
        : yup.string().notRequired(),
      mobile: contextProvider?.isSecondHolder
        ? yup.string().required("Second Holder Mobile Number is required")
        : yup.string().notRequired(),
      mobileDeclaration: contextProvider?.isSecondHolder
        ? yup.string().required("Second Holder Mobile Declaration is required")
        : yup.string().notRequired(),
      emailDeclaration: contextProvider?.isSecondHolder
        ? yup.string().required("Second Holder Email Declaration is required")
        : yup.string().notRequired(),
      isMobileValid: yup.boolean().optional().default(false),
      isEmailValid: yup.boolean().optional().default(false),
      exemptRefNo: contextProvider?.jointHolderPanExempt[1]
        ? yup.string().required("Pan exemption number is required")
        : yup.string().notRequired(),
    }),

    thirdHolder: yup.object({
      kycType: contextProvider?.isThirdHolder
        ? yup.string().required("Third Holder KYC Type is required")
        : yup.string().notRequired(),
      ckycNumber:
        CkycNumberTH && contextProvider?.isThirdHolder
          ? yup.string().required("Third Holder CKYC Number is required")
          : yup.string().notRequired(),
      email: contextProvider?.isThirdHolder
        ? yup
            .string()
            .email("Invalid email format for Third Holder")
            .required("Third Holder Email is required")
        : yup.string().notRequired(),
      mobile: contextProvider?.isThirdHolder
        ? yup.string().required("Third Holder Mobile Number is required")
        : yup.string().notRequired(),
      mobileDeclaration: contextProvider?.isThirdHolder
        ? yup.string().required("Third Holder Mobile Declaration is required")
        : yup.string().notRequired(),
      emailDeclaration: contextProvider?.isThirdHolder
        ? yup.string().required("Third Holder Email Declaration is required")
        : yup.string().notRequired(),
      isMobileValid: yup.boolean().optional().default(false),
      isEmailValid: yup.boolean().optional().default(false),
      exemptRefNo:
        contextProvider?.jointHolderPanExempt[2] &&
        contextProvider?.isThirdHolder
          ? yup.string().required("Pan exemption number is required")
          : yup.string().notRequired(),
    }),

    guardianIfMinor: yup.object({
      kycType: contextProvider?.isMinor
        ? yup.string().required("Guardian KYC Type is required for Minor")
        : yup.string().nullable(),
      ckycNumber:
        CkycNumberG && contextProvider?.isMinor
          ? yup.string().required("Guardian CKYC Number is required for Minor")
          : yup.string().nullable(),
      relation: contextProvider?.isMinor
        ? yup.string().required("Guardian Relation is required for Minor")
        : yup.string().nullable(),
      exemptRefNo:
        contextProvider?.isMinor && contextProvider?.jointHolderPanExempt[3]
          ? yup.string().required("Exemptref number is required")
          : yup.string().notRequired(),
    }),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<ProfileInfo>({
    resolver: yupResolver(schema) as any,
  });
  const kycTypeOptions: Option[] = useMemo(() => {
    return [
      { label: "KRA COMPLIANT", value: "K" },
      { label: "CKYC COMPLIANT", value: "C" },
      { label: "BIOMETRIC KYC", value: "B" },
      { label: "AADHAAREKYC PAN", value: "E" },
    ];
  }, []);
  const emailAndMobileDecOptions: Option[] = useMemo(() => {
    return [
      { label: "SELF", value: "S" },
      { label: "SPOUSE", value: "U" },
      { label: "DEPENDENT PARENT", value: "p" },
      { label: "DEPENDENT CHILDREN", value: "C" },
    ];
  }, []);
  const fetchProfileInfo = async () => {
    if (!paramId) return null;
    setLoading(true);
    try {
      const response = await getRequest("kyc/profile/" + paramId);
      if (response.success) {
        const stringResponse = JSON.stringify(response.data);
        const bindProfileInfo = JSON.parse(stringResponse);
        reset(bindProfileInfo);
      }
    } catch (err) {
      console.error("Error fetching KYC register:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfileInfo();
  }, [reset]);
  const onSubmit = async (data: ProfileInfo) => {
    setLoading(true);
    try {
      let resp: any;
      if (paramId) {
        data.registerId = paramId;
      }

      resp = await postRequest("kyc/profile", data);

      if (resp.success) {
        btnNext();
      }
    } catch (err) {
      console.error("Error insert profile:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <WithLoader loading={loading}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <ComponentCard title="PRIMARY HOLDER" enableTitleCard={true}>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="kycType" mandatory={true}>
                    KYC TYPE
                  </Label>
                  <Controller
                    name="primaryHolder.kycType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        onChange={(value: string) => {
                          enableCkycNumberPH(value === "C" ? true : false);
                          setValue("primaryHolder.kycType", value);
                        }}
                        options={kycTypeOptions}
                        error={!!errors.primaryHolder?.kycType}
                        hint={errors.primaryHolder?.kycType?.message || ""}
                        success={isSubmitted && !errors.primaryHolder?.kycType}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/4">
                  <Label htmlFor="ckycNo" mandatory={true}>
                    CKYC NUMBER
                  </Label>
                  <Controller
                    name="primaryHolder.ckycNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the ckcy Number"
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }}
                        error={!!errors.primaryHolder?.ckycNumber}
                        hint={errors.primaryHolder?.ckycNumber?.message || ""}
                        success={
                          isSubmitted &&
                          !!getValues("primaryHolder.ckycNumber") &&
                          !errors.primaryHolder?.ckycNumber
                        }
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="email" mandatory={true}>
                    EMAIL ADDRESS
                  </Label>
                  <Controller
                    name="primaryHolder.email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the email address"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.primaryHolder?.email}
                        hint={errors.primaryHolder?.email?.message || ""}
                        success={isSubmitted && !errors.primaryHolder?.email}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="mobile" mandatory={true}>
                    MOBILE NUMBER
                  </Label>
                  <Controller
                    name="primaryHolder.mobile"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the mobile number"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.primaryHolder?.mobile}
                        hint={errors.primaryHolder?.mobile?.message || ""}
                        success={isSubmitted && !errors.primaryHolder?.mobile}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/4">
                  <Label htmlFor="mobileDeclaretion" mandatory={true}>
                    MOBILE DECLARATION
                  </Label>
                  <Controller
                    name="primaryHolder.mobileDeclaration"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        options={emailAndMobileDecOptions}
                        error={!!errors.primaryHolder?.mobileDeclaration}
                        hint={
                          errors.primaryHolder?.mobileDeclaration?.message || ""
                        }
                        success={
                          isSubmitted &&
                          !errors.primaryHolder?.mobileDeclaration
                        }
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="emailDeclaretion" mandatory={true}>
                    EMAIL DECLARATION
                  </Label>
                  <Controller
                    name="primaryHolder.emailDeclaration"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        options={emailAndMobileDecOptions}
                        error={!!errors.primaryHolder?.emailDeclaration}
                        hint={
                          errors.primaryHolder?.emailDeclaration?.message || ""
                        }
                        success={
                          isSubmitted && !errors.primaryHolder?.emailDeclaration
                        }
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="exemptRefNo" mandatory={true}>
                    EXEMPT REF NO
                  </Label>
                  <Controller
                    name="primaryHolder.exemptRefNo"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the exemptRefNo"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.primaryHolder?.exemptRefNo}
                        hint={errors.primaryHolder?.exemptRefNo?.message || ""}
                        success={
                          isSubmitted &&
                          !!getValues("primaryHolder.exemptRefNo") &&
                          !errors.primaryHolder?.exemptRefNo
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </ComponentCard>
            {contextProvider?.isSecondHolder ? (
              <ComponentCard title="SECOND HOLDER" enableTitleCard={true}>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="kycType" mandatory={true}>
                      KYC TYPE
                    </Label>
                    <Controller
                      name="secondHolder.kycType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          onChange={(value: string) => {
                            enableCkycNumberSH(value === "C" ? true : false);
                            setValue("secondHolder.kycType", value);
                          }}
                          options={kycTypeOptions}
                          error={!!errors.secondHolder?.kycType}
                          hint={errors.secondHolder?.kycType?.message || ""}
                          success={isSubmitted && !errors.secondHolder?.kycType}
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="ckycNo" mandatory={true}>
                      CKYC NUMBER
                    </Label>
                    <Controller
                      name="secondHolder.ckycNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the ckcy Number"
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                          error={!!errors.secondHolder?.ckycNumber}
                          hint={errors.secondHolder?.ckycNumber?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("secondHolder.ckycNumber") &&
                            !errors.secondHolder?.ckycNumber
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="email" mandatory={true}>
                      EMAIL ADDRESS
                    </Label>
                    <Controller
                      name="secondHolder.email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the email address"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.secondHolder?.email}
                          hint={errors.secondHolder?.email?.message || ""}
                          success={isSubmitted && !errors.secondHolder?.email}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="mobile" mandatory={true}>
                      MOBILE NUMBER
                    </Label>
                    <Controller
                      name="secondHolder.mobile"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the mobile number"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.secondHolder?.mobile}
                          hint={errors.secondHolder?.mobile?.message || ""}
                          success={isSubmitted && !errors.secondHolder?.mobile}
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="mobileDeclaretion" mandatory={true}>
                      MOBILE DECLARATION
                    </Label>
                    <Controller
                      name="secondHolder.mobileDeclaration"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={emailAndMobileDecOptions}
                          error={!!errors.secondHolder?.mobileDeclaration}
                          hint={
                            errors.secondHolder?.mobileDeclaration?.message ||
                            ""
                          }
                          success={
                            isSubmitted &&
                            !errors.secondHolder?.mobileDeclaration
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="emailDeclaretion" mandatory={true}>
                      EMAIL DECLARATION
                    </Label>
                    <Controller
                      name="secondHolder.emailDeclaration"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={emailAndMobileDecOptions}
                          error={!!errors.secondHolder?.emailDeclaration}
                          hint={
                            errors.secondHolder?.emailDeclaration?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !errors.secondHolder?.emailDeclaration
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="exemptRefNo" mandatory={true}>
                      EXEMPT REF NO
                    </Label>
                    <Controller
                      name="secondHolder.exemptRefNo"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the exemptRefNo"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.secondHolder?.exemptRefNo}
                          hint={errors.secondHolder?.exemptRefNo?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("secondHolder.exemptRefNo") &&
                            !errors.secondHolder?.exemptRefNo
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
            {contextProvider?.isThirdHolder ? (
              <ComponentCard title="THIRD HOLDER" enableTitleCard={true}>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="kycType" mandatory={true}>
                      KYC TYPE
                    </Label>
                    <Controller
                      name="thirdHolder.kycType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          onChange={(value: string) => {
                            enableCkycNumberTH(value === "C" ? true : false);
                            setValue("thirdHolder.kycType", value);
                          }}
                          options={kycTypeOptions}
                          error={!!errors.thirdHolder?.kycType}
                          hint={errors.thirdHolder?.kycType?.message || ""}
                          success={isSubmitted && !errors.thirdHolder?.kycType}
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="ckycNo" mandatory={true}>
                      CKYC NUMBER
                    </Label>
                    <Controller
                      name="thirdHolder.ckycNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the ckcy Number"
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                          error={!!errors.thirdHolder?.ckycNumber}
                          hint={errors.thirdHolder?.ckycNumber?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("thirdHolder.ckycNumber") &&
                            !errors.thirdHolder?.ckycNumber
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="email" mandatory={true}>
                      EMAIL ADDRESS
                    </Label>
                    <Controller
                      name="thirdHolder.email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the email address"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.thirdHolder?.email}
                          hint={errors.thirdHolder?.email?.message || ""}
                          success={isSubmitted && !errors.thirdHolder?.email}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="mobile" mandatory={true}>
                      MOBILE NUMBER
                    </Label>
                    <Controller
                      name="thirdHolder.mobile"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the mobile number"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.thirdHolder?.mobile}
                          hint={errors.thirdHolder?.mobile?.message || ""}
                          success={isSubmitted && !errors.thirdHolder?.mobile}
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="mobileDeclaretion" mandatory={true}>
                      MOBILE DECLARATION
                    </Label>
                    <Controller
                      name="thirdHolder.mobileDeclaration"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={emailAndMobileDecOptions}
                          error={!!errors.thirdHolder?.mobileDeclaration}
                          hint={
                            errors.thirdHolder?.mobileDeclaration?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !errors.thirdHolder?.mobileDeclaration
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="emailDeclaretion" mandatory={true}>
                      EMAIL DECLARATION
                    </Label>
                    <Controller
                      name="thirdHolder.emailDeclaration"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={emailAndMobileDecOptions}
                          error={!!errors.thirdHolder?.emailDeclaration}
                          hint={
                            errors.thirdHolder?.emailDeclaration?.message || ""
                          }
                          success={
                            isSubmitted && !errors.thirdHolder?.emailDeclaration
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="exemptRefNo" mandatory={true}>
                      EXEMPT REF NO
                    </Label>
                    <Controller
                      name="thirdHolder.exemptRefNo"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the exemptRefNo"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.thirdHolder?.exemptRefNo}
                          hint={errors.thirdHolder?.exemptRefNo?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("thirdHolder.exemptRefNo") &&
                            !errors.thirdHolder?.exemptRefNo
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
            {contextProvider?.isMinor ? (
              <ComponentCard title="GUARDIAN" enableTitleCard={true}>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="kycType" mandatory={true}>
                      KYC TYPE
                    </Label>
                    <Controller
                      name="guardianIfMinor.kycType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          onChange={(value: string) => {
                            enableCkycNumberG(value === "C" ? true : false);
                            setValue("guardianIfMinor.kycType", value);
                          }}
                          options={kycTypeOptions}
                          error={!!errors.guardianIfMinor?.kycType}
                          hint={errors.guardianIfMinor?.kycType?.message || ""}
                          success={
                            isSubmitted && !errors.guardianIfMinor?.kycType
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="ckycNo" mandatory={true}>
                      CKYC NUMBER
                    </Label>
                    <Controller
                      name="guardianIfMinor.ckycNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the ckcy Number"
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                          error={!!errors.guardianIfMinor?.ckycNumber}
                          hint={
                            errors.guardianIfMinor?.ckycNumber?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues("guardianIfMinor.ckycNumber") &&
                            !errors.guardianIfMinor?.ckycNumber
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="realtion" mandatory={true}>
                      RELATIONSHIP
                    </Label>
                    <Controller
                      name="guardianIfMinor.relation"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getRelationMaster ?? []}
                          error={!!errors.guardianIfMinor?.relation}
                          hint={errors.guardianIfMinor?.relation?.message || ""}
                          success={
                            isSubmitted && !errors.guardianIfMinor?.relation
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="exemptRefNo" mandatory={true}>
                      EXEMPT REF NO
                    </Label>
                    <Controller
                      name="guardianIfMinor.exemptRefNo"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the email address"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.guardianIfMinor?.exemptRefNo}
                          hint={
                            errors.guardianIfMinor?.exemptRefNo?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues("guardianIfMinor.exemptRefNo") &&
                            !errors.guardianIfMinor?.exemptRefNo
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

export default Profile;
