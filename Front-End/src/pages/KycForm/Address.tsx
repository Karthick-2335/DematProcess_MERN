import { useContext, useEffect, useMemo, useState } from "react";
import { StageProps } from "./Register";
import WithLoader from "../../components/Loader/WithLoader";
import Form from "../../components/form/Form";
import ComponentCard from "../../components/common/ComponentCard";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getRequest, postRequest } from "../../services/axios";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Switch from "../../components/form/switch/Switch";
import { KycContext } from "../../context/KycContext";
import Select from "../../components/form/Select";

interface CommonAddress {
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  proofType: string;
  proofNumber: string;
}
interface AddressInfo {
  registerId: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  proofType: string;
  proofNumber: string;
  isSamePermenent: boolean;
  isNri: boolean;
  permenentAddress: CommonAddress;
  forignAddress: CommonAddress;
}
const Address = ({ btnPrevious, btnNext, activeTab, paramId }: StageProps) => {
  const [loading, setLoading] = useState(false);
  const [permAddres, enablePermAddress] = useState<boolean>(false);
  const [forAddress, enableForAddress] = useState<boolean>(false);

  const contextProvider = useContext(KycContext);
  const schema = useMemo(
    () =>
      yup.object({
        address1: yup.string().required("Address line one is required"),
        address2: yup.string().required("Address line two is required"),
        address3: yup.string().optional(),
        city: yup.string().required("City is required"),
        state: yup.string().required("State is required"),
        pincode: yup.string().required("Pincode is required"),
        country: yup.string().required("Country is required"),
        proofType: yup.string().required("Proof type is required"),
        proofNumber: yup.string().required("Proof number is required"),
        isSamePermenent: yup.boolean().default(false),
        isNri: yup.boolean().default(false),
        permenentAddress: yup.object({
          address1: permAddres
            ? yup.string().required("Address line one is required")
            : yup.string().notRequired(),
          address2: permAddres
            ? yup.string().required("Address line two is required")
            : yup.string().notRequired(),
          address3: permAddres
            ? yup.string().optional()
            : yup.string().notRequired(),
          city: permAddres
            ? yup.string().required("City is required")
            : yup.string().notRequired(),
          state: permAddres
            ? yup.string().required("State is required")
            : yup.string().notRequired(),
          pincode: permAddres
            ? yup.string().required("Pincode is required")
            : yup.string().notRequired(),
          country: permAddres
            ? yup.string().required("Country is required")
            : yup.string().notRequired(),
          proofType: permAddres
            ? yup.string().required("Proof type is required")
            : yup.string().notRequired(),
          proofNumber: permAddres
            ? yup.string().required("Proof number is required")
            : yup.string().notRequired(),
        }),
        forignAddress: yup.object({
          address1: forAddress
            ? yup.string().required("Address line one is required")
            : yup.string().notRequired(),
          address2: forAddress
            ? yup.string().required("Address line two is required")
            : yup.string().notRequired(),
          address3: forAddress
            ? yup.string().optional()
            : yup.string().notRequired(),
          city: forAddress
            ? yup.string().required("City is required")
            : yup.string().notRequired(),
          state: forAddress
            ? yup.string().required("State is required")
            : yup.string().notRequired(),
          pincode: forAddress
            ? yup.string().required("Pincode is required")
            : yup.string().notRequired(),
          country: forAddress
            ? yup.string().required("Country is required")
            : yup.string().notRequired(),
          proofType: forAddress
            ? yup.string().required("Proof type is required")
            : yup.string().notRequired(),
          proofNumber: forAddress
            ? yup.string().required("Proof number is required")
            : yup.string().notRequired(),
        }),
      }),
    [permAddres, forAddress]
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
  } = useForm<AddressInfo>({
    resolver: yupResolver(schema) as any,
  });

  const fetchAddressInfo = async () => {
    if (!paramId) return null;
    setLoading(true);
    try {
      const response = await getRequest("kyc/address/" + paramId);
      if (response.success) {
        const stringResponse = JSON.stringify(response.data);
        const bindRegisterInfo = JSON.parse(stringResponse);
        reset(bindRegisterInfo);
      }
    } catch (err) {
      console.error("Error fetching KYC register:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddressInfo();
  }, [reset]);
  const ensureIsNri = watch("isNri");
  const ensurePermenent = watch("isSamePermenent");
  useEffect(() => {
    enableForAddress(contextProvider?.isNri ?? false);
    setValue("isNri", contextProvider?.isNri ?? false);
    enablePermAddress(ensurePermenent);
  }, [ensureIsNri, ensurePermenent]);
  const onSubmit = async (data: AddressInfo) => {
    setLoading(true);
    try {
      let resp: any;
      if (paramId) {
        data.registerId = paramId;
      }

      resp = await postRequest("kyc/address", data);

      if (resp.success) {
        btnNext();
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <WithLoader loading={loading}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <ComponentCard
              title="CORRESPONDANCE ADDRESS"
              enableTitleCard={true}
            >
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="address1" mandatory={true}>
                    ADDRESS LINE 1
                  </Label>
                  <Controller
                    name="address1"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter address line one"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.address1}
                        hint={errors.address1?.message || ""}
                        success={isSubmitted && !errors.address1}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/4">
                  <Label htmlFor="address2" mandatory={true}>
                    ADDRESS LINE 2
                  </Label>
                  <Controller
                    name="address2"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter address line two"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.address2}
                        hint={errors.address2?.message || ""}
                        success={isSubmitted && !errors.address2}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="address3" mandatory={false}>
                    ADDRESS LINE 3
                  </Label>
                  <Controller
                    name="address3"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter address line three"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.address3}
                        hint={errors.address3?.message || ""}
                        success={
                          isSubmitted &&
                          !!getValues("address3") &&
                          !errors.address3
                        }
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="city" mandatory={true}>
                    CITY
                  </Label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the city"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.city}
                        hint={errors.city?.message || ""}
                        success={isSubmitted && !errors.city}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/4">
                  <Label htmlFor="state" mandatory={true}>
                    STATE
                  </Label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        options={contextProvider?.getStateMaster ?? []}
                        error={!!errors.state}
                        hint={errors.state?.message || ""}
                        success={isSubmitted && !errors.state}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="pincode" mandatory={true}>
                    PINCODE
                  </Label>
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the pincode"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.pincode}
                        hint={errors.pincode?.message || ""}
                        success={isSubmitted && !errors.pincode}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="country" mandatory={true}>
                    COUNTRY
                  </Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        options={contextProvider?.getCountryMaster ?? []}
                        error={!!errors.country}
                        hint={errors.country?.message || ""}
                        success={isSubmitted && !errors.country}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/4">
                  <Label htmlFor="addressProof" mandatory={true}>
                    ADDRESS PROOF
                  </Label>
                  <Controller
                    name="proofType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={field.value}
                        options={contextProvider?.getProofMaster ?? []}
                        error={!!errors.proofType}
                        hint={errors.proofType?.message || ""}
                        success={isSubmitted && !errors.proofType}
                      />
                    )}
                  />
                </div>
                <div className="relative w-full sm:w-1/3">
                  <Label htmlFor="proofNumber" mandatory={true}>
                    PROOF NUMBER
                  </Label>
                  <Controller
                    name="proofNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your document number"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        error={!!errors.proofNumber}
                        hint={errors.proofNumber?.message || ""}
                        success={isSubmitted && !errors.proofNumber}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                  <Controller
                    name="isSamePermenent"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        label="Do you want to add permenent address."
                        defaultChecked={field.value}
                        onChange={(checked: boolean) => {
                          enablePermAddress(checked);
                          setValue("isSamePermenent", checked);
                        }}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Controller
                    name="isNri"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        disabled={true}
                        label="FORGIN ADDRESS"
                        defaultChecked={contextProvider?.isNri}
                        onChange={(checked: boolean) => {
                          enableForAddress(checked);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </ComponentCard>
            {permAddres ? (
              <ComponentCard title="PERMENENT ADDRESS" enableTitleCard={true}>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="address1" mandatory={true}>
                      ADDRESS LINE 1
                    </Label>
                    <Controller
                      name="permenentAddress.address1"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter address line one"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.permenentAddress?.address1}
                          hint={
                            errors.permenentAddress?.address1?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues("permenentAddress.address1") &&
                            !errors.permenentAddress?.address1
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="address2" mandatory={true}>
                      ADDRESS LINE 2
                    </Label>
                    <Controller
                      name="permenentAddress.address2"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter address line two"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.permenentAddress?.address2}
                          hint={
                            errors.permenentAddress?.address2?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues("permenentAddress.address2") &&
                            !errors.permenentAddress?.address2
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="address3" mandatory={false}>
                      ADDRESS LINE 3
                    </Label>
                    <Controller
                      name="permenentAddress.address3"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter address line three"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.permenentAddress?.address3}
                          hint={
                            errors.permenentAddress?.address3?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues("permenentAddress.address3") &&
                            !errors.permenentAddress?.address3
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="city" mandatory={true}>
                      CITY
                    </Label>
                    <Controller
                      name="permenentAddress.city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the city"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.permenentAddress?.city}
                          hint={errors.permenentAddress?.city?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("permenentAddress.city") &&
                            !errors.permenentAddress?.city
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="state" mandatory={true}>
                      STATE
                    </Label>
                    <Controller
                      name="permenentAddress.state"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getStateMaster ?? []}
                          error={!!errors.permenentAddress?.state}
                          hint={errors.permenentAddress?.state?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("permenentAddress.state") &&
                            !errors.permenentAddress?.state
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="pincode" mandatory={true}>
                      PINCODE
                    </Label>
                    <Controller
                      name="permenentAddress.pincode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the pincode"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.permenentAddress?.pincode}
                          hint={errors.permenentAddress?.pincode?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("permenentAddress.pincode") &&
                            !errors.permenentAddress?.pincode
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="country" mandatory={true}>
                      COUNTRY
                    </Label>
                    <Controller
                      name="permenentAddress.country"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getCountryMaster ?? []}
                          error={!!errors.permenentAddress?.country}
                          hint={errors.permenentAddress?.country?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("permenentAddress.country") &&
                            !errors.permenentAddress?.country
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="addressProof" mandatory={true}>
                      ADDRESS PROOF
                    </Label>
                    <Controller
                      name="permenentAddress.proofType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getProofMaster ?? []}
                          error={!!errors.permenentAddress?.proofType}
                          hint={
                            errors.permenentAddress?.proofType?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues("permenentAddress.proofType") &&
                            !errors.permenentAddress?.proofType
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="proofNumber" mandatory={true}>
                      PROOF NUMBER
                    </Label>
                    <Controller
                      name="permenentAddress.proofNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your document number"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.permenentAddress?.proofNumber}
                          hint={
                            errors.permenentAddress?.proofNumber?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues("permenentAddress.proofNumber") &&
                            !errors.permenentAddress?.proofNumber
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
            {forAddress ? (
              <ComponentCard title="FORIGN ADDRESS" enableTitleCard={true}>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="address1" mandatory={true}>
                      ADDRESS LINE 1
                    </Label>
                    <Controller
                      name="forignAddress.address1"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter address line one"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.forignAddress?.address1}
                          hint={errors.forignAddress?.address1?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("forignAddress.address1") &&
                            !errors.forignAddress?.address1
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="address2" mandatory={true}>
                      ADDRESS LINE 2
                    </Label>
                    <Controller
                      name="forignAddress.address2"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter address line two"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.forignAddress?.address2}
                          hint={errors.forignAddress?.address2?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("forignAddress.address2") &&
                            !errors.forignAddress?.address2
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="address3" mandatory={false}>
                      ADDRESS LINE 3
                    </Label>
                    <Controller
                      name="forignAddress.address3"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter address line three"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.forignAddress?.address3}
                          hint={errors.forignAddress?.address3?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("forignAddress.address3") &&
                            !errors.forignAddress?.address3
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="city" mandatory={true}>
                      CITY
                    </Label>
                    <Controller
                      name="forignAddress.city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the city"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.forignAddress?.city}
                          hint={errors.forignAddress?.city?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("forignAddress.city") &&
                            !errors.forignAddress?.city
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="state" mandatory={true}>
                      STATE
                    </Label>
                    <Controller
                      name="forignAddress.state"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getStateMaster ?? []}
                          error={!!errors.forignAddress?.state}
                          hint={errors.forignAddress?.state?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("forignAddress.state") &&
                            !errors.forignAddress?.state
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="pincode" mandatory={true}>
                      PINCODE
                    </Label>
                    <Controller
                      name="forignAddress.pincode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the pincode"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.forignAddress?.pincode}
                          hint={errors.forignAddress?.pincode?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("forignAddress.pincode") &&
                            !errors.forignAddress?.pincode
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="country" mandatory={true}>
                      COUNTRY
                    </Label>
                    <Controller
                      name="forignAddress.country"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getCountryMaster ?? []}
                          error={!!errors.forignAddress?.country}
                          hint={errors.forignAddress?.country?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("forignAddress.country") &&
                            !errors.forignAddress?.country
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor="addressProof" mandatory={true}>
                      ADDRESS PROOF
                    </Label>
                    <Controller
                      name="forignAddress.proofType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getProofMaster ?? []}
                          error={!!errors.forignAddress?.proofType}
                          hint={errors.forignAddress?.proofType?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues("forignAddress.proofType") &&
                            !errors.forignAddress?.proofType
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor="proofNumber" mandatory={true}>
                      PROOF NUMBER
                    </Label>
                    <Controller
                      name="forignAddress.proofNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your document number"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.forignAddress?.proofNumber}
                          hint={
                            errors.forignAddress?.proofNumber?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues("forignAddress.proofNumber") &&
                            !errors.forignAddress?.proofNumber
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

export default Address;
