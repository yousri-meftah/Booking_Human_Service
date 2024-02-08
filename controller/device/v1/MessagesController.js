/**
 * MessagesController.js
 * @description : exports action methods for Messages.
 */

const Messages = require('../../../model/Messages');
const MessagesSchemaKey = require('../../../utils/validation/MessagesValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Messages in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Messages. {status, message, data}
 */ 
const addMessages = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      MessagesSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Messages(dataToCreate);
    let createdMessages = await dbService.create(Messages,dataToCreate);
    return res.success({ data : createdMessages });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Messages in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Messagess. {status, message, data}
 */
const bulkInsertMessages = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    let createdMessagess = await dbService.create(Messages,dataToCreate);
    createdMessagess = { count: createdMessagess ? createdMessagess.length : 0 };
    return res.success({ data:{ count:createdMessagess.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Messages from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Messages(s). {status, message, data}
 */
const findAllMessages = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      MessagesSchemaKey.findFilterKeys,
      Messages.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Messages, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundMessagess = await dbService.paginate( Messages,query,options);
    if (!foundMessagess || !foundMessagess.data || !foundMessagess.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundMessagess });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Messages from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Messages. {status, message, data}
 */
const getMessages = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundMessages = await dbService.findOne(Messages,query, options);
    if (!foundMessages){
      return res.recordNotFound();
    }
    return res.success({ data :foundMessages });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Messages.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getMessagesCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      MessagesSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedMessages = await dbService.count(Messages,where);
    return res.success({ data : { count: countedMessages } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Messages with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Messages.
 * @return {Object} : updated Messages. {status, message, data}
 */
const updateMessages = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      MessagesSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedMessages = await dbService.updateOne(Messages,query,dataToUpdate);
    if (!updatedMessages){
      return res.recordNotFound();
    }
    return res.success({ data :updatedMessages });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Messages with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Messagess.
 * @return {Object} : updated Messagess. {status, message, data}
 */
const bulkUpdateMessages = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }
    let updatedMessages = await dbService.updateMany(Messages,filter,dataToUpdate);
    if (!updatedMessages){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedMessages } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Messages with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Messages.
 * @return {obj} : updated Messages. {status, message, data}
 */
const partialUpdateMessages = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      MessagesSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedMessages = await dbService.updateOne(Messages, query, dataToUpdate);
    if (!updatedMessages) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedMessages });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Messages from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Messages.
 * @return {Object} : deactivated Messages. {status, message, data}
 */
const softDeleteMessages = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = { isDeleted: true, };
    let updatedMessages = await dbService.updateOne(Messages, query, updateBody);
    if (!updatedMessages){
      return res.recordNotFound();
    }
    return res.success({ data:updatedMessages });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Messages from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Messages. {status, message, data}
 */
const deleteMessages = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedMessages = await dbService.deleteOne(Messages, query);
    if (!deletedMessages){
      return res.recordNotFound();
    }
    return res.success({ data :deletedMessages });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Messages in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyMessages = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedMessages = await dbService.deleteMany(Messages,query);
    if (!deletedMessages){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedMessages } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Messages from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Messages.
 * @return {Object} : number of deactivated documents of Messages. {status, message, data}
 */
const softDeleteManyMessages = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = { isDeleted: true, };
    let updatedMessages = await dbService.updateMany(Messages,query, updateBody);
    if (!updatedMessages) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedMessages } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addMessages,
  bulkInsertMessages,
  findAllMessages,
  getMessages,
  getMessagesCount,
  updateMessages,
  bulkUpdateMessages,
  partialUpdateMessages,
  softDeleteMessages,
  deleteMessages,
  deleteManyMessages,
  softDeleteManyMessages    
};