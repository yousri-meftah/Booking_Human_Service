/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let Tool_booking = require('../model/Tool_booking');
let Tool = require('../model/Tool');
let Messages = require('../model/Messages');
let Payments = require('../model/Payments');
let Reviews = require('../model/Reviews');
let Booking = require('../model/Booking');
let Provider = require('../model/Provider');
let Services = require('../model/Services');
let Categories = require('../model/Categories');
let USERS = require('../model/USERS');
let UserTokens = require('../model/userTokens');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');

const deleteTool_booking = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Tool_booking,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteTool = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Tool,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteMessages = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Messages,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deletePayments = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Payments,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteReviews = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Reviews,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteBooking = async (filter) =>{
  try {
    let booking = await dbService.findMany(Booking,filter);
    if (booking && booking.length){
      booking = booking.map((obj) => obj.id);

      const PaymentsFilter = { $or: [{ BookingID : { $in : booking } }] };
      const PaymentsCnt = await dbService.deleteMany(Payments,PaymentsFilter);

      const ReviewsFilter = { $or: [{ BookingID : { $in : booking } }] };
      const ReviewsCnt = await dbService.deleteMany(Reviews,ReviewsFilter);

      let deleted  = await dbService.deleteMany(Booking,filter);
      let response = {
        Payments :PaymentsCnt,
        Reviews :ReviewsCnt,
      };
      return response; 
    } else {
      return {  booking : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProvider = async (filter) =>{
  try {
    let provider = await dbService.findMany(Provider,filter);
    if (provider && provider.length){
      provider = provider.map((obj) => obj.id);

      const ReviewsFilter = { $or: [{ ProviderID : { $in : provider } }] };
      const ReviewsCnt = await dbService.deleteMany(Reviews,ReviewsFilter);

      const BookingFilter = { $or: [{ providerID : { $in : provider } }] };
      const BookingCnt = await dbService.deleteMany(Booking,BookingFilter);

      let deleted  = await dbService.deleteMany(Provider,filter);
      let response = {
        Reviews :ReviewsCnt,
        Booking :BookingCnt,
      };
      return response; 
    } else {
      return {  provider : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteServices = async (filter) =>{
  try {
    let services = await dbService.findMany(Services,filter);
    if (services && services.length){
      services = services.map((obj) => obj.id);

      const ProviderFilter = { $or: [{ ServiceID : { $in : services } }] };
      const ProviderCnt = await dbService.deleteMany(Provider,ProviderFilter);

      let deleted  = await dbService.deleteMany(Services,filter);
      let response = { Provider :ProviderCnt, };
      return response; 
    } else {
      return {  services : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteCategories = async (filter) =>{
  try {
    let categories = await dbService.findMany(Categories,filter);
    if (categories && categories.length){
      categories = categories.map((obj) => obj.id);

      const ToolFilter = { $or: [{ CategoryID : { $in : categories } }] };
      const ToolCnt = await dbService.deleteMany(Tool,ToolFilter);

      const ServicesFilter = { $or: [{ CategoryID : { $in : categories } }] };
      const ServicesCnt = await dbService.deleteMany(Services,ServicesFilter);

      let deleted  = await dbService.deleteMany(Categories,filter);
      let response = {
        Tool :ToolCnt,
        Services :ServicesCnt,
      };
      return response; 
    } else {
      return {  categories : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUSERS = async (filter) =>{
  try {
    let users = await dbService.findMany(USERS,filter);
    if (users && users.length){
      users = users.map((obj) => obj.id);

      const ToolFilter = { $or: [{ OwnerID : { $in : users } }] };
      const ToolCnt = await dbService.deleteMany(Tool,ToolFilter);

      const MessagesFilter = { $or: [{ senderID : { $in : users } },{ ReceiverID : { $in : users } }] };
      const MessagesCnt = await dbService.deleteMany(Messages,MessagesFilter);

      const ReviewsFilter = { $or: [{ ClientID : { $in : users } }] };
      const ReviewsCnt = await dbService.deleteMany(Reviews,ReviewsFilter);

      const BookingFilter = { $or: [{ clientID : { $in : users } }] };
      const BookingCnt = await dbService.deleteMany(Booking,BookingFilter);

      const ProviderFilter = { $or: [{ ProviderID : { $in : users } }] };
      const ProviderCnt = await dbService.deleteMany(Provider,ProviderFilter);

      const userTokensFilter = { $or: [{ userId : { $in : users } },{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const userTokensCnt = await dbService.deleteMany(UserTokens,userTokensFilter);

      const roleFilter = { $or: [{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const roleCnt = await dbService.deleteMany(Role,roleFilter);

      const projectRouteFilter = { $or: [{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const projectRouteCnt = await dbService.deleteMany(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { $or: [{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ userId : { $in : users } },{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const userRoleCnt = await dbService.deleteMany(UserRole,userRoleFilter);

      let deleted  = await dbService.deleteMany(USERS,filter);
      let response = {
        Tool :ToolCnt,
        Messages :MessagesCnt,
        Reviews :ReviewsCnt,
        Booking :BookingCnt,
        Provider :ProviderCnt,
        userTokens :userTokensCnt,
        role :roleCnt,
        projectRoute :projectRouteCnt,
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response; 
    } else {
      return {  users : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserTokens = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserTokens,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await dbService.findMany(Role,filter);
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const userRoleCnt = await dbService.deleteMany(UserRole,userRoleFilter);

      let deleted  = await dbService.deleteMany(Role,filter);
      let response = {
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter);
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId : { $in : projectroute } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      let deleted  = await dbService.deleteMany(ProjectRoute,filter);
      let response = { routeRole :routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(RouteRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const countTool_booking = async (filter) =>{
  try {
    const Tool_bookingCnt =  await dbService.count(Tool_booking,filter);
    return { Tool_booking : Tool_bookingCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countTool = async (filter) =>{
  try {
    const ToolCnt =  await dbService.count(Tool,filter);
    return { Tool : ToolCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countMessages = async (filter) =>{
  try {
    const MessagesCnt =  await dbService.count(Messages,filter);
    return { Messages : MessagesCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countPayments = async (filter) =>{
  try {
    const PaymentsCnt =  await dbService.count(Payments,filter);
    return { Payments : PaymentsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countReviews = async (filter) =>{
  try {
    const ReviewsCnt =  await dbService.count(Reviews,filter);
    return { Reviews : ReviewsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countBooking = async (filter) =>{
  try {
    let booking = await dbService.findMany(Booking,filter);
    if (booking && booking.length){
      booking = booking.map((obj) => obj.id);

      const PaymentsFilter = { $or: [{ BookingID : { $in : booking } }] };
      const PaymentsCnt =  await dbService.count(Payments,PaymentsFilter);

      const ReviewsFilter = { $or: [{ BookingID : { $in : booking } }] };
      const ReviewsCnt =  await dbService.count(Reviews,ReviewsFilter);

      let response = {
        Payments : PaymentsCnt,
        Reviews : ReviewsCnt,
      };
      return response; 
    } else {
      return {  booking : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProvider = async (filter) =>{
  try {
    let provider = await dbService.findMany(Provider,filter);
    if (provider && provider.length){
      provider = provider.map((obj) => obj.id);

      const ReviewsFilter = { $or: [{ ProviderID : { $in : provider } }] };
      const ReviewsCnt =  await dbService.count(Reviews,ReviewsFilter);

      const BookingFilter = { $or: [{ providerID : { $in : provider } }] };
      const BookingCnt =  await dbService.count(Booking,BookingFilter);

      let response = {
        Reviews : ReviewsCnt,
        Booking : BookingCnt,
      };
      return response; 
    } else {
      return {  provider : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countServices = async (filter) =>{
  try {
    let services = await dbService.findMany(Services,filter);
    if (services && services.length){
      services = services.map((obj) => obj.id);

      const ProviderFilter = { $or: [{ ServiceID : { $in : services } }] };
      const ProviderCnt =  await dbService.count(Provider,ProviderFilter);

      let response = { Provider : ProviderCnt, };
      return response; 
    } else {
      return {  services : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countCategories = async (filter) =>{
  try {
    let categories = await dbService.findMany(Categories,filter);
    if (categories && categories.length){
      categories = categories.map((obj) => obj.id);

      const ToolFilter = { $or: [{ CategoryID : { $in : categories } }] };
      const ToolCnt =  await dbService.count(Tool,ToolFilter);

      const ServicesFilter = { $or: [{ CategoryID : { $in : categories } }] };
      const ServicesCnt =  await dbService.count(Services,ServicesFilter);

      let response = {
        Tool : ToolCnt,
        Services : ServicesCnt,
      };
      return response; 
    } else {
      return {  categories : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUSERS = async (filter) =>{
  try {
    let users = await dbService.findMany(USERS,filter);
    if (users && users.length){
      users = users.map((obj) => obj.id);

      const ToolFilter = { $or: [{ OwnerID : { $in : users } }] };
      const ToolCnt =  await dbService.count(Tool,ToolFilter);

      const MessagesFilter = { $or: [{ senderID : { $in : users } },{ ReceiverID : { $in : users } }] };
      const MessagesCnt =  await dbService.count(Messages,MessagesFilter);

      const ReviewsFilter = { $or: [{ ClientID : { $in : users } }] };
      const ReviewsCnt =  await dbService.count(Reviews,ReviewsFilter);

      const BookingFilter = { $or: [{ clientID : { $in : users } }] };
      const BookingCnt =  await dbService.count(Booking,BookingFilter);

      const ProviderFilter = { $or: [{ ProviderID : { $in : users } }] };
      const ProviderCnt =  await dbService.count(Provider,ProviderFilter);

      const userTokensFilter = { $or: [{ userId : { $in : users } },{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const userTokensCnt =  await dbService.count(UserTokens,userTokensFilter);

      const roleFilter = { $or: [{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const roleCnt =  await dbService.count(Role,roleFilter);

      const projectRouteFilter = { $or: [{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const projectRouteCnt =  await dbService.count(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { $or: [{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ userId : { $in : users } },{ addedBy : { $in : users } },{ updatedBy : { $in : users } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        Tool : ToolCnt,
        Messages : MessagesCnt,
        Reviews : ReviewsCnt,
        Booking : BookingCnt,
        Provider : ProviderCnt,
        userTokens : userTokensCnt,
        role : roleCnt,
        projectRoute : projectRouteCnt,
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  users : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserTokens = async (filter) =>{
  try {
    const userTokensCnt =  await dbService.count(UserTokens,filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await dbService.findMany(Role,filter);
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter);
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId : { $in : projectroute } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await dbService.count(RouteRole,filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await dbService.count(UserRole,filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteTool_booking = async (filter,updateBody) =>{  
  try {
    const Tool_bookingCnt =  await dbService.updateMany(Tool_booking,filter);
    return { Tool_booking : Tool_bookingCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteTool = async (filter,updateBody) =>{  
  try {
    const ToolCnt =  await dbService.updateMany(Tool,filter);
    return { Tool : ToolCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteMessages = async (filter,updateBody) =>{  
  try {
    const MessagesCnt =  await dbService.updateMany(Messages,filter);
    return { Messages : MessagesCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeletePayments = async (filter,updateBody) =>{  
  try {
    const PaymentsCnt =  await dbService.updateMany(Payments,filter);
    return { Payments : PaymentsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteReviews = async (filter,updateBody) =>{  
  try {
    const ReviewsCnt =  await dbService.updateMany(Reviews,filter);
    return { Reviews : ReviewsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteBooking = async (filter,updateBody) =>{  
  try {
    let booking = await dbService.findMany(Booking,filter, { id:1 });
    if (booking.length){
      booking = booking.map((obj) => obj.id);

      const PaymentsFilter = { '$or': [{ BookingID : { '$in' : booking } }] };
      const PaymentsCnt = await dbService.updateMany(Payments,PaymentsFilter,updateBody);

      const ReviewsFilter = { '$or': [{ BookingID : { '$in' : booking } }] };
      const ReviewsCnt = await dbService.updateMany(Reviews,ReviewsFilter,updateBody);
      let updated = await dbService.updateMany(Booking,filter,updateBody);

      let response = {
        Payments :PaymentsCnt,
        Reviews :ReviewsCnt,
      };
      return response;
    } else {
      return {  booking : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProvider = async (filter,updateBody) =>{  
  try {
    let provider = await dbService.findMany(Provider,filter, { id:1 });
    if (provider.length){
      provider = provider.map((obj) => obj.id);

      const ReviewsFilter = { '$or': [{ ProviderID : { '$in' : provider } }] };
      const ReviewsCnt = await dbService.updateMany(Reviews,ReviewsFilter,updateBody);

      const BookingFilter = { '$or': [{ providerID : { '$in' : provider } }] };
      const BookingCnt = await dbService.updateMany(Booking,BookingFilter,updateBody);
      let updated = await dbService.updateMany(Provider,filter,updateBody);

      let response = {
        Reviews :ReviewsCnt,
        Booking :BookingCnt,
      };
      return response;
    } else {
      return {  provider : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteServices = async (filter,updateBody) =>{  
  try {
    let services = await dbService.findMany(Services,filter, { id:1 });
    if (services.length){
      services = services.map((obj) => obj.id);

      const ProviderFilter = { '$or': [{ ServiceID : { '$in' : services } }] };
      const ProviderCnt = await dbService.updateMany(Provider,ProviderFilter,updateBody);
      let updated = await dbService.updateMany(Services,filter,updateBody);

      let response = { Provider :ProviderCnt, };
      return response;
    } else {
      return {  services : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteCategories = async (filter,updateBody) =>{  
  try {
    let categories = await dbService.findMany(Categories,filter, { id:1 });
    if (categories.length){
      categories = categories.map((obj) => obj.id);

      const ToolFilter = { '$or': [{ CategoryID : { '$in' : categories } }] };
      const ToolCnt = await dbService.updateMany(Tool,ToolFilter,updateBody);

      const ServicesFilter = { '$or': [{ CategoryID : { '$in' : categories } }] };
      const ServicesCnt = await dbService.updateMany(Services,ServicesFilter,updateBody);
      let updated = await dbService.updateMany(Categories,filter,updateBody);

      let response = {
        Tool :ToolCnt,
        Services :ServicesCnt,
      };
      return response;
    } else {
      return {  categories : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUSERS = async (filter,updateBody) =>{  
  try {
    let users = await dbService.findMany(USERS,filter, { id:1 });
    if (users.length){
      users = users.map((obj) => obj.id);

      const ToolFilter = { '$or': [{ OwnerID : { '$in' : users } }] };
      const ToolCnt = await dbService.updateMany(Tool,ToolFilter,updateBody);

      const MessagesFilter = { '$or': [{ senderID : { '$in' : users } },{ ReceiverID : { '$in' : users } }] };
      const MessagesCnt = await dbService.updateMany(Messages,MessagesFilter,updateBody);

      const ReviewsFilter = { '$or': [{ ClientID : { '$in' : users } }] };
      const ReviewsCnt = await dbService.updateMany(Reviews,ReviewsFilter,updateBody);

      const BookingFilter = { '$or': [{ clientID : { '$in' : users } }] };
      const BookingCnt = await dbService.updateMany(Booking,BookingFilter,updateBody);

      const ProviderFilter = { '$or': [{ ProviderID : { '$in' : users } }] };
      const ProviderCnt = await dbService.updateMany(Provider,ProviderFilter,updateBody);

      const userTokensFilter = { '$or': [{ userId : { '$in' : users } },{ addedBy : { '$in' : users } },{ updatedBy : { '$in' : users } }] };
      const userTokensCnt = await dbService.updateMany(UserTokens,userTokensFilter,updateBody);

      const roleFilter = { '$or': [{ addedBy : { '$in' : users } },{ updatedBy : { '$in' : users } }] };
      const roleCnt = await dbService.updateMany(Role,roleFilter,updateBody);

      const projectRouteFilter = { '$or': [{ addedBy : { '$in' : users } },{ updatedBy : { '$in' : users } }] };
      const projectRouteCnt = await dbService.updateMany(ProjectRoute,projectRouteFilter,updateBody);

      const routeRoleFilter = { '$or': [{ addedBy : { '$in' : users } },{ updatedBy : { '$in' : users } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);

      const userRoleFilter = { '$or': [{ userId : { '$in' : users } },{ addedBy : { '$in' : users } },{ updatedBy : { '$in' : users } }] };
      const userRoleCnt = await dbService.updateMany(UserRole,userRoleFilter,updateBody);
      let updated = await dbService.updateMany(USERS,filter,updateBody);

      let response = {
        Tool :ToolCnt,
        Messages :MessagesCnt,
        Reviews :ReviewsCnt,
        Booking :BookingCnt,
        Provider :ProviderCnt,
        userTokens :userTokensCnt,
        role :roleCnt,
        projectRoute :projectRouteCnt,
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response;
    } else {
      return {  users : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserTokens = async (filter,updateBody) =>{  
  try {
    const userTokensCnt =  await dbService.updateMany(UserTokens,filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody) =>{  
  try {
    let role = await dbService.findMany(Role,filter, { id:1 });
    if (role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);

      const userRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const userRoleCnt = await dbService.updateMany(UserRole,userRoleFilter,updateBody);
      let updated = await dbService.updateMany(Role,filter,updateBody);

      let response = {
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response;
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody) =>{  
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter, { id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { '$or': [{ routeId : { '$in' : projectroute } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);
      let updated = await dbService.updateMany(ProjectRoute,filter,updateBody);

      let response = { routeRole :routeRoleCnt, };
      return response;
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody) =>{  
  try {
    const routeRoleCnt =  await dbService.updateMany(RouteRole,filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody) =>{  
  try {
    const userRoleCnt =  await dbService.updateMany(UserRole,filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteTool_booking,
  deleteTool,
  deleteMessages,
  deletePayments,
  deleteReviews,
  deleteBooking,
  deleteProvider,
  deleteServices,
  deleteCategories,
  deleteUSERS,
  deleteUserTokens,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countTool_booking,
  countTool,
  countMessages,
  countPayments,
  countReviews,
  countBooking,
  countProvider,
  countServices,
  countCategories,
  countUSERS,
  countUserTokens,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteTool_booking,
  softDeleteTool,
  softDeleteMessages,
  softDeletePayments,
  softDeleteReviews,
  softDeleteBooking,
  softDeleteProvider,
  softDeleteServices,
  softDeleteCategories,
  softDeleteUSERS,
  softDeleteUserTokens,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
