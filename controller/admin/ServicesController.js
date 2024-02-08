/**
 * ServicesController.js
 * @description : exports action methods for Services.
 */

const Services = require('../../model/Services');
const ServicesSchemaKey = require('../../utils/validation/ServicesValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of Services in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Services. {status, message, data}
 */ 
const addServices = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      ServicesSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Services(dataToCreate);

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Services,[ 'Name' ],dataToCreate,'INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdServices = await dbService.create(Services,dataToCreate);
    return res.success({ data : createdServices });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Services in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Servicess. {status, message, data}
 */
const bulkInsertServices = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Services,[ 'Name' ],dataToCreate,'BULK_INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdServicess = await dbService.create(Services,dataToCreate);
    createdServicess = { count: createdServicess ? createdServicess.length : 0 };
    return res.success({ data:{ count:createdServicess.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Services from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Services(s). {status, message, data}
 */
const findAllServices = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ServicesSchemaKey.findFilterKeys,
      Services.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Services, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundServicess = await dbService.paginate( Services,query,options);
    if (!foundServicess || !foundServicess.data || !foundServicess.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundServicess });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Services from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Services. {status, message, data}
 */
const getServices = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundServices = await dbService.findOne(Services,query, options);
    if (!foundServices){
      return res.recordNotFound();
    }
    return res.success({ data :foundServices });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Services.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getServicesCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ServicesSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedServices = await dbService.count(Services,where);
    return res.success({ data : { count: countedServices } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Services with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Services.
 * @return {Object} : updated Services. {status, message, data}
 */
const updateServices = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ServicesSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Services,[ 'Name' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedServices = await dbService.updateOne(Services,query,dataToUpdate);
    if (!updatedServices){
      return res.recordNotFound();
    }
    return res.success({ data :updatedServices });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Services with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Servicess.
 * @return {Object} : updated Servicess. {status, message, data}
 */
const bulkUpdateServices = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Services,[ 'Name' ],dataToUpdate,'BULK_UPDATE', filter);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedServices = await dbService.updateMany(Services,filter,dataToUpdate);
    if (!updatedServices){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedServices } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Services with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Services.
 * @return {obj} : updated Services. {status, message, data}
 */
const partialUpdateServices = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ServicesSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Services,[ 'Name' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedServices = await dbService.updateOne(Services, query, dataToUpdate);
    if (!updatedServices) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedServices });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of Services from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Services.
 * @return {Object} : deactivated Services. {status, message, data}
 */
const softDeleteServices = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = { isDeleted: true, };
    let updatedServices = await deleteDependentService.softDeleteServices(query, updateBody);
    if (!updatedServices){
      return res.recordNotFound();
    }
    return res.success({ data:updatedServices });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of Services from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Services. {status, message, data}
 */
const deleteServices = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedServices;
    if (req.body.isWarning) { 
      deletedServices = await deleteDependentService.countServices(query);
    } else {
      deletedServices = await deleteDependentService.deleteServices(query);
    }
    if (!deletedServices){
      return res.recordNotFound();
    }
    return res.success({ data :deletedServices });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Services in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyServices = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedServices;
    if (req.body.isWarning) {
      deletedServices = await deleteDependentService.countServices(query);
    }
    else {
      deletedServices = await deleteDependentService.deleteServices(query);
    }
    if (!deletedServices){
      return res.recordNotFound();
    }
    return res.success({ data :deletedServices });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Services from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Services.
 * @return {Object} : number of deactivated documents of Services. {status, message, data}
 */
const softDeleteManyServices = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = { isDeleted: true, };
    let updatedServices = await deleteDependentService.softDeleteServices(query, updateBody);
    if (!updatedServices) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedServices });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addServices,
  bulkInsertServices,
  findAllServices,
  getServices,
  getServicesCount,
  updateServices,
  bulkUpdateServices,
  partialUpdateServices,
  softDeleteServices,
  deleteServices,
  deleteManyServices,
  softDeleteManyServices    
};