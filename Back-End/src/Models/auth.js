import mongoose from 'mongoose'

const AuthSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "First name is required"],
      trim: true
    },
    lname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    terms: {
      type: Boolean,
      required: true
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);



const auth = mongoose.model('auth',AuthSchema);

export default auth;