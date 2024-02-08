/**
 * USERS.js
 * @description :: model of a database collection USERS
 */

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const { USER_TYPES } = require('../constants/authConstant');
const { convertObjectToEnum } = require('../utils/common');
const rolesEnum = require('../constants/roles');
        
const authConstantEnum = require('../constants/authConstant');
        
const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
  {

    username:{
      type:String,
      required:true,
      unique:false,
      lowercase:false,
      trim:false,
      uniqueCaseInsensitive:true
    },

    password:{ type:String },

    email:{
      type:String,
      unique:true,
      required:true,
      lowercase:false,
      trim:false,
      uniqueCaseInsensitive:true
    },

    contact_info:{
      type:String,
      required:true,
      unique:false,
      lowercase:false,
      trim:false,
      uniqueCaseInsensitive:true
    },

    type:{
      type:String,
      required:true
    },

    verifed:{
      default:false,
      type:Boolean
    },

    userType:{
      type:Number,
      enum:convertObjectToEnum(USER_TYPES),
      required:true
    },

    isActive:{ type:Boolean },

    isDeleted:{ type:Boolean },

    createdAt:{ type:Date },

    updatedAt:{ type:Date },

    Latitude:{
      lowercase:false,
      trim:false,
      unique:false,
      type:String,
      required:true,
      uniqueCaseInsensitive:true
    },

    Longitude:{
      lowercase:false,
      trim:false,
      unique:false,
      type:String,
      required:true,
      uniqueCaseInsensitive:true
    },

    CommissionRate:{
      min:0,
      max:100,
      unique:false,
      type:Number,
      required:false
    },

    DiscountRate:{
      min:0,
      max:100,
      unique:false,
      type:Number,
      required:false
    },

    DiscountUntil:{ type:Date },

    mobileNo:{ type:String },

    resetPasswordLink:{
      code:String,
      expireTime:Date
    },

    loginRetryLimit:{
      type:Number,
      default:0
    },

    loginReactiveTime:{ type:Date },

    ssoAuth:{
      googleId:{ type:String },
      facebookId:{ type:String }
    }
  }
  ,{ 
    timestamps: { 
      createdAt: 'createdAt', 
      updatedAt: 'updatedAt' 
    } 
  }
);
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  if (this.password){
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length){
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
schema.method('toJSON', function () {
  const {
    _id, __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = _id;
  delete object.password;
     
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
schema.plugin(uniqueValidator,{ message: 'Error, expected {VALUE} to be unique.' });
const USERS = mongoose.model('USERS',schema);
module.exports = USERS;