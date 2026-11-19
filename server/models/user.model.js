import mongoose from "mongoose";



const pagesSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  path: {
    type: String,
    default: "",
  },
  keywords: {
    type: [String],
    default: [],
  },
});

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    assistantName:{
        type:String,
        default:"suvi"
    },
    businessName:{
        type:String,
        default:""
    },
    businessType:{
        type:String,
        default:""
    },
    businessDescription:{
        type:String,
        default:""
    },
    tone:{
        type:String,
        enum:["friendly","professional","sales"],
        default:"friendly"
    },
    theme:{
        type:String,
        enum:["light","dark","glass","neon"],
        default:"dark"
    },
    enableVoice:{
        type:Boolean,
        default:true
    },
    pages:{
        type:[pagesSchema],
        default:[]
    },
    enableNavigation:{
        type:Boolean,
        default:true
    },
    geminiApiKey:{
        type:String,
        default:""
    },
    geminiStatus:{
        type:String,
        enum:["active","quota_exceeded","invalid"],
        default:"active"
    },
    totalMessages:{
        type:Number,
        default:0
    },
    plan:{
        type:String,
        enum:["free","pro"],
        default:"free"
    },
    requestLimit:{
        type:Number,
        default:200,
    },
    proExpiresAt:{
        type:Date,
        default:null,
    },
    isSetupComplete:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const User = mongoose.model("User",UserSchema)
export default User;