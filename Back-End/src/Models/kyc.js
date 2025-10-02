import mongoose from "mongoose";

const HolderSchema = new mongoose.Schema({
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  pan: { type: String },
  dob: { type: String },
  panExempt: { type: String },
  relation: { type: String }, // only for guardian
  exemptCategory: { type: String }
});

const KYCSchema = new mongoose.Schema(
  {
    others: {   // <-- lowercase to match payload
      clientType: { type: String },
      pms: { type: String },
      defaultDp: { type: String },
      cdslDpid: { type: String },
      cdslCltid: { type: String },
      cmbpId: { type: String },
      nsdlDpid: { type: String },
      nsdlCltid: { type: String },
      client_code: { type: String },
      aadhaar_updated: { type: String },
      mapin_id: { type: String },
      paperless_flag: { type: String },
      lei_no: { type: String },
      lei_validity: { type: String }
    },
    gurdianIfMinor: HolderSchema,
    thirdHolder: HolderSchema,
    secondHolder: HolderSchema,
    primaryHolder: {
      ...HolderSchema.obj,
      taxStatus: { type: String },
      gender: { type: String },
      occupationCode: { type: String },
      holdingNature: { type: String }
    },
    isThirdHolder: { type: Boolean, default: false },
    isSecondHolder: { type: Boolean, default: false },
    isMinor: { type: Boolean, default: false },
    isDigiLocker: { type: Boolean, default: false },
    isKra: { type: Boolean, default: false },
    isNri: { type: Boolean, default: false }
  },
  { timestamps: true }
);


const kyc_register = mongoose.model("kyc_register", KYCSchema);

export default kyc_register;