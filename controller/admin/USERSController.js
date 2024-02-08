/**
 * USERSController.js
 * @description : exports action methods for USERS.
 */

const USERS = require('../../model/USERS');
const USERSSchemaKey = require('../../utils/validation/USERSValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const auth = require('../../services/auth');
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');

/**
 * @description : get information of logged-in User.
 * @param {Object} req : authentication token is required
 * @param {Object} res : Logged-in user information
 * @return {Object} : Logged-in user information {status, message, data}
 */
const getLoggedInUserInfo = async (req, res) => {
  try {
    const query = {
      _id: req.user.id,
      isDeleted: false 
    };
    query.isActive = true;
    let foundUser = await dbService.findOne(USERS, query);
    if (!foundUser) {
      return res.recordNotFound();
    }
    return res.success({ data: foundUser });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
   
/**
 * @description : create document of USERS in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created USERS. {status, message, data}
 */ 
const addUSERS = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      USERSSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new USERS(dataToCreate);

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(USERS,[ 'email' ],dataToCreate,'INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdUSERS = await dbService.create(USERS,dataToCreate);
    return res.success({ data : createdUSERS });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of USERS in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created USERSs. {status, message, data}
 */
const bulkInsertUSERS = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(USERS,[ 'email' ],dataToCreate,'BULK_INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdUSERSs = await dbService.create(USERS,dataToCreate);
    createdUSERSs = { count: createdUSERSs ? createdUSERSs.length : 0 };
    return res.success({ data:{ count:createdUSERSs.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of USERS from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found USERS(s). {status, message, data}
 */
const findAllUSERS = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      USERSSchemaKey.findFilterKeys,
      USERS.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    query._id = { $ne: req.user.id };
    if (req.body && req.body.query && req.body.query._id) {
      query._id.$in = [req.body.query._id];
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(USERS, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundUSERSs = await dbService.paginate( USERS,query,options);
    if (!foundUSERSs || !foundUSERSs.data || !foundUSERSs.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundUSERSs });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of USERS from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found USERS. {status, message, data}
 */
const getUSERS = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundUSERS = await dbService.findOne(USERS,query, options);
    if (!foundUSERS){
      return res.recordNotFound();
    }
    return res.success({ data :foundUSERS });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of USERS.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getUSERSCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      USERSSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedUSERS = await dbService.count(USERS,where);
    return res.success({ data : { count: countedUSERS } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of USERS with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated USERS.
 * @return {Object} : updated USERS. {status, message, data}
 */
const updateUSERS = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      USERSSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = {
      _id: {
        $eq: req.params.id,
        $ne: req.user.id
      }
    };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(USERS,[ 'email' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedUSERS = await dbService.updateOne(USERS,query,dataToUpdate);
    if (!updatedUSERS){
      return res.recordNotFound();
    }
    return res.success({ data :updatedUSERS });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of USERS with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated USERSs.
 * @return {Object} : updated USERSs. {status, message, data}
 */
const bulkUpdateUSERS = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(USERS,[ 'email' ],dataToUpdate,'BULK_UPDATE', filter);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedUSERS = await dbService.updateMany(USERS,filter,dataToUpdate);
    if (!updatedUSERS){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedUSERS } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of USERS with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated USERS.
 * @return {obj} : updated USERS. {status, message, data}
 */
const partialUpdateUSERS = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      USERSSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = {
      _id: {
        $eq: req.params.id,
        $ne: req.user.id
      }
    };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(USERS,[ 'email' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedUSERS = await dbService.updateOne(USERS, query, dataToUpdate);
    if (!updatedUSERS) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedUSERS });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of USERS from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of USERS.
 * @return {Object} : deactivated USERS. {status, message, data}
 */
const softDeleteUSERS = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = {
      _id: {
        $eq: req.params.id,
        $ne: req.user.id
      }
    };
    const updateBody = { isDeleted: true, };
    let updatedUSERS = await deleteDependentService.softDeleteUSERS(query, updateBody);
    if (!updatedUSERS){
      return res.recordNotFound();
    }
    return res.success({ data:updatedUSERS });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of USERS from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted USERS. {status, message, data}
 */
const deleteUSERS = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = {
      _id: {
        $eq: req.params.id,
        $ne: req.user.id
      }
    };
    let deletedUSERS;
    if (req.body.isWarning) { 
      deletedUSERS = await deleteDependentService.countUSERS(query);
    } else {
      deletedUSERS = await deleteDependentService.deleteUSERS(query);
    }
    if (!deletedUSERS){
      return res.recordNotFound();
    }
    return res.success({ data :deletedUSERS });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of USERS in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyUSERS = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = {
      _id: {
        $in: ids,
        $ne: req.user.id
      }
    };
    let deletedUSERS;
    if (req.body.isWarning) {
      deletedUSERS = await deleteDependentService.countUSERS(query);
    }
    else {
      deletedUSERS = await deleteDependentService.deleteUSERS(query);
    }
    if (!deletedUSERS){
      return res.recordNotFound();
    }
    return res.success({ data :deletedUSERS });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of USERS from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of USERS.
 * @return {Object} : number of deactivated documents of USERS. {status, message, data}
 */
const softDeleteManyUSERS = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = {
      _id: {
        $in: ids,
        $ne: req.user.id
      }
    };
    const updateBody = { isDeleted: true, };
    let updatedUSERS = await deleteDependentService.softDeleteUSERS(query, updateBody);
    if (!updatedUSERS) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedUSERS });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : change password
 * @param {Object} req : request including user credentials.
 * @param {Object} res : response contains updated user document.
 * @return {Object} : updated user document {status, message, data}
 */
const changePassword = async (req, res) => {
  try {
    let params = req.body;
    if (!req.user.id || !params.newPassword || !params.oldPassword) {
      return res.validationError({ message : 'Please Provide userId, new Password and Old password' });
    }
    let result = await auth.changePassword({
      ...params,
      userId:req.user.id
    });
    if (result.flag){
      return res.failure({ message :result.data });
    }
    return res.success({ message : result.data });
  } catch (error) {
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update user profile.
 * @param {Object} req : request including user profile details to update in request body.
 * @param {Object} res : updated user document.
 * @return {Object} : updated user document. {status, message, data}
 */
const updateProfile = async (req, res) => {
  try {
    let data = req.body;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      USERSSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    delete data.password;
    delete data.createdAt;
    delete data.updatedAt;
    if (data.id) delete data.id;
    let result = await dbService.updateOne(USERS,{ _id:req.user.id },data,{ new:true });
    if (!result){
      return res.recordNotFound();
    }            
    return res.success({ data :result });
  } catch (error){
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    if (error.code && error.code === 11000){
      return res.validationError({ message : 'Data duplication found.' });
    }
    return res.internalServerError({ message:error.message });
  }
};
module.exports = {
  getLoggedInUserInfo,
  addUSERS,
  bulkInsertUSERS,
  findAllUSERS,
  getUSERS,
  getUSERSCount,
  updateUSERS,
  bulkUpdateUSERS,
  partialUpdateUSERS,
  softDeleteUSERS,
  deleteUSERS,
  deleteManyUSERS,
  softDeleteManyUSERS,
  changePassword,
  updateProfile    
};