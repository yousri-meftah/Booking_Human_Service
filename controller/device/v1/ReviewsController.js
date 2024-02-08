/**
 * ReviewsController.js
 * @description : exports action methods for Reviews.
 */

const Reviews = require('../../../model/Reviews');
const ReviewsSchemaKey = require('../../../utils/validation/ReviewsValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Reviews in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Reviews. {status, message, data}
 */ 
const addReviews = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      ReviewsSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Reviews(dataToCreate);
    let createdReviews = await dbService.create(Reviews,dataToCreate);
    return res.success({ data : createdReviews });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Reviews in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Reviewss. {status, message, data}
 */
const bulkInsertReviews = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    let createdReviewss = await dbService.create(Reviews,dataToCreate);
    createdReviewss = { count: createdReviewss ? createdReviewss.length : 0 };
    return res.success({ data:{ count:createdReviewss.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Reviews from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Reviews(s). {status, message, data}
 */
const findAllReviews = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ReviewsSchemaKey.findFilterKeys,
      Reviews.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Reviews, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundReviewss = await dbService.paginate( Reviews,query,options);
    if (!foundReviewss || !foundReviewss.data || !foundReviewss.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundReviewss });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Reviews from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Reviews. {status, message, data}
 */
const getReviews = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundReviews = await dbService.findOne(Reviews,query, options);
    if (!foundReviews){
      return res.recordNotFound();
    }
    return res.success({ data :foundReviews });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Reviews.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getReviewsCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ReviewsSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedReviews = await dbService.count(Reviews,where);
    return res.success({ data : { count: countedReviews } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Reviews with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Reviews.
 * @return {Object} : updated Reviews. {status, message, data}
 */
const updateReviews = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ReviewsSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedReviews = await dbService.updateOne(Reviews,query,dataToUpdate);
    if (!updatedReviews){
      return res.recordNotFound();
    }
    return res.success({ data :updatedReviews });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Reviews with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Reviewss.
 * @return {Object} : updated Reviewss. {status, message, data}
 */
const bulkUpdateReviews = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }
    let updatedReviews = await dbService.updateMany(Reviews,filter,dataToUpdate);
    if (!updatedReviews){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedReviews } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Reviews with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Reviews.
 * @return {obj} : updated Reviews. {status, message, data}
 */
const partialUpdateReviews = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ReviewsSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedReviews = await dbService.updateOne(Reviews, query, dataToUpdate);
    if (!updatedReviews) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedReviews });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Reviews from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Reviews.
 * @return {Object} : deactivated Reviews. {status, message, data}
 */
const softDeleteReviews = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = { isDeleted: true, };
    let updatedReviews = await dbService.updateOne(Reviews, query, updateBody);
    if (!updatedReviews){
      return res.recordNotFound();
    }
    return res.success({ data:updatedReviews });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Reviews from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Reviews. {status, message, data}
 */
const deleteReviews = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedReviews = await dbService.deleteOne(Reviews, query);
    if (!deletedReviews){
      return res.recordNotFound();
    }
    return res.success({ data :deletedReviews });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Reviews in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyReviews = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedReviews = await dbService.deleteMany(Reviews,query);
    if (!deletedReviews){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedReviews } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Reviews from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Reviews.
 * @return {Object} : number of deactivated documents of Reviews. {status, message, data}
 */
const softDeleteManyReviews = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = { isDeleted: true, };
    let updatedReviews = await dbService.updateMany(Reviews,query, updateBody);
    if (!updatedReviews) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedReviews } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addReviews,
  bulkInsertReviews,
  findAllReviews,
  getReviews,
  getReviewsCount,
  updateReviews,
  bulkUpdateReviews,
  partialUpdateReviews,
  softDeleteReviews,
  deleteReviews,
  deleteManyReviews,
  softDeleteManyReviews    
};