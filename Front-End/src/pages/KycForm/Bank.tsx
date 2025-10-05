import React, { useContext, useEffect, useMemo, useState } from "react";
import { StageProps } from "./Register";
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
import { Option } from "../../components/form/Select";
import { KycContext } from "../../context/KycContext";
import Switch from "../../components/form/switch/Switch";

interface Bank {
  accountType: string;
  accountNo: string;
  micrNo: string;
  ifscCode: string;
  defaultBank: boolean;
}
interface BankInfo {
  registerId: string;
  banks: Bank[];
  chequeName: string;
  divPayMode: string;
}
const Bank = ({ btnPrevious, btnNext, activeTab, paramId }: StageProps) => {
  const contextProvider = useContext(KycContext);
  const [loading, setLoading] = useState(false);

  const accountTypeOptions: Option[] = useMemo(() => {
    return [
      { label: "SAVING BANK", value: "SB" },
      { label: "CURRENT BANK", value: "CB" },
      { label: "NRE ACCOUNT", value: "NE" },
      { label: "NRO ACCOUNT", value: "NO" },
    ];
  }, []);
  const defaultBanks = (): Bank => ({
    accountType: "",
    accountNo: "",
    micrNo: "",
    ifscCode: "",
    defaultBank: false,
  });
  const schema = yup.object({
    banks: yup
      .array()
      .of(
        yup.object({
          accountType: yup.string().required("Name is required"),
          accountNo: yup.string().required("Relation is required"),
          micrNo: yup.string().required("Mobile number is required"),
          ifscCode: yup.string().required("Address line 1 is required"),
          defaultBank: yup.boolean().default(false),
        })
      )
      .min(1, "At least 1 bank required")
      .max(5, "Maximum 5 bank allowed")
      .required(),
    chequeName: yup.string().optional().default(""),
    divPayMode: yup.string().optional().default("03"),
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<BankInfo>({
    defaultValues: { banks: [defaultBanks()] },
    resolver: yupResolver(schema) as any,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "banks",
  });
  const onSubmit = async (data: BankInfo) => {
    setLoading(true);
    try {
      let resp: any;
      if (paramId) {
        data.registerId = paramId;
      }

      resp = await postRequest("kyc/bank", data);

      if (resp.success) {
        btnNext();
      }
    } catch (err) {
      console.error("Error fetching tax master:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchBankInfo = async () => {
    if (!paramId) return null;
    setLoading(true);
    try {
      const response = await getRequest("kyc/bank/" + paramId);
      if (response.success) {
        const stringResponse = JSON.stringify(response.data);
        const bindBankInfo = JSON.parse(stringResponse);
        reset(bindBankInfo);
      }
    } catch (err) {
      console.error("Error fetching KYC register:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBankInfo();
  }, [reset]);
  const watchBanks = watch("banks");
  return (
    <div>
      <WithLoader loading={loading}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {fields.map((item, index) => {
              if (watchBanks.every((b) => !b.defaultBank)) {
                setValue("banks.0.defaultBank", true, { shouldDirty: true });
              }
              return (
                <ComponentCard
                  key={item.id}
                  title={`BANK ${index + 1}`}
                  enableTitleCard={true}
                >
                  <div className="flex flex-wrap gap-4 sm:gap-6  items-center">
                    <div className="relative w-full sm:w-1/3">
                      <Label htmlFor={`banks.${index}.accountType`} mandatory>
                        ACCOUNT TYPE
                      </Label>
                      <Controller
                        name={`banks.${index}.accountType`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={field.value}
                            options={accountTypeOptions}
                            error={!!errors.banks?.[index]?.accountType}
                            hint={
                              errors.banks?.[index]?.accountType?.message || ""
                            }
                            success={
                              isSubmitted &&
                              !!getValues(`banks.${index}.accountType`) &&
                              !errors.banks?.[index]?.accountType
                            }
                          />
                        )}
                      />
                    </div>
                    <div className="relative w-full sm:w-1/4">
                      <Label htmlFor={`banks.${index}.accountno`} mandatory>
                        ACCOUNT NUMBER
                      </Label>
                      <Controller
                        name={`banks.${index}.accountNo`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Enter bank account number"
                            error={!!errors.banks?.[index]?.accountNo}
                            hint={
                              errors.banks?.[index]?.accountNo?.message || ""
                            }
                            success={
                              isSubmitted &&
                              !!getValues(`banks.${index}.accountNo`) &&
                              !errors.banks?.[index]?.accountNo
                            }
                          />
                        )}
                      />
                    </div>
                    <div className="relative w-full sm:w-1/3">
                      <Label htmlFor={`banks.${index}.micr`} mandatory>
                        MICR NO
                      </Label>
                      <Controller
                        name={`banks.${index}.micrNo`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Enter bank micr number"
                            error={!!errors.banks?.[index]?.micrNo}
                            hint={errors.banks?.[index]?.micrNo?.message || ""}
                            success={
                              isSubmitted &&
                              !!getValues(`banks.${index}.micrNo`) &&
                              !errors.banks?.[index]?.micrNo
                            }
                          />
                        )}
                      />
                    </div>
                    <div className="relative w-full sm:w-1/3">
                      <Label htmlFor={`banks.${index}.ifsc`} mandatory>
                        IFSC CODE
                      </Label>
                      <Controller
                        name={`banks.${index}.ifscCode`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Enter bank ifsc number"
                            error={!!errors.banks?.[index]?.ifscCode}
                            hint={
                              errors.banks?.[index]?.ifscCode?.message || ""
                            }
                            success={
                              isSubmitted &&
                              !!getValues(`banks.${index}.ifscCode`) &&
                              !errors.banks?.[index]?.ifscCode
                            }
                          />
                        )}
                      />
                    </div>
                    <div className="relative w-full sm:w-1/3">
                      <Controller
                        name={`banks.${index}.defaultBank`}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            label="DEFAULT BANK"
                            {...field}
                            defaultChecked={field.value}
                            onChange={(checked: boolean) => {
                              watchBanks.forEach((_, i) => {
                                setValue(
                                  `banks.${i}.defaultBank`,
                                  i === index ? checked : false
                                );
                              });
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 mt-2"
                      onClick={() => remove(index)}
                    >
                      Remove Bank
                    </button>
                  )}
                </ComponentCard>
              );
            })}
            {fields.length < 5 && (
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => append(defaultBanks())}
              >
                Add Bank
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
    </div>
  );
};

export default Bank;
