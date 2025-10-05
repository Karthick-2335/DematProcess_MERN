import React, { useContext, useEffect, useMemo, useState } from "react";
import { StageProps } from "./Register";
import { KycContext } from "../../context/KycContext";
import WithLoader from "../../components/Loader/WithLoader";
import ComponentCard from "../../components/common/ComponentCard";
import Form from "../../components/form/Form";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import { getRequest, postRequest } from "../../services/axios";
import toast from "react-hot-toast";

interface Nominee {
  name: string;
  nomineeRelation: string;
  minorFlag: boolean;
  applicable: number;
  dob: string;
  guardian?: string;
  guardianPan?: string;
  identityType: string;
  identityNumber: string;
  email: string;
  mobile: string;
  address1: string;
  address2: string;
  address3?: string;
  city: string;
  pincode: string;
  country: string;
}

interface NomineeInfo {
  registerId: string;
  nominees: Nominee[];
  opt?: string;
  authentication?: string;
  soa?: string;
}

const isMinor = (dob: string) => {
  if (!dob) return false;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age < 18;
};

const defaultNominee = (): Nominee => ({
  name: "",
  nomineeRelation: "",
  minorFlag: false,
  applicable: 0,
  dob: "",
  guardian: "",
  guardianPan: "",
  identityType: "",
  identityNumber: "",
  email: "",
  mobile: "",
  address1: "",
  address2: "",
  address3: "",
  city: "",
  pincode: "",
  country: "",
});

const Nominee = ({ btnPrevious, btnNext, activeTab, paramId }: StageProps) => {
  const contextProvider = useContext(KycContext);
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    nominees: yup
      .array()
      .of(
        yup.object({
          name: yup.string().required("Name is required"),
          nomineeRelation: yup.string().required("Relation is required"),
          minorFlag: yup.boolean().default(false),
          applicable: yup
            .number()
            .typeError("Must be a number")
            .required("Applicable is required"),
          dob: yup.string().required("Date of birth is required"),
          guardian: yup.string().when("dob", (dob: any, schema: any) => {
            if (!dob) return schema.notRequired();

            const birth = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

            return age < 18
              ? schema.required("Guardian is required for minor")
              : schema.notRequired();
          }),
          guardianPan: yup.string().when("dob", (dob: any, schema: any) => {
            if (!dob) return schema.notRequired();

            const birth = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

            return age < 18
              ? schema
                  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
                  .required("Guardian PAN is required for minor")
              : schema.notRequired();
          }),
          identityType: yup.string().required("Identity type is required"),
          identityNumber: yup.string().required("Identity number is required"),
          email: yup
            .string()
            .email("Invalid email")
            .required("Email is required"),
          mobile: yup.string().required("Mobile number is required"),
          address1: yup.string().required("Address line 1 is required"),
          address2: yup.string().required("Address line 2 is required"),
          address3: yup.string().notRequired(),
          city: yup.string().required("City is required"),
          pincode: yup.string().required("Pincode is required"),
          country: yup.string().required("Country is required"),
        })
      )
      .min(1, "At least 1 nominee required")
      .max(3, "Maximum 3 nominees allowed")
      .required(),
    opt: yup.string().optional().default(""),
    authentication: yup.string().optional().default("OTP"),
    soa: yup.string().optional().default(""),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<NomineeInfo>({
    defaultValues: { nominees: [defaultNominee()] },
    resolver: yupResolver(schema) as any,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nominees",
  });

  const onSubmit = async (data: NomineeInfo) => {
    const totalPercentage = data.nominees.reduce(
      (acc, n) => acc + Number(n.applicable || 0),
      0
    );
    if (totalPercentage !== 100) {
      toast.error(
        "Invalid Percentage : You Entered 100% Out Of " + totalPercentage + "%"
      );
      return;
    }
    setLoading(true);
    try {
      let resp: any;
      if (paramId) {
        data.registerId = paramId;
      }

      resp = await postRequest("kyc/nominee", data);

      if (resp.success) {
        btnNext();
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchNomineeInfo = async () => {
    if (!paramId) return null;
    setLoading(true);
    try {
      const response = await getRequest("kyc/nominee/" + paramId);
      if (response.success) {
        const stringResponse = JSON.stringify(response.data);
        const bindNomineeInfo = JSON.parse(stringResponse);
        reset(bindNomineeInfo);
      }
    } catch (err) {
      console.error("Error fetching KYC register:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNomineeInfo();
  }, [reset]);
  const watchNominees = watch("nominees");

  return (
    <WithLoader loading={loading}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {fields.map((item, index) => {
            const minor = isMinor(watchNominees[index]?.dob);
            return (
              <ComponentCard
                key={item.id}
                title={`NOMINEE ${index + 1}`}
                enableTitleCard={true}
              >
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor={`nominees.${index}.name`} mandatory>
                      NAME
                    </Label>
                    <Controller
                      name={`nominees.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter nominee name"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.nominees?.[index]?.name}
                          hint={errors.nominees?.[index]?.name?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.name`) &&
                            !errors.nominees?.[index]?.name
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor={`nominees.${index}.mobile`} mandatory>
                      MOBILE
                    </Label>
                    <Controller
                      name={`nominees.${index}.mobile`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter mobile"
                          error={!!errors.nominees?.[index]?.mobile}
                          hint={errors.nominees?.[index]?.mobile?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.mobile`) &&
                            !errors.nominees?.[index]?.mobile
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor={`nominees.${index}.email`} mandatory>
                      EMAIL
                    </Label>
                    <Controller
                      name={`nominees.${index}.email`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter email"
                          error={!!errors.nominees?.[index]?.email}
                          hint={errors.nominees?.[index]?.email?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.email`) &&
                            !errors.nominees?.[index]?.email
                          }
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor={`nominees.${index}.dob`} mandatory>
                      DATE OF BIRTH
                    </Label>
                    <Controller
                      name={`nominees.${index}.dob`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id={`nominee${index}dob`}
                          placeholder="Select DOB"
                          value={field.value ?? ""}
                          onChange={(_, dateString) => {
                            field.onChange(dateString);
                            setValue(
                              `nominees.${index}.minorFlag`,
                              isMinor(dateString)
                            );
                          }}
                          error={!!errors.nominees?.[index]?.dob}
                          hint={errors.nominees?.[index]?.dob?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.dob`) &&
                            !errors.nominees?.[index]?.dob
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label
                      htmlFor={`nominees.${index}.nomineeRelation`}
                      mandatory
                    >
                      NOMINEE RELATIONSHIP
                    </Label>
                    <Controller
                      name={`nominees.${index}.nomineeRelation`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getRelationMaster ?? []}
                          error={!!errors.nominees?.[index]?.nomineeRelation}
                          hint={
                            errors.nominees?.[index]?.nomineeRelation
                              ?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.nomineeRelation`) &&
                            !errors.nominees?.[index]?.nomineeRelation
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor={`nominees.${index}.applicable`} mandatory>
                      NOMINEE PERCENTAGE
                    </Label>
                    <Controller
                      name={`nominees.${index}.applicable`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="%"
                          error={!!errors.nominees?.[index]?.applicable}
                          hint={
                            errors.nominees?.[index]?.applicable?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.applicable`) &&
                            !errors.nominees?.[index]?.applicable
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
                  <div className="relative w-full sm:w-1/3">
                    <Label
                      htmlFor={`nominees.${index}.identityNumber`}
                      mandatory
                    >
                      DOCUMENT PROOF NUMBER
                    </Label>
                    <Controller
                      name={`nominees.${index}.identityNumber`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter number document proof number"
                          error={!!errors.nominees?.[index]?.identityNumber}
                          hint={
                            errors.nominees?.[index]?.identityNumber?.message ||
                            ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.identityNumber`) &&
                            !errors.nominees?.[index]?.identityNumber
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor={`nominees.${index}.identityType`} mandatory>
                      DOCUMENT PROOF
                    </Label>
                    <Controller
                      name={`nominees.${index}.identityType`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getProofMaster ?? []}
                          error={!!errors.nominees?.[index]?.identityType}
                          hint={
                            errors.nominees?.[index]?.identityType?.message ||
                            ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.identityType`) &&
                            !errors.nominees?.[index]?.identityType
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor={`nominees.${index}.address1`} mandatory>
                      ADDRESS LINE 1
                    </Label>
                    <Controller
                      name={`nominees.${index}.address1`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter nominee address line 1"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.nominees?.[index]?.address1}
                          hint={
                            errors.nominees?.[index]?.address1?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.address1`) &&
                            !errors.nominees?.[index]?.address1
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor={`nominees.${index}.address2`} mandatory>
                      ADDRESS LINE 2
                    </Label>
                    <Controller
                      name={`nominees.${index}.address2`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter nominee address line 2"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.nominees?.[index]?.address2}
                          hint={
                            errors.nominees?.[index]?.address2?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.address2`) &&
                            !errors.nominees?.[index]?.address2
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label
                      htmlFor={`nominees.${index}.address3`}
                      mandatory={false}
                    >
                      ADDRESS LINE 3
                    </Label>
                    <Controller
                      name={`nominees.${index}.address3`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter nominee address line 3"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.nominees?.[index]?.address3}
                          hint={
                            errors.nominees?.[index]?.address3?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.address3`) &&
                            !errors.nominees?.[index]?.address3
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor={`nominees.${index}.country`} mandatory>
                      COUNTRY
                    </Label>
                    <Controller
                      name={`nominees.${index}.country`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value}
                          options={contextProvider?.getCountryMaster ?? []}
                          error={!!errors.nominees?.[index]?.country}
                          hint={
                            errors.nominees?.[index]?.country?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.country`) &&
                            !errors.nominees?.[index]?.country
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
                  <div className="relative w-full sm:w-1/3">
                    <Label htmlFor={`nominees.${index}.city`} mandatory>
                      CITY
                    </Label>
                    <Controller
                      name={`nominees.${index}.city`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter nominee city"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          error={!!errors.nominees?.[index]?.city}
                          hint={errors.nominees?.[index]?.city?.message || ""}
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.city`) &&
                            !errors.nominees?.[index]?.city
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/4">
                    <Label htmlFor={`nominees.${index}.pincode`} mandatory>
                      PINCODE
                    </Label>
                    <Controller
                      name={`nominees.${index}.pincode`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter nominee pincode"
                          error={!!errors.nominees?.[index]?.pincode}
                          hint={
                            errors.nominees?.[index]?.pincode?.message || ""
                          }
                          success={
                            isSubmitted &&
                            !!getValues(`nominees.${index}.pincode`) &&
                            !errors.nominees?.[index]?.pincode
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                {minor && (
                  <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
                    <div className="relative w-full sm:w-1/3">
                      <Label htmlFor={`nominees.${index}.guardian`} mandatory>
                        GUARDIAN NAME
                      </Label>
                      <Controller
                        name={`nominees.${index}.guardian`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Enter guardian name"
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                            error={!!errors.nominees?.[index]?.guardian}
                            hint={
                              errors.nominees?.[index]?.guardian?.message || ""
                            }
                            success={
                              isSubmitted &&
                              !!getValues(`nominees.${index}.guardian`) &&
                              !errors.nominees?.[index]?.guardian
                            }
                          />
                        )}
                      />
                    </div>
                    <div className="relative w-full sm:w-1/3">
                      <Label
                        htmlFor={`nominees.${index}.guardianPan`}
                        mandatory
                      >
                        GUARDIAN PAN
                      </Label>
                      <Controller
                        name={`nominees.${index}.guardianPan`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Enter guardian PAN"
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                            error={!!errors.nominees?.[index]?.guardianPan}
                            hint={
                              errors.nominees?.[index]?.guardianPan?.message ||
                              ""
                            }
                            success={
                              isSubmitted &&
                              !!getValues(`nominees.${index}.guardianPan`) &&
                              !errors.nominees?.[index]?.guardianPan
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                {fields.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 mt-2"
                    onClick={() => remove(index)}
                  >
                    Remove Nominee
                  </button>
                )}
              </ComponentCard>
            );
          })}

          {fields.length < 3 && (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => append(defaultNominee())}
            >
              Add Nominee
            </button>
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
  );
};

export default Nominee;
