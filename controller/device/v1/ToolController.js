/**
 * ToolController.js
 * @description : exports action methods for Tool.
 */

const Tool = require('../../../model/Tool');
const ToolSchemaKey = require('../../../utils/validation/ToolValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Tool in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Tool. {status, message, data}
 */ 
const addTool = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      ToolSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Tool(dataToCreate);
    let createdTool = await dbService.create(Tool,dataToCreate);
    return res.success({ data : createdTool });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Tool in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Tools. {status, message, data}
 */
const bulkInsertTool = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    let createdTools = await dbService.create(Tool,dataToCreate);
    createdTools = { count: createdTools ? createdTools.length : 0 };
    return res.success({ data:{ count:createdTools.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Tool from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Tool(s). {status, message, data}
 */
const findAllTool = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ToolSchemaKey.findFilterKeys,
      Tool.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Tool, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundTools = await dbService.paginate( Tool,query,options);
    if (!foundTools || !foundTools.data || !foundTools.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundTools });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Tool from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Tool. {status, message, data}
 */
const getTool = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundTool = await dbService.findOne(Tool,query, options);
    if (!foundTool){
      return res.recordNotFound();
    }
    return res.success({ data :foundTool });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Tool.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getToolCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ToolSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedTool = await dbService.count(Tool,where);
    return res.success({ data : { count: countedTool } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Tool with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Tool.
 * @return {Object} : updated Tool. {status, message, data}
 */
const updateTool = async (req,res) => {
  try {
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ToolSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedTool = await dbService.updateOne(Tool,query,dataToUpdate);
    if (!updatedTool){
      return res.recordNotFound();
    }
    return res.success({ data :updatedTool });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Tool with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Tools.
 * @return {Object} : updated Tools. {status, message, data}
 */
const bulkUpdateTool = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { ...req.body.data, };
    }
    let updatedTool = await dbService.updateMany(Tool,filter,dataToUpdate);
    if (!updatedTool){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedTool } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Tool with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Tool.
 * @return {obj} : updated Tool. {status, message, data}
 */
const partialUpdateTool = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let dataToUpdate = { ...req.body, };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ToolSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedTool = await dbService.updateOne(Tool, query, dataToUpdate);
    if (!updatedTool) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedTool });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Tool from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Tool.
 * @return {Object} : deactivated Tool. {status, message, data}
 */
const softDeleteTool = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = { isDeleted: true, };
    let updatedTool = await dbService.updateOne(Tool, query, updateBody);
    if (!updatedTool){
      return res.recordNotFound();
    }
    return res.success({ data:updatedTool });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Tool from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Tool. {status, message, data}
 */
const deleteTool = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedTool = await dbService.deleteOne(Tool, query);
    if (!deletedTool){
      return res.recordNotFound();
    }
    return res.success({ data :deletedTool });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Tool in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyTool = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedTool = await dbService.deleteMany(Tool,query);
    if (!deletedTool){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedTool } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Tool from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Tool.
 * @return {Object} : number of deactivated documents of Tool. {status, message, data}
 */
const softDeleteManyTool = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = { isDeleted: true, };
    let updatedTool = await dbService.updateMany(Tool,query, updateBody);
    if (!updatedTool) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedTool } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addTool,
  bulkInsertTool,
  findAllTool,
  getTool,
  getToolCount,
  updateTool,
  bulkUpdateTool,
  partialUpdateTool,
  softDeleteTool,
  deleteTool,
  deleteManyTool,
  softDeleteManyTool    
};