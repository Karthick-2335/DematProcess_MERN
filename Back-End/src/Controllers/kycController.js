import kyc_register from "../Models/kyc.js";

class ApiCommonResponse {
  constructor(success, message, data = null, errors = []) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}
export async function kycRegisterSave(req,res) {
  if(req.body){
    const create = new kyc_register(req.body);
    const saveTest = await create.save();
    return res.status(201).json(new ApiCommonResponse(true, "Records saved successfully"));
  }
}