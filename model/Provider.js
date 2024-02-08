/**
 * Provider.js
 * @description :: model of a database collection Provider
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

    ProviderID:{
      type:Schema.Types.ObjectId,
      ref:'USERS',
      unique:false,
      required:true
    },

    ServiceID:{
      type:Schema.Types.ObjectId,
      ref:'Services',
      unique:false,
      required:true
    },

    Experience:{
      type:Number,
      min:0,
      max:70,
      default:0,
      unique:false,
      required:false
    },

    RatingsAverage:{
      type:Number,
      min:0,
      max:5,
      default:0,
      unique:false,
      required:false
    },

    ReviewsCount:{
      type:Number,
      min:0,
      max:5,
      default:null,
      unique:false,
      required:false
    },

    Availability:{
      type:Boolean,
      default:true
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
const Provider = mongoose.model('Provider',schema);
module.exports = Provider;