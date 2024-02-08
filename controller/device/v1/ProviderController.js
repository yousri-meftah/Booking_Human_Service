/**
 * ProviderController.js
 * @description : exports action methods for Provider.
 */

const Provider = require('../../../model/Provider');
const ProviderSchemaKey = require('../../../utils/validation/ProviderValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../../utils/deleteDependent');
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Provider in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Provider. {status, message, data}
 */ 
const addProvider = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      ProviderSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Provider(dataToCreate);
    let createdProvider = await dbService.create(Provider,dataToCreate);
    return res.success({ data : createdProvider });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Provider in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Providers. {status, message, data}
 */
const bulkInsertProvider = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    let createdProviders = await dbService.create(Provider,dataToCreate);
    createdProviders = { count: createdProviders ? createdProviders.length : 0 };
    return res.success({ data:{ count:createdProviders.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Provider from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Provider(s). {status, message, data}
 */
const findAllProvider = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ProviderSchemaKey.findFilterKeys,
      Provider.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Provider, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundProviders = await dbService.paginate( Provider,query,options);
    if (!foundProviders || !foundProviders.data || !foundProviders.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundProviders });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Provider from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Provider. {status, message, data}
 */
const getProvider = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundProvider = await dbService.findOne(Provider,query, options);
    if (!foundProvider){
      return res.recordNotFound();
    }
    return res.success({ data :foundProvider });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Provider.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getProviderCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ProviderSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedProvider = await dbService.count(Provider,where);
    return res.success({ data : { count: countedProvider } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Provider with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Provider.
 * @return {Object} : updated Provider. {status, message, data}
 */
const updateProvider = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ProviderSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedProvider = await dbService.updateOne(Provider,query,dataToUpdate);
    if (!updatedProvider){
      return res.recordNotFound();
    }
    return res.success({ data :updatedProvider });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Provider with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Providers.
 * @return {Object} : updated Providers. {status, message, data}
 */
const bulkUpdateProvider = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }
    let updatedProvider = await dbService.updateMany(Provider,filter,dataToUpdate);
    if (!updatedProvider){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedProvider } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Provider with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Provider.
 * @return {obj} : updated Provider. {status, message, data}
 */
const partialUpdateProvider = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ProviderSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedProvider = await dbService.updateOne(Provider, query, dataToUpdate);
    if (!updatedProvider) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedProvider });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of Provider from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Provider.
 * @return {Object} : deactivated Provider. {status, message, data}
 */
const softDeleteProvider = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = { isDeleted: true, };
    let updatedProvider = await deleteDependentService.softDeleteProvider(query, updateBody);
    if (!updatedProvider){
      return res.recordNotFound();
    }
    return res.success({ data:updatedProvider });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of Provider from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Provider. {status, message, data}
 */
const deleteProvider = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedProvider;
    if (req.body.isWarning) { 
      deletedProvider = await deleteDependentService.countProvider(query);
    } else {
      deletedProvider = await deleteDependentService.deleteProvider(query);
    }
    if (!deletedProvider){
      return res.recordNotFound();
    }
    return res.success({ data :deletedProvider });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Provider in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyProvider = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedProvider;
    if (req.body.isWarning) {
      deletedProvider = await deleteDependentService.countProvider(query);
    }
    else {
      deletedProvider = await deleteDependentService.deleteProvider(query);
    }
    if (!deletedProvider){
      return res.recordNotFound();
    }
    return res.success({ data :deletedProvider });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Provider from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Provider.
 * @return {Object} : number of deactivated documents of Provider. {status, message, data}
 */
const softDeleteManyProvider = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = { isDeleted: true, };
    let updatedProvider = await deleteDependentService.softDeleteProvider(query, updateBody);
    if (!updatedProvider) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedProvider });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addProvider,
  bulkInsertProvider,
  findAllProvider,
  getProvider,
  getProviderCount,
  updateProvider,
  bulkUpdateProvider,
  partialUpdateProvider,
  softDeleteProvider,
  deleteProvider,
  deleteManyProvider,
  softDeleteManyProvider    
};