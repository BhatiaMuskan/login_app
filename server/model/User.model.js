import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username exists"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  mobile: { type: Number },
  address: { type: String },
  profile: { type: String },
});

// Export the User model
export default mongoose.models.User || mongoose.model("User", UserSchema);
