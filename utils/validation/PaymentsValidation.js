/**
 * PaymentsValidation.js
 * @description :: validate each post and put request as per Payments model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');
const { convertObjectToEnum } = require('../common');  
const rolesDefault = require('../../constants/roles');    

/** validation keys and properties of Payments */
exports.schemaKeys = joi.object({
  BookingID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  Amount: joi.number().integer().allow(0),
  Status: joi.string().default(rolesDefault.status['Pending']).allow(null).allow(''),
  PaymentMethod: joi.string().allow(null).allow(''),
  TransactionDate: joi.date().options({ convert: true }).allow(null).allow(''),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Payments for updation */
exports.updateSchemaKeys = joi.object({
  BookingID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  Amount: joi.number().integer().allow(0),
  Status: joi.string().default(rolesDefault.status['Pending']).allow(null).allow(''),
  PaymentMethod: joi.string().allow(null).allow(''),
  TransactionDate: joi.date().options({ convert: true }).allow(null).allow(''),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Payments for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      BookingID: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      Amount: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      PaymentMethod: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      TransactionDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
