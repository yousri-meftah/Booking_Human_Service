/**
 * ReviewsValidation.js
 * @description :: validate each post and put request as per Reviews model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Reviews */
exports.schemaKeys = joi.object({
  BookingID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  ClientID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  ProviderID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  Rating: joi.number().integer().default(null).allow(0),
  Comment: joi.string().default(null).allow(null).allow(''),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Reviews for updation */
exports.updateSchemaKeys = joi.object({
  BookingID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  ClientID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  ProviderID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  Rating: joi.number().integer().default(null).allow(0),
  Comment: joi.string().default(null).allow(null).allow(''),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Reviews for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      BookingID: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      ClientID: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      ProviderID: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      Rating: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      Comment: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
