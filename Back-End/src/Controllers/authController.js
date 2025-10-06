import auth from '../Models/auth.js'

class ApiCommonResponse {
  constructor(success, message, data = null, errors = []) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}

export async function signUp(req, res) {
  try {
    const create = new auth(req.body);
    const saveUser = await create.save();

    res
      .status(201)
      .json(
        new ApiCommonResponse(true, "Record saved successfully", saveUser)
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiCommonResponse(false, "Error while saving record", null, [
          error.message,
        ])
      );
  }
}
export async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await auth.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(new ApiCommonResponse(false, "User not found"));
    }

    // Compare password
    const isMatch = password === user.password;
    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiCommonResponse(false, "Invalid password"));
    }

    // Prepare response (don’t send password)
    const userData = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
    };

    return res
      .status(200)
      .json(new ApiCommonResponse(true, "Login successful", userData));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiCommonResponse(false, "Error while signing in", null, [
          error.message,
        ])
      );
  }
}