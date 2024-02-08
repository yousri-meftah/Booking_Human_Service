/**
 * MessagesValidation.js
 * @description :: validate each post and put request as per Messages model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Messages */
exports.schemaKeys = joi.object({
  senderID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  ReceiverID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  Content: joi.string().allow(null).allow(''),
  SentAt: joi.date().options({ convert: true }).allow(null).allow(''),
  ReadStatus: joi.boolean().default(false),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Messages for updation */
exports.updateSchemaKeys = joi.object({
  senderID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  ReceiverID: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  Content: joi.string().allow(null).allow(''),
  SentAt: joi.date().options({ convert: true }).allow(null).allow(''),
  ReadStatus: joi.boolean().default(false),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Messages for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      senderID: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      ReceiverID: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      Content: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      SentAt: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      ReadStatus: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
