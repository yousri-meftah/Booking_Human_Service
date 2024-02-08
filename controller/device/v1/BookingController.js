/**
 * BookingController.js
 * @description : exports action methods for Booking.
 */

const Booking = require('../../../model/Booking');
const BookingSchemaKey = require('../../../utils/validation/BookingValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../../utils/deleteDependent');
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Booking in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Booking. {status, message, data}
 */ 
const addBooking = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      BookingSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Booking(dataToCreate);
    let createdBooking = await dbService.create(Booking,dataToCreate);
    return res.success({ data : createdBooking });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Booking in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Bookings. {status, message, data}
 */
const bulkInsertBooking = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    let createdBookings = await dbService.create(Booking,dataToCreate);
    createdBookings = { count: createdBookings ? createdBookings.length : 0 };
    return res.success({ data:{ count:createdBookings.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Booking from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Booking(s). {status, message, data}
 */
const findAllBooking = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      BookingSchemaKey.findFilterKeys,
      Booking.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Booking, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundBookings = await dbService.paginate( Booking,query,options);
    if (!foundBookings || !foundBookings.data || !foundBookings.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundBookings });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Booking from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Booking. {status, message, data}
 */
const getBooking = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundBooking = await dbService.findOne(Booking,query, options);
    if (!foundBooking){
      return res.recordNotFound();
    }
    return res.success({ data :foundBooking });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Booking.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getBookingCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      BookingSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedBooking = await dbService.count(Booking,where);
    return res.success({ data : { count: countedBooking } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Booking with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Booking.
 * @return {Object} : updated Booking. {status, message, data}
 */
const updateBooking = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      BookingSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedBooking = await dbService.updateOne(Booking,query,dataToUpdate);
    if (!updatedBooking){
      return res.recordNotFound();
    }
    return res.success({ data :updatedBooking });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Booking with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Bookings.
 * @return {Object} : updated Bookings. {status, message, data}
 */
const bulkUpdateBooking = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }
    let updatedBooking = await dbService.updateMany(Booking,filter,dataToUpdate);
    if (!updatedBooking){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedBooking } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Booking with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Booking.
 * @return {obj} : updated Booking. {status, message, data}
 */
const partialUpdateBooking = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      BookingSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedBooking = await dbService.updateOne(Booking, query, dataToUpdate);
    if (!updatedBooking) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedBooking });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of Booking from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Booking.
 * @return {Object} : deactivated Booking. {status, message, data}
 */
const softDeleteBooking = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = { isDeleted: true, };
    let updatedBooking = await deleteDependentService.softDeleteBooking(query, updateBody);
    if (!updatedBooking){
      return res.recordNotFound();
    }
    return res.success({ data:updatedBooking });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of Booking from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Booking. {status, message, data}
 */
const deleteBooking = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedBooking;
    if (req.body.isWarning) { 
      deletedBooking = await deleteDependentService.countBooking(query);
    } else {
      deletedBooking = await deleteDependentService.deleteBooking(query);
    }
    if (!deletedBooking){
      return res.recordNotFound();
    }
    return res.success({ data :deletedBooking });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Booking in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyBooking = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedBooking;
    if (req.body.isWarning) {
      deletedBooking = await deleteDependentService.countBooking(query);
    }
    else {
      deletedBooking = await deleteDependentService.deleteBooking(query);
    }
    if (!deletedBooking){
      return res.recordNotFound();
    }
    return res.success({ data :deletedBooking });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Booking from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Booking.
 * @return {Object} : number of deactivated documents of Booking. {status, message, data}
 */
const softDeleteManyBooking = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = { isDeleted: true, };
    let updatedBooking = await deleteDependentService.softDeleteBooking(query, updateBody);
    if (!updatedBooking) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedBooking });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addBooking,
  bulkInsertBooking,
  findAllBooking,
  getBooking,
  getBookingCount,
  updateBooking,
  bulkUpdateBooking,
  partialUpdateBooking,
  softDeleteBooking,
  deleteBooking,
  deleteManyBooking,
  softDeleteManyBooking    
};