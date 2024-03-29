import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    password: String,
    resetToken: String,
    resetTokenExpiry: Date,
  });
  
  const User = mongoose.model('User', userSchema);

  export default User;