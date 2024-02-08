/**
 * Booking.js
 * @description :: model of a database collection Booking
 */

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const rolesEnum = require('../constants/roles');
        
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

    isDeleted:{ type:Boolean },

    isActive:{ type:Boolean },

    createdAt:{ type:Date },

    updatedAt:{ type:Date },

    clientID:{
      unique:false,
      ref:'USERS',
      type:Schema.Types.ObjectId,
      required:true
    },

    providerID:{
      unique:false,
      ref:'Provider',
      type:Schema.Types.ObjectId,
      required:true
    },

    BookingDate:{
      unique:false,
      type:Date,
      required:true
    },

    TimeSlot:{
      min:0,
      max:1000,
      unique:false,
      type:Number,
      required:true
    },

    Status:{
      lowercase:false,
      trim:false,
      default:rolesEnum.status['Pending'],
      unique:false,
      type:String,
      required:true,
      uniqueCaseInsensitive:true,
      enum:rolesEnum.status
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

schema.method('toJSON', function () {
  const {
    _id, __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = _id;
     
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const Booking = mongoose.model('Booking',schema);
module.exports = Booking;