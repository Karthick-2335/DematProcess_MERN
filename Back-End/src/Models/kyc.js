import mongoose, { Schema } from "mongoose";

// Holder Schema
const HolderSchema = new Schema({
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  pan: { type: String },
  dob: { type: String },
  panExempt: { type: String },
  relation: { type: String }, // only for guardian
  exemptCategory: { type: String }
});

// KYC Register Schema
const KYCRegisterSchema = new Schema({
  others: {
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
  isNri: { type: Boolean, default: false },
  statusId: { type: Number, default: 2 }
}, { timestamps: true });

const kyc_register = mongoose.model("kyc_register", KYCRegisterSchema, "kyc_registers");

// Sub Address Schema
const SubAddressSchema = new Schema({
  address1: { type: String, default: "" },
  address2: { type: String, default: "" },
  address3: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  pincode: { type: String, default: "" },
  country: { type: String, default: "" },
  proofType: { type: String, default: "" },
  proofNumber: { type: String, default: "" },
});

// KYC Address Schema
const KYCAddressSchema = new Schema({
  registerId: { type: Schema.Types.ObjectId, ref: "kyc_register", required: true },
  address1: { type: String, required: true },
  address2: { type: String, required: true },
  address3: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true },
  proofType: { type: String, required: true },
  proofNumber: { type: String, required: true },
  isSamePermenent: { type: Boolean, default: false },
  isNri: { type: Boolean, default: false },
  statusId: { type: Number, default: 2 },
  permenentAddress: { type: SubAddressSchema, default: {} },
  forignAddress: { type: SubAddressSchema, default: {} },
}, { timestamps: true });

const kyc_address = mongoose.model("kyc_address", KYCAddressSchema, "kyc_addresses");

const NomineeSchema = new mongoose.Schema({
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  address3: { type: String },
  mobile: { type: String, required: true },
  email: { type: String, required: true},
  identityNumber: { type: String, required: true },
  identityType: { type: String, required: true },
  dob: { type: Date, required: true },
  guardianPan: { type: String },
  guardian: { type: String },
  applicable: { type: Number, required: true },
  minorFlag: { type: Boolean, required: true },
  nomineeRelation: { type: String, required: true },
  name: { type: String, required: true }
});

const KYCNomineeSchema = new mongoose.Schema({
  registerId: { type: Schema.Types.ObjectId, ref: "kyc_register", required: true },
  soa: { type: String },
  authentication: { type: String, required: true },
  opt: { type: String },
  statusId : {type:Number,default:2},
  nominees: { type: [NomineeSchema] }
}, { timestamps: true });

const kyc_nominee = mongoose.model("kyc_nominee", KYCNomineeSchema, "kyc_nominees");

const KYCProfileSchema = new mongoose.Schema(
  {
    registerId: { type: Schema.Types.ObjectId, ref: "kyc_register", required: true },
    statusId : {type : Number,default : 2},
    guardianIfMinor: {
      kycType: { type: String },
      ckycNumber: { type: String },
      relation: { type: String },
      exemptRefNo: { type: String },
    },

    primaryHolder: {
      exemptRefNo: { type: String },
      isEmailValid: { type: Boolean, default: false },
      isMobileValid: { type: Boolean, default: false },
      emailDeclaration: { type: String },
      mobileDeclaration: { type: String },
      communicationMode: { type: String },
      mobile: { type: String },
      email: { type: String },
      ckycNumber: { type: String },
      kycType: { type: String },
      forginContact: {
        isMobileValid: { type: Boolean, default: false },
        indianMobileNo: { type: String },
        officeFax: { type: String },
        officePhone: { type: String },
        resiFax: { type: String },
        resiPhone: { type: String },
      },
    },

    secondHolder: {
      exemptRefNo: { type: String },
      isEmailValid: { type: Boolean, default: false },
      isMobileValid: { type: Boolean, default: false },
      emailDeclaration: { type: String },
      mobileDeclaration: { type: String },
      mobile: { type: String },
      email: { type: String },
      ckycNumber: { type: String },
      kycType: { type: String },
    },

    thirdHolder: {
      exemptRefNo: { type: String },
      isEmailValid: { type: Boolean, default: false },
      isMobileValid: { type: Boolean, default: false },
      emailDeclaration: { type: String },
      mobileDeclaration: { type: String },
      mobile: { type: String },
      email: { type: String },
      ckycNumber: { type: String },
      kycType: { type: String },
    },
  },
  { timestamps: true}
);
const kyc_profile = mongoose.model("kyc_profile", KYCProfileSchema, "kyc_profiles");

const KYCBankSchema = new mongoose.Schema(
  {
    registerId: { type: Schema.Types.ObjectId, ref: "kyc_register", required: true },
    statusId : {type : Number,default : 2},
    divPayMode: {
      type: String,
      default: "",
      trim: true,
    },
    chequeName: {
      type: String,
      default: "",
      trim: true,
    },
    banks: [
      {
        accountType: { type: String, required: true, trim: true },
        accountNo: { type: String, required: true, trim: true },
        micrNo: { type: String, required: true, trim: true },
        ifscCode: { type: String, required: true, trim: true },
        defaultBank: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
)
const kyc_bank = mongoose.model("kyc_bank", KYCBankSchema, "kyc_banks");

const KYCDocumentSchema = new mongoose.Schema(
  {
    registerId: { type: Schema.Types.ObjectId, ref: "kyc_register", required: true },
    statusId : {type : Number,required:true},
    document : {
      imageName : {type : String,required : true},
      image : {type: String,required : true},
    }
   
  },
  { timestamps: true }
)
const kyc_document = mongoose.model("kyc_document", KYCDocumentSchema, "kyc_documents");
export { kyc_register, kyc_address,kyc_nominee,kyc_profile,kyc_bank,kyc_document };
