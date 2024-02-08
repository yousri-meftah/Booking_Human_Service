/**
 * CategoriesController.js
 * @description : exports action methods for Categories.
 */

const Categories = require('../../../model/Categories');
const CategoriesSchemaKey = require('../../../utils/validation/CategoriesValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../../utils/deleteDependent');
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Categories in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Categories. {status, message, data}
 */ 
const addCategories = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      CategoriesSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Categories(dataToCreate);

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Categories,[ 'Name' ],dataToCreate,'INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdCategories = await dbService.create(Categories,dataToCreate);
    return res.success({ data : createdCategories });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Categories in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Categoriess. {status, message, data}
 */
const bulkInsertCategories = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Categories,[ 'Name' ],dataToCreate,'BULK_INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdCategoriess = await dbService.create(Categories,dataToCreate);
    createdCategoriess = { count: createdCategoriess ? createdCategoriess.length : 0 };
    return res.success({ data:{ count:createdCategoriess.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Categories from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Categories(s). {status, message, data}
 */
const findAllCategories = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      CategoriesSchemaKey.findFilterKeys,
      Categories.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Categories, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundCategoriess = await dbService.paginate( Categories,query,options);
    if (!foundCategoriess || !foundCategoriess.data || !foundCategoriess.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundCategoriess });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Categories from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Categories. {status, message, data}
 */
const getCategories = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundCategories = await dbService.findOne(Categories,query, options);
    if (!foundCategories){
      return res.recordNotFound();
    }
    return res.success({ data :foundCategories });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Categories.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getCategoriesCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      CategoriesSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedCategories = await dbService.count(Categories,where);
    return res.success({ data : { count: countedCategories } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Categories with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Categories.
 * @return {Object} : updated Categories. {status, message, data}
 */
const updateCategories = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      CategoriesSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Categories,[ 'Name' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedCategories = await dbService.updateOne(Categories,query,dataToUpdate);
    if (!updatedCategories){
      return res.recordNotFound();
    }
    return res.success({ data :updatedCategories });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Categories with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Categoriess.
 * @return {Object} : updated Categoriess. {status, message, data}
 */
const bulkUpdateCategories = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Categories,[ 'Name' ],dataToUpdate,'BULK_UPDATE', filter);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedCategories = await dbService.updateMany(Categories,filter,dataToUpdate);
    if (!updatedCategories){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedCategories } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Categories with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Categories.
 * @return {obj} : updated Categories. {status, message, data}
 */
const partialUpdateCategories = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      CategoriesSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Categories,[ 'Name' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedCategories = await dbService.updateOne(Categories, query, dataToUpdate);
    if (!updatedCategories) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCategories });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of Categories from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Categories.
 * @return {Object} : deactivated Categories. {status, message, data}
 */
const softDeleteCategories = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = { isDeleted: true, };
    let updatedCategories = await deleteDependentService.softDeleteCategories(query, updateBody);
    if (!updatedCategories){
      return res.recordNotFound();
    }
    return res.success({ data:updatedCategories });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of Categories from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Categories. {status, message, data}
 */
const deleteCategories = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedCategories;
    if (req.body.isWarning) { 
      deletedCategories = await deleteDependentService.countCategories(query);
    } else {
      deletedCategories = await deleteDependentService.deleteCategories(query);
    }
    if (!deletedCategories){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCategories });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Categories in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyCategories = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedCategories;
    if (req.body.isWarning) {
      deletedCategories = await deleteDependentService.countCategories(query);
    }
    else {
      deletedCategories = await deleteDependentService.deleteCategories(query);
    }
    if (!deletedCategories){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCategories });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Categories from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Categories.
 * @return {Object} : number of deactivated documents of Categories. {status, message, data}
 */
const softDeleteManyCategories = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = { isDeleted: true, };
    let updatedCategories = await deleteDependentService.softDeleteCategories(query, updateBody);
    if (!updatedCategories) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCategories });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addCategories,
  bulkInsertCategories,
  findAllCategories,
  getCategories,
  getCategoriesCount,
  updateCategories,
  bulkUpdateCategories,
  partialUpdateCategories,
  softDeleteCategories,
  deleteCategories,
  deleteManyCategories,
  softDeleteManyCategories    
};