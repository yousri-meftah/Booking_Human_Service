/**
 * Tool_bookingController.js
 * @description : exports action methods for Tool_booking.
 */

const Tool_booking = require('../../../model/Tool_booking');
const Tool_bookingSchemaKey = require('../../../utils/validation/Tool_bookingValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Tool_booking in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Tool_booking. {status, message, data}
 */ 
const addTool_booking = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      Tool_bookingSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Tool_booking(dataToCreate);
    let createdTool_booking = await dbService.create(Tool_booking,dataToCreate);
    return res.success({ data : createdTool_booking });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Tool_booking in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Tool_bookings. {status, message, data}
 */
const bulkInsertTool_booking = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    let createdTool_bookings = await dbService.create(Tool_booking,dataToCreate);
    createdTool_bookings = { count: createdTool_bookings ? createdTool_bookings.length : 0 };
    return res.success({ data:{ count:createdTool_bookings.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Tool_booking from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Tool_booking(s). {status, message, data}
 */
const findAllTool_booking = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      Tool_bookingSchemaKey.findFilterKeys,
      Tool_booking.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Tool_booking, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundTool_bookings = await dbService.paginate( Tool_booking,query,options);
    if (!foundTool_bookings || !foundTool_bookings.data || !foundTool_bookings.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundTool_bookings });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Tool_booking from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Tool_booking. {status, message, data}
 */
const getTool_booking = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundTool_booking = await dbService.findOne(Tool_booking,query, options);
    if (!foundTool_booking){
      return res.recordNotFound();
    }
    return res.success({ data :foundTool_booking });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Tool_booking.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getTool_bookingCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      Tool_bookingSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedTool_booking = await dbService.count(Tool_booking,where);
    return res.success({ data : { count: countedTool_booking } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Tool_booking with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Tool_booking.
 * @return {Object} : updated Tool_booking. {status, message, data}
 */
const updateTool_booking = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      Tool_bookingSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedTool_booking = await dbService.updateOne(Tool_booking,query,dataToUpdate);
    if (!updatedTool_booking){
      return res.recordNotFound();
    }
    return res.success({ data :updatedTool_booking });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Tool_booking with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Tool_bookings.
 * @return {Object} : updated Tool_bookings. {status, message, data}
 */
const bulkUpdateTool_booking = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }
    let updatedTool_booking = await dbService.updateMany(Tool_booking,filter,dataToUpdate);
    if (!updatedTool_booking){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedTool_booking } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Tool_booking with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Tool_booking.
 * @return {obj} : updated Tool_booking. {status, message, data}
 */
const partialUpdateTool_booking = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      Tool_bookingSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedTool_booking = await dbService.updateOne(Tool_booking, query, dataToUpdate);
    if (!updatedTool_booking) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedTool_booking });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Tool_booking from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Tool_booking.
 * @return {Object} : deactivated Tool_booking. {status, message, data}
 */
const softDeleteTool_booking = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = { isDeleted: true, };
    let updatedTool_booking = await dbService.updateOne(Tool_booking, query, updateBody);
    if (!updatedTool_booking){
      return res.recordNotFound();
    }
    return res.success({ data:updatedTool_booking });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Tool_booking from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Tool_booking. {status, message, data}
 */
const deleteTool_booking = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedTool_booking = await dbService.deleteOne(Tool_booking, query);
    if (!deletedTool_booking){
      return res.recordNotFound();
    }
    return res.success({ data :deletedTool_booking });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Tool_booking in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyTool_booking = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedTool_booking = await dbService.deleteMany(Tool_booking,query);
    if (!deletedTool_booking){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedTool_booking } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Tool_booking from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Tool_booking.
 * @return {Object} : number of deactivated documents of Tool_booking. {status, message, data}
 */
const softDeleteManyTool_booking = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = { isDeleted: true, };
    let updatedTool_booking = await dbService.updateMany(Tool_booking,query, updateBody);
    if (!updatedTool_booking) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedTool_booking } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addTool_booking,
  bulkInsertTool_booking,
  findAllTool_booking,
  getTool_booking,
  getTool_bookingCount,
  updateTool_booking,
  bulkUpdateTool_booking,
  partialUpdateTool_booking,
  softDeleteTool_booking,
  deleteTool_booking,
  deleteManyTool_booking,
  softDeleteManyTool_booking    
};