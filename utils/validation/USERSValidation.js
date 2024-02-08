/**
 * USERSValidation.js
 * @description :: validate each post and put request as per USERS model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');
const rolesDefault = require('../../constants/roles');    
const authConstantDefault = require('../../constants/authConstant');    
const { USER_TYPES } = require('../../constants/authConstant');
const { convertObjectToEnum } = require('../common');   

/** validation keys and properties of USERS */
exports.schemaKeys = joi.object({
  username: joi.string().required(),
  password: joi.string().allow(null).allow(''),
  email: joi.string().required(),
  contact_info: joi.string().required(),
  type: joi.string().allow(null).allow(''),
  verifed: joi.boolean().default(false),
  userType: joi.number().allow(0),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  Latitude: joi.string().required(),
  Longitude: joi.string().required(),
  CommissionRate: joi.number().integer().max(100).allow(0),
  DiscountRate: joi.number().integer().max(100).allow(0),
  DiscountUntil: joi.date().options({ convert: true }).allow(null).allow(''),
  mobileNo: joi.string().allow(null).allow(''),
  resetPasswordLink: joi.object({
    code:joi.string(),
    expireTime:joi.date().options({ convert: true })
  }),
  ssoAuth: joi.object({
    googleId:joi.string(),
    facebookId:joi.string()
  })
}).unknown(true);

/** validation keys and properties of USERS for updation */
exports.updateSchemaKeys = joi.object({
  username: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  password: joi.string().allow(null).allow(''),
  email: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  contact_info: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  type: joi.string().allow(null).allow(''),
  verifed: joi.boolean().default(false),
  userType: joi.number().allow(0),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  Latitude: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  Longitude: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  CommissionRate: joi.number().integer().max(100).allow(0),
  DiscountRate: joi.number().integer().max(100).allow(0),
  DiscountUntil: joi.date().options({ convert: true }).allow(null).allow(''),
  mobileNo: joi.string().allow(null).allow(''),
  resetPasswordLink: joi.object({
    code:joi.string(),
    expireTime:joi.date().options({ convert: true })
  }),
  ssoAuth: joi.object({
    googleId:joi.string(),
    facebookId:joi.string()
  }),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of USERS for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      username: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      password: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      email: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      contact_info: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      verifed: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      Latitude: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      Longitude: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      CommissionRate: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      DiscountRate: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      DiscountUntil: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      mobileNo: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      ssoAuth: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
