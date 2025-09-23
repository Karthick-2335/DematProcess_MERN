import Test from '../Models/test.js'

export async function get (_,res) {
  var findTestResult = await Test.find();
  if(!findTestResult) return res.status(404).json({message:"record not found"});
  res.json(findTestResult) ;
}; 
export async function getbyId (req,res) {
  var findTestResult = await Test.findById(req.params.id)
  if(!findTestResult) return res.status(404).json({message:"record not found"});
  res.json(findTestResult) ;
}; 
export async function save(req,res) {
  const {name,address}= req.body;
  const create = new Test({name,address});
  const saveTest = await create.save();
  res.status(201).json({message:"record saved successfully..."});
}

export async function update(req,res) {
  const {name,address}= req.body;
  const updateResult = await Test.findByIdAndUpdate(req.params.id,{name,address},{new : true});
  if(!updateResult) return res.status(404).json({message: "record not found"});
  res.status(201).json({message:"record updated successfully..."});
}

export async function deleted(req,res) {
  const deleteResult = await Test.findByIdAndDelete(req.params.id);
  if(!deleteResult) return res.status(404).json({message: "record not found"});
  res.status(201).json({message:"record deleted successfully..."});
}