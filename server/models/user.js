import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
     _id:{type:String,required:true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    bio: { type: String, max: 500 },
    headline: { type: String }, 
    skills: [{ type: String }],
    interests: [{ type: String }],
    experience: { type: String }
  }, { timestamps: true });

  const User = mongoose.model('User', UserSchema)
  export default User