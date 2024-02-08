/**
 * ProviderValidation.js
 * @description :: validate each post and put request as per Provider model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Provider */
exports.schemaKeys = joi.object({
  ProviderID: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  ServiceID: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  Experience: joi.number().integer().default(0).allow(0),
  RatingsAverage: joi.number().integer().default(0).allow(0),
  ReviewsCount: joi.number().integer().default(null).allow(0),
  Availability: joi.boolean().default(true),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Provider for updation */
exports.updateSchemaKeys = joi.object({
  ProviderID: joi.string().regex(/^[0-9a-fA-F]{24}$/).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  ServiceID: joi.string().regex(/^[0-9a-fA-F]{24}$/).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  Experience: joi.number().integer().default(0).allow(0),
  RatingsAverage: joi.number().integer().default(0).allow(0),
  ReviewsCount: joi.number().integer().default(null).allow(0),
  Availability: joi.boolean().default(true),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Provider for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      ProviderID: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      ServiceID: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      Experience: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      RatingsAverage: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      ReviewsCount: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      Availability: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
