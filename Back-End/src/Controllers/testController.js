import test from '../Models/test.js'

export async function checking (req,res) {
  var findTestResult = await test.find()
  res.json(findTestResult)  ;
};