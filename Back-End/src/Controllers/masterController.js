import {tax_master,occupation_master,holding_nature_master,pan_exemptcat_master,nomineeandguardrel_masters} from "../Models/master.js";

class ApiCommonResponse {
  constructor(success, message, data = null, errors = []) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}

export async function taxMaster(_, res) {
  try {
    const findTestResult = await tax_master.find();

    if (!findTestResult || findTestResult.length === 0) {
      return res.status(404).json(new ApiCommonResponse(false, "No records found"));
    }
    return res.status(200).json(new ApiCommonResponse(true, "Records fetched successfully", findTestResult));
  } catch (error) {
    return res.json(new ApiCommonResponse(false, "Error fetching records", null, [error.message]));
  }
}
export async function occupationMaster(_, res) {
  try {
    const findTestResult = await occupation_master.find();

    if (!findTestResult || findTestResult.length === 0) {
      return res.status(404).json(new ApiCommonResponse(false, "No records found"));
    }
    return res.json(new ApiCommonResponse(true, "Records fetched successfully", findTestResult));
  } catch (error) {
    return res.json(new ApiCommonResponse(false, "Error fetching records", null, [error.message]));
  }
}
export async function holdingNatureMaster(_, res) {
  try {
    const findTestResult = await holding_nature_master.find();

    if (!findTestResult || findTestResult.length === 0) {
      return res.status(404).json(new ApiCommonResponse(false, "No records found"));
    }
    return res.json(new ApiCommonResponse(true, "Records fetched successfully", findTestResult));
  } catch (error) {
    return res.json(new ApiCommonResponse(false, "Error fetching records", null, [error.message]));
  }
}
export async function panExemptCatmaster(_, res) {
  try {
    const findTestResult = await pan_exemptcat_master.find();

    if (!findTestResult || findTestResult.length === 0) {
      return res.status(404).json(new ApiCommonResponse(false, "No records found"));
    }
    return res.json(new ApiCommonResponse(true, "Records fetched successfully", findTestResult));
  } catch (error) {
    return res.json(new ApiCommonResponse(false, "Error fetching records", null, [error.message]));
  }
}
export async function guardianRelationShip(_, res) {
  try {
    const findTestResult = await nomineeandguardrel_masters.find({isGuardian:true});
    if (!findTestResult || findTestResult.length === 0) {
      return res.status(404).json(new ApiCommonResponse(false, "No records found"));
    }
    return res.json(new ApiCommonResponse(true, "Records fetched successfully", findTestResult));
  } catch (error) {
    return res.json(new ApiCommonResponse(false, "Error fetching records", null, [error.message]));
  }
}