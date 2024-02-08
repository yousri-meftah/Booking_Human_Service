/**
 * Tool_bookingValidation.js
 * @description :: validate each post and put request as per Tool_booking model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');
const { convertObjectToEnum } = require('../common');  
const rolesDefault = require('../../constants/roles');    

/** validation keys and properties of Tool_booking */
exports.schemaKeys = joi.object({
  ToolID: joi.string().allow(null).allow(''),
  ClientID: joi.string().allow(null).allow(''),
  BookingDate: joi.string().allow(null).allow(''),
  ReturnDate: joi.string().allow(null).allow(''),
  Status: joi.string().allow(null).allow(''),
  CreatedAt: joi.string().allow(null).allow(''),
  UpdatedAt: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Tool_booking for updation */
exports.updateSchemaKeys = joi.object({
  ToolID: joi.string().allow(null).allow(''),
  ClientID: joi.string().allow(null).allow(''),
  BookingDate: joi.string().allow(null).allow(''),
  ReturnDate: joi.string().allow(null).allow(''),
  Status: joi.string().allow(null).allow(''),
  CreatedAt: joi.string().allow(null).allow(''),
  UpdatedAt: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Tool_booking for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      ToolID: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      ClientID: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      BookingDate: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      ReturnDate: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      CreatedAt: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      UpdatedAt: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
