import {kyc_register,kyc_address,kyc_nominee,kyc_profile, kyc_bank,kyc_document} from "../Models/kyc.js";
import mongoose from "mongoose";

class ApiCommonResponse {
  constructor(success, message, data = null, errors = []) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}
export async function saveOrUpdateRegister(req, res) {
  try {
    const { _id, ...registerData } = req.body;

    let register;
    if (_id && mongoose.Types.ObjectId.isValid(_id)) {
      register = await kyc_register.findByIdAndUpdate(_id, registerData, { new: true });
      if (!register) return res.status(404).json(new ApiCommonResponse(false, "Register not found"));
    } else {
      register = await kyc_register.create(registerData);
    }

    return res.status(200).json(new ApiCommonResponse(true, "Register saved successfully", register));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error saving register", null, [error.message]));
  }
}

export async function saveOrUpdateAddress(req, res) {
  try {
    const { registerId, ...addressData } = req.body;

    if (!registerId || !mongoose.Types.ObjectId.isValid(registerId)) {
      return res.status(400).json(new ApiCommonResponse(false, "Invalid registerId"));
    }

    let address = await kyc_address.findOne({ registerId });

    if (address) {
      address = await kyc_address.findOneAndUpdate({ registerId }, addressData, { new: true });
    } else {
      address = await kyc_address.create({ registerId, ...addressData });
    }

    return res.status(200).json(new ApiCommonResponse(true, "Address saved successfully", address));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error saving address", null, [error.message]));
  }
}
export async function saveOrUpdateNominee(req, res) {
  try {
    const { registerId, ...nomineeData } = req.body;

    if (!registerId || !mongoose.Types.ObjectId.isValid(registerId)) {
      return res.status(400).json(new ApiCommonResponse(false, "Invalid registerId"));
    }

    let nominee = await kyc_nominee.findOne({ registerId });

    if (nominee) {
      nominee = await kyc_nominee.findOneAndUpdate({ registerId }, nomineeData, { new: true });
    } else {
      nominee = await kyc_nominee.create({ registerId, ...nomineeData });
    }

    return res.status(200).json(new ApiCommonResponse(true, "Address saved successfully", nominee));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error saving address", null, [error.message]));
  }
}
export async function saveOrUpdateProfile(req, res) {
  try {
    const { registerId, ...profileData } = req.body;

    if (!registerId || !mongoose.Types.ObjectId.isValid(registerId)) {
      return res.status(400).json(new ApiCommonResponse(false, "Invalid registerId"));
    }

    let profile = await kyc_profile.findOne({ registerId });

    if (profile) {
      profile = await kyc_profile.findOneAndUpdate({ registerId }, profileData, { new: true });
    } else {
      profile = await kyc_profile.create({ registerId, ...profileData });
    }

    return res.status(200).json(new ApiCommonResponse(true, "Address saved successfully", profile));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error saving address", null, [error.message]));
  }
}
export async function saveOrUpdateBank(req, res) {
  try {
    const { registerId, ...BankData } = req.body;

    if (!registerId || !mongoose.Types.ObjectId.isValid(registerId)) {
      return res.status(400).json(new ApiCommonResponse(false, "Invalid registerId"));
    }

    let bank = await kyc_bank.findOne({ registerId });

    if (bank) {
      bank = await kyc_bank.findOneAndUpdate({ registerId }, BankData, { new: true });
    } else {
      bank = await kyc_bank.create({ registerId, ...BankData });
    }

    return res.status(200).json(new ApiCommonResponse(true, "Address saved successfully", bank));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error saving address", null, [error.message]));
  }
}
export async function getRegisterById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(new ApiCommonResponse(false, "Invalid registerId"));
    }

    const register = await kyc_register.findById(id);
    if (!register) return res.status(404).json(new ApiCommonResponse(false, "Register not found"));

    return res.status(200).json(new ApiCommonResponse(true, "Register fetched successfully", register));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error fetching register", null, [error.message]));
  }
}
export async function getAddressById(req, res) {
  try {
    const { registerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(registerId)) {
      return res.status(400).json(new ApiCommonResponse(false, "Invalid registerId"));
    }

    const address = await kyc_address.findOne({ registerId });
    if (!address) return res.status(404).json(new ApiCommonResponse(false, "Address not found"));

    return res.status(200).json(new ApiCommonResponse(true, "Address fetched successfully", address));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error fetching address", null, [error.message]));
  }
}
export async function getNomineeById(req, res) {
  try {
    const { registerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(registerId)) {
      return res.status(400).json(new ApiCommonResponse(false, "Invalid registerId"));
    }

    const nominee = await kyc_nominee.findOne({ registerId });
    if (!nominee) return res.status(404).json(new ApiCommonResponse(false, "Address not found"));

    return res.status(200).json(new ApiCommonResponse(true, "Address fetched successfully", nominee));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error fetching address", null, [error.message]));
  }
}
export async function getProfileById(req, res) {
  try {
    const { registerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(registerId)) {
      return res.status(400).json(new ApiCommonResponse(false, "Invalid registerId"));
    }

    const profile = await kyc_profile.findOne({ registerId });
    if (!profile) return res.status(404).json(new ApiCommonResponse(false, "Address not found"));

    return res.status(200).json(new ApiCommonResponse(true, "Profile fetched successfully", profile));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error fetching profile", null, [error.message]));
  }
}
export async function getBankById(req, res) {
  try {
    const { registerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(registerId)) {
      return res.status(400).json(new ApiCommonResponse(false, "Invalid registerId"));
    }

    const bank = await kyc_bank.findOne({ registerId });
    if (!bank) return res.status(404).json(new ApiCommonResponse(false, "Address not found"));

    return res.status(200).json(new ApiCommonResponse(true, "Profile fetched successfully", bank));
  } catch (error) {
    return res.status(500).json(new ApiCommonResponse(false, "Error fetching profile", null, [error.message]));
  }
}
export async function getAll(_, res) {
  try {
    const findTestResult = await kyc_register.find().select({
  "others.client_code": 1,
  "primaryHolder.firstName":1,
  "primaryHolder.middleName":1,
  "primaryHolder.lastName":1,
  "primaryHolder.pan":1,
  "createdAt":1
});
const userData = findTestResult.map((doc) => ({
  applicationNo: doc.others?.client_code || "",
  userName: `${doc.primaryHolder?.firstName || ""} ${doc.primaryHolder?.middleName || ""} ${doc.primaryHolder?.lastName || ""}`.trim(),
  panNumber: doc.primaryHolder?.pan || "",
  email: "",          // if you have email in DB, map here
  mobile: "",         // if you have mobile in DB, map here
  createdon: doc.createdAt?.toISOString() || "",
  status: "Active",   // default or map from DB if exists
  id: doc._id.toString()
}));
    if (!userData || userData.length === 0) {
      return res.status(404).json(new ApiCommonResponse(false, "No records found"));
    }
    return res.status(200).json(new ApiCommonResponse(true, "Records fetched successfully", userData));
  } catch (error) {
    return res.json(new ApiCommonResponse(false, "Error fetching records", null, [error.message]));
  }
}
export async function KycOverallStatus(req, res) {
  try {
    const { id } = req.params; // assuming route: /kyc/overall-status/:id

    if (!id) {
      return res
        .status(400)
        .json(new ApiCommonResponse(false, "registerId (_id) is required"));
    }

    // Fetch all data in parallel
    const [register, address, nominee, profile, bank, document] = await Promise.all([
      kyc_register.findById(id).select({ statusId: 1, isMinor: 1,isNri : 1,isSecondHolder : 1,isThirdHolder : 1 }),
      kyc_address.findOne({ registerId: id }).select({ statusId: 1 }),
      kyc_nominee.findOne({ registerId: id }).select({ statusId: 1 }),
      kyc_profile.findOne({ registerId: id }).select({ statusId: 1 }),
      kyc_bank.findOne({ registerId: id }).select({ statusId: 1 }),
      kyc_document.findOne({ registerId: id }).select({ statusId: 1 }),
    ]);

    // Helper to get valid statusId or default 0
    const getStatus = (record) =>
      record && record.statusId != null && record.statusId !== ""
        ? record.statusId
        : 0;

    // ✅ Build overall KYC stage status array
    const overall = [
      { stageName: "Registration", statusId: getStatus(register), stageId: 1 },
      { stageName: "Address", statusId: getStatus(address), stageId: 2 },
      { stageName: "Nominee", statusId: getStatus(nominee), stageId: 3 },
      { stageName: "Profile", statusId: getStatus(profile), stageId: 4 },
      { stageName: "Bank", statusId: getStatus(bank), stageId: 5 },
      { stageName: "Document", statusId: getStatus(document), stageId: 6 },
    ];

    // ✅ Add commonData block
    const commonData = {
      isMinor: register?.isMinor,
      isNri : register?.isNri,
      isSecondHolder : register?.isSecondHolder,
      isThirdHolder : register?.isThirdHolder
    };

    // ✅ Prepare final payload
    const userData = { commonData, overall };

    // ✅ Send response
    return res
      .status(200)
      .json(new ApiCommonResponse(true, "Records fetched successfully", userData));
  } catch (error) {
    console.error("Error fetching KYC overall status:", error);
    return res.json(
      new ApiCommonResponse(false, "Error fetching records", null, [
        error.message,
      ])
    );
  }
}
