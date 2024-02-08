/**
 * PaymentsController.js
 * @description : exports action methods for Payments.
 */

const Payments = require('../../model/Payments');
const PaymentsSchemaKey = require('../../utils/validation/PaymentsValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of Payments in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Payments. {status, message, data}
 */ 
const addPayments = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      PaymentsSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Payments(dataToCreate);
    let createdPayments = await dbService.create(Payments,dataToCreate);
    return res.success({ data : createdPayments });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Payments in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Paymentss. {status, message, data}
 */
const bulkInsertPayments = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    let createdPaymentss = await dbService.create(Payments,dataToCreate);
    createdPaymentss = { count: createdPaymentss ? createdPaymentss.length : 0 };
    return res.success({ data:{ count:createdPaymentss.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Payments from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Payments(s). {status, message, data}
 */
const findAllPayments = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      PaymentsSchemaKey.findFilterKeys,
      Payments.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Payments, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundPaymentss = await dbService.paginate( Payments,query,options);
    if (!foundPaymentss || !foundPaymentss.data || !foundPaymentss.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundPaymentss });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Payments from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Payments. {status, message, data}
 */
const getPayments = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundPayments = await dbService.findOne(Payments,query, options);
    if (!foundPayments){
      return res.recordNotFound();
    }
    return res.success({ data :foundPayments });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Payments.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getPaymentsCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      PaymentsSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedPayments = await dbService.count(Payments,where);
    return res.success({ data : { count: countedPayments } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Payments with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Payments.
 * @return {Object} : updated Payments. {status, message, data}
 */
const updatePayments = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      PaymentsSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPayments = await dbService.updateOne(Payments,query,dataToUpdate);
    if (!updatedPayments){
      return res.recordNotFound();
    }
    return res.success({ data :updatedPayments });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Payments with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Paymentss.
 * @return {Object} : updated Paymentss. {status, message, data}
 */
const bulkUpdatePayments = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }
    let updatedPayments = await dbService.updateMany(Payments,filter,dataToUpdate);
    if (!updatedPayments){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedPayments } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Payments with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Payments.
 * @return {obj} : updated Payments. {status, message, data}
 */
const partialUpdatePayments = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      PaymentsSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPayments = await dbService.updateOne(Payments, query, dataToUpdate);
    if (!updatedPayments) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedPayments });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Payments from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Payments.
 * @return {Object} : deactivated Payments. {status, message, data}
 */
const softDeletePayments = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = { isDeleted: true, };
    let updatedPayments = await dbService.updateOne(Payments, query, updateBody);
    if (!updatedPayments){
      return res.recordNotFound();
    }
    return res.success({ data:updatedPayments });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Payments from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Payments. {status, message, data}
 */
const deletePayments = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedPayments = await dbService.deleteOne(Payments, query);
    if (!deletedPayments){
      return res.recordNotFound();
    }
    return res.success({ data :deletedPayments });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Payments in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyPayments = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedPayments = await dbService.deleteMany(Payments,query);
    if (!deletedPayments){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedPayments } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Payments from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Payments.
 * @return {Object} : number of deactivated documents of Payments. {status, message, data}
 */
const softDeleteManyPayments = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = { isDeleted: true, };
    let updatedPayments = await dbService.updateMany(Payments,query, updateBody);
    if (!updatedPayments) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedPayments } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addPayments,
  bulkInsertPayments,
  findAllPayments,
  getPayments,
  getPaymentsCount,
  updatePayments,
  bulkUpdatePayments,
  partialUpdatePayments,
  softDeletePayments,
  deletePayments,
  deleteManyPayments,
  softDeleteManyPayments    
};