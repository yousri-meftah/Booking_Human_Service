/**
 * authController.js
 * @description :: exports authentication methods
 */

const USERS = require('../../../model/USERS');
const dbService = require('../../../utils/dbService');
const userTokens = require('../../../model/userTokens');
const dayjs = require('dayjs');
const USERSSchemaKey = require('../../../utils/validation/USERSValidation');
const validation = require('../../../utils/validateRequest');
const authConstant = require('../../../constants/authConstant');
const authService =  require('../../../services/auth');
const common = require('../../../utils/common');

/**
 * @description : user registration 
 * @param {Object} req : request for register
 * @param {Object} res : response for register
 * @return {Object} : response for register {status, message, data}
 */
const register = async (req,res) =>{
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      USERSSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message :  `Invalid values in parameters, ${validateRequest.message}` });
    } 
    let isEmptyPassword = false;
    if (!req.body.password){
      isEmptyPassword = true;
      req.body.password = Math.random().toString(36).slice(2);
    }
    const data = new USERS({
      ...req.body,
      userType: authConstant.USER_TYPES.User
    });

    let checkUniqueFields = await common.checkUniqueFieldsInDatabase(USERS,[ 'email', 'username' ],data,'REGISTER');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Unique ${checkUniqueFields.field} are allowed.` });
    }

    const result = await dbService.create(USERS,data);
    if (isEmptyPassword && req.body.email){
      await authService.sendPasswordByEmail({
        email: req.body.email,
        password: req.body.password
      });
    }
    if (isEmptyPassword && req.body.mobileNo){
      await authService.sendPasswordBySMS({
        mobileNo: req.body.mobileNo,
        password: req.body.password
      });
    }
    return res.success({ data :result });
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }  
};

/**
 * @description : login with username and password
 * @param {Object} req : request for login 
 * @param {Object} res : response for login
 * @return {Object} : response for login {status, message, data}
 */
const login = async (req,res)=>{
  try {
    let {
      username,password
    } = req.body;
    if (!username || !password){
      return res.badRequest({ message : 'Insufficient request parameters! username and password is required.' });
    }
    let roleAccess = false;
    if (req.body.includeRoleAccess){
      roleAccess = req.body.includeRoleAccess;
    }
    let result = await authService.loginUser(username, password, authConstant.PLATFORM.DEVICE, roleAccess);
    if (result.flag){
      return res.badRequest({ message :result.data });
    }
    return res.success({
      data: result.data,
      message:'Login Successful' 
    });
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : send email or sms to user with OTP on forgot password
 * @param {Object} req : request for forgotPassword
 * @param {Object} res : response for forgotPassword
 * @return {Object} : response for forgotPassword {status, message, data}
 */ 
const forgotPassword = async (req,res) => {
  const params = req.body;
  try {
    if (!params.email) {
      return res.badRequest({ message : 'Insufficient request parameters! email is required.' });
    }
    let where = { email: params.email };
    where.isActive = true;where.isDeleted = false;            params.email = params.email.toString().toLowerCase();
    let found = await dbService.findOne(USERS,where);
    if (!found) {
      return res.recordNotFound();
    }
    let {
      resultOfEmail,resultOfSMS
    } = await authService.sendResetPasswordNotification(found);
    if (resultOfEmail && resultOfSMS){
      return res.success({ message :'otp successfully send.' });
    } else if (resultOfEmail && !resultOfSMS) {
      return res.success({ message : 'otp successfully send to your email.' });
    } else if (!resultOfEmail && resultOfSMS) { 
      return res.success({ message : 'otp successfully send to your mobile number.' });
    } else {
      return res.failure({ message :'otp can not be sent due to some issue try again later' });
    }
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : validate OTP
 * @param {Object} req : request for validateResetPasswordOtp
 * @param {Object} res : response for validateResetPasswordOtp
 * @return {Object} : response for validateResetPasswordOtp  {status, message, data}
 */
const validateResetPasswordOtp = async (req,res) =>{
  const params = req.body;
  try {
    if (!params.otp) {
      return res.badRequest({ message : 'Insufficient request parameters! otp is required.' });
    }
    const where = { 
      'resetPasswordLink.code': params.otp,
      isActive: true,
      isDeleted: false,            
    };
    let found = await dbService.findOne(USERS, where);
    if (!found || !found.resetPasswordLink.expireTime) {
      return res.failure({ message :'Invalid OTP' });
    }
    if (dayjs(new Date()).isAfter(dayjs(found.resetPasswordLink.expireTime))) {
      return res.failure( { message :'Your reset password link is expired or invalid' });
    }
    await dbService.updateOne(USERS, found.id, { resetPasswordLink: {} });
    return res.success({ message :'OTP verified' });
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};
    
/**
 * @description : reset password with code and new password
 * @param {Object} req : request for resetPassword
 * @param {Object} res : response for resetPassword
 * @return {Object} : response for resetPassword {status, message, data}
 */ 
const resetPassword = async (req,res) => {
  const params = req.body;
  try {
    if (!params.code || !params.newPassword) {
      return res.badRequest({ message : 'Insufficient request parameters! code and newPassword is required.' });
    }
    const where = { 
      'resetPasswordLink.code': params.code,
      isActive: true,
      isDeleted: false,            
    };
    let found = await dbService.findOne(USERS, where);
    if (!found || !found.resetPasswordLink.expireTime) {
      return res.failure({ message :'Invalid Code' });
    }
    if (dayjs(new Date()).isAfter(dayjs(found.resetPasswordLink.expireTime))) {
      return res.failure({ message :'Your reset password link is expired or invalid' });
    }
    let response = await authService.resetPassword(found, params.newPassword);
    if (!response || response.flag){
      return res.failure({ message: response.data });
    }
    return res.success({ message :response.data });
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : logout user
 * @param {Object} req : request for logout
 * @param {Object} res : response for logout
 * @return {Object} : response for logout {status, message, data}
 */
const logout = async (req, res) => {
  try {
    let userToken = await dbService.findOne(userTokens, {
      token: (req.headers.authorization).replace('Bearer ', '') ,
      userId:req.user.id
    });
    let updatedDocument = { isTokenExpired: true };
    await dbService.updateOne(userTokens,{ _id:userToken.id }, updatedDocument);
    return res.success({ message :'Logged Out Successfully' });
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  validateResetPasswordOtp,
  resetPassword,
  logout
};