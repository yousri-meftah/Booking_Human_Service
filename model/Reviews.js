/**
 * Reviews.js
 * @description :: model of a database collection Reviews
 */

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
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

    BookingID:{
      type:Schema.Types.ObjectId,
      ref:'Booking'
    },

    ClientID:{
      type:Schema.Types.ObjectId,
      ref:'USERS'
    },

    ProviderID:{
      type:Schema.Types.ObjectId,
      ref:'Provider'
    },

    Rating:{
      type:Number,
      min:0,
      max:5,
      default:null,
      unique:false,
      required:false
    },

    Comment:{
      type:String,
      minLength:0,
      maxLength:300,
      default:null,
      required:false,
      unique:false,
      lowercase:false,
      trim:false,
      uniqueCaseInsensitive:true
    },

    isDeleted:{ type:Boolean },

    createdAt:{ type:Date },

    updatedAt:{ type:Date }
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
  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length){
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
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
const Reviews = mongoose.model('Reviews',schema);
module.exports = Reviews;