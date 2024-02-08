/**
 * seeder.js
 * @description :: functions that seeds mock data to run the application
 */

const bcrypt = require('bcrypt');
const USERS = require('../model/USERS');
const authConstant = require('../constants/authConstant');
const Role = require('../model/role');
const ProjectRoute = require('../model/projectRoute');
const RouteRole = require('../model/routeRole');
const UserRole = require('../model/userRole');
const { replaceAll } = require('../utils/common');
const dbService = require('../utils/dbService');

/* seeds default users */
async function seedUser () {
  try {
    let userToBeInserted = {};
    userToBeInserted = {
      'password':'88ChEV2MTJkkCGv',
      'isDeleted':false,
      'username':'Olin_Adams48',
      'email':'Thomas_Rath74@yahoo.com',
      'contact_info':'Associate',
      'type':'synthesizing',
      'Latitude':'initiatives',
      'Longitude':'monitor',
      'CommissionRate':389,
      'DiscountRate':940,
      'isActive':true,
      'userType':authConstant.USER_TYPES.User
    };
    userToBeInserted.password = await  bcrypt.hash(userToBeInserted.password, 8);
    let user = await dbService.updateOne(USERS, { 'username':'Olin_Adams48' }, userToBeInserted,  { upsert: true });
    userToBeInserted = {
      'password':'TZWRBENRHM7boe7',
      'isDeleted':false,
      'username':'Luz.Robel70',
      'email':'Justus.Corkery98@gmail.com',
      'contact_info':'Quality',
      'type':'Operations',
      'Latitude':'Wooden',
      'Longitude':'Security',
      'CommissionRate':578,
      'DiscountRate':100,
      'isActive':true,
      'userType':authConstant.USER_TYPES.Admin
    };
    userToBeInserted.password = await  bcrypt.hash(userToBeInserted.password, 8);
    let admin = await dbService.updateOne(USERS, { 'username':'Luz.Robel70' }, userToBeInserted,  { upsert: true });
    console.info('Users seeded 🍺');
  } catch (error){
    console.log('User seeder failed due to ', error.message);
  }
}
/* seeds roles */
async function seedRole () {
  try {
    const roles = [ 'Admin', 'User', 'System_User' ];
    const insertedRoles = await dbService.findMany(Role, { code: { '$in': roles.map(role => role.toUpperCase()) } });
    const rolesToInsert = [];
    roles.forEach(role => {
      if (!insertedRoles.find(insertedRole => insertedRole.code === role.toUpperCase())) {
        rolesToInsert.push({
          name: role,
          code: role.toUpperCase(),
          weight: 1
        });
      }
    });
    if (rolesToInsert.length) {
      const result = await dbService.create(Role, rolesToInsert);
      if (result) console.log('Role seeded 🍺');
      else console.log('Role seeder failed!');
    } else {
      console.log('Role is upto date 🍺');
    }
  } catch (error) {
    console.log('Role seeder failed due to ', error.message);
  }
}

/* seeds routes of project */
async function seedProjectRoutes (routes) {
  try {
    if (routes  && routes.length) {
      let routeName = '';
      const dbRoutes = await dbService.findMany(ProjectRoute, {});
      let routeArr = [];
      let routeObj = {};
      routes.forEach(route => {
        routeName = `${replaceAll((route.path).toLowerCase(), '/', '_')}`;
        route.methods.forEach(method => {
          routeObj = dbRoutes.find(dbRoute => dbRoute.route_name === routeName && dbRoute.method === method);
          if (!routeObj) {
            routeArr.push({
              'uri': route.path.toLowerCase(),
              'method': method,
              'route_name': routeName,
            });
          }
        });
      });
      if (routeArr.length) {
        const result = await dbService.create(ProjectRoute, routeArr);
        if (result) console.info('ProjectRoute model seeded 🍺');
        else console.info('ProjectRoute seeder failed.');
      } else {
        console.info('ProjectRoute is upto date 🍺');
      }
    }
  } catch (error) {
    console.log('ProjectRoute seeder failed due to ', error.message);
  }
}

/* seeds role for routes */
async function seedRouteRole () {
  try {
    const routeRoles = [ 
      {
        route: '/admin/booking/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/booking/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/booking/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/booking/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/booking/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/booking/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/booking/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/booking/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/booking/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/booking/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/booking/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/booking/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/booking/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/booking/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/booking/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/booking/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/booking/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/booking/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/booking/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/booking/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/booking/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/booking/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/booking/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/booking/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/booking/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/booking/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/booking/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/booking/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/booking/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/booking/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/booking/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/booking/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/booking/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/categories/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/categories/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/categories/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/categories/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/categories/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/categories/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/categories/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/categories/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/categories/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/categories/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/categories/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/categories/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/categories/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/categories/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/categories/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/categories/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/categories/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/categories/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/categories/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/categories/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/categories/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/categories/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/categories/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/categories/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/categories/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/categories/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/categories/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/categories/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/categories/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/categories/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/categories/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/categories/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/admin/categories/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/categories/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/admin/categories/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/categories/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/messages/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/messages/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/messages/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/messages/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/messages/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/messages/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/messages/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/messages/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/messages/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/messages/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/messages/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/messages/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/messages/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/messages/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/messages/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/messages/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/messages/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/messages/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/messages/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/messages/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/messages/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/messages/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/messages/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/messages/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/messages/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/messages/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/messages/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/messages/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/messages/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/payments/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/payments/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/payments/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/payments/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/payments/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/payments/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/payments/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/payments/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/payments/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/payments/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/payments/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/payments/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/payments/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/payments/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/payments/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/payments/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/payments/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/payments/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/payments/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/payments/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/payments/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/payments/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/payments/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/payments/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/provider/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/provider/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/provider/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/provider/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/provider/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/provider/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/provider/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/provider/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/provider/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/provider/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/provider/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/provider/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/provider/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/provider/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/provider/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/provider/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/provider/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/provider/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/provider/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/provider/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/provider/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/provider/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/provider/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/provider/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/provider/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/provider/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/provider/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/provider/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/provider/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/provider/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/provider/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/provider/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/provider/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/provider/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/provider/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/provider/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/reviews/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/reviews/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/reviews/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/reviews/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/reviews/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/reviews/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/reviews/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/reviews/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/reviews/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/reviews/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/reviews/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/reviews/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/reviews/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/reviews/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/reviews/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/reviews/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/reviews/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/reviews/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/reviews/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/reviews/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/reviews/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/reviews/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/reviews/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/reviews/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/services/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/services/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/services/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/services/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/services/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/services/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/services/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/services/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/services/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/services/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/services/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/services/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/services/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/services/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/services/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/services/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/services/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/services/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/services/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/services/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/services/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/services/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/services/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/services/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/services/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/services/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/services/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/services/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/services/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/services/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/services/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/services/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/services/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/services/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/services/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/services/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/tool/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/tool/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tool/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/tool/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/tool/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tool/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/tool/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/tool/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tool/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/tool/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/tool/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/tool/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/tool/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/tool/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tool/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/tool/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/tool/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/tool/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/tool/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/tool/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/tool/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/tool/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/tool/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/tool/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/tool/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/tool/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tool/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/tool_booking/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/tool_booking/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tool_booking/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/tool_booking/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/tool_booking/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tool_booking/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/tool_booking/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/tool_booking/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tool_booking/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/tool_booking/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/tool_booking/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/tool_booking/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/tool_booking/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/tool_booking/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/tool_booking/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/tool_booking/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/tool_booking/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/tool_booking/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/admin/tool_booking/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/tool_booking/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/admin/tool_booking/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/admin/tool_booking/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/users/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/users/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/users/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/users/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/users/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/users/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/users/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/users/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/users/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/users/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/users/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/users/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/users/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/users/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/users/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/users/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/users/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/users/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/users/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/users/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/users/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/users/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/users/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/users/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/users/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/users/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/users/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/users/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/users/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/users/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/users/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/users/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/users/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/users/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/users/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/users/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/usertokens/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/usertokens/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/role/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/role/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/routerole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/userrole/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/booking/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/booking/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/booking/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/booking/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/booking/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/booking/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/booking/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/booking/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/list',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/:id',
        role: 'Admin',
        method: 'GET'
      },
      {
        route: '/device/api/v1/categories/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/categories/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/categories/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/categories/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/categories/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/categories/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/categories/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/categories/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/messages/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/messages/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/messages/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/messages/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/messages/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/messages/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/messages/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/messages/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/payments/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/payments/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/payments/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/payments/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/payments/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/payments/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/provider/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/provider/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/provider/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/provider/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/provider/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/provider/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/provider/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/provider/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/provider/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/reviews/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/reviews/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/reviews/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/reviews/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/reviews/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/reviews/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/reviews/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/reviews/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/reviews/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/reviews/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/reviews/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/services/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/services/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/services/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/services/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/services/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/services/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/services/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/services/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/services/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tool/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tool/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tool/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tool/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tool/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tool/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/tool/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/tool/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/tool/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tool/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/tool/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/tool/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/tool/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/tool/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/list',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/:id',
        role: 'Admin',
        method: 'GET'
      },
      {
        route: '/device/api/v1/tool_booking/:id',
        role: 'User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/tool_booking/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/tool_booking/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/tool_booking/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/tool_booking/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/tool_booking/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/tool_booking/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/tool_booking/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/users/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/users/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/users/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/users/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/users/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/users/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/users/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/users/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/users/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/users/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/users/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/users/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/users/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/users/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/users/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/users/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/users/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/users/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/users/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/users/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/users/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/users/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/usertokens/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/usertokens/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/role/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/userrole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },

    ];
    if (routeRoles && routeRoles.length) {
      const routes = [...new Set(routeRoles.map(routeRole => routeRole.route.toLowerCase()))];
      const routeMethods = [...new Set(routeRoles.map(routeRole => routeRole.method))];
      const roles = [ 'Admin', 'User', 'System_User' ];
      const insertedProjectRoute = await dbService.findMany(ProjectRoute, {
        uri: { '$in': routes },
        method: { '$in': routeMethods },
        'isActive': true,
        'isDeleted': false
      });
      const insertedRoles = await dbService.findMany(Role, {
        code: { '$in': roles.map(role => role.toUpperCase()) },
        'isActive': true,
        'isDeleted': false
      });
      let projectRouteId = '';
      let roleId = '';
      let createRouteRoles = routeRoles.map(routeRole => {
        projectRouteId = insertedProjectRoute.find(pr => pr.uri === routeRole.route.toLowerCase() && pr.method === routeRole.method);
        roleId = insertedRoles.find(r => r.code === routeRole.role.toUpperCase());
        if (projectRouteId && roleId) {
          return {
            roleId: roleId.id,
            routeId: projectRouteId.id
          };
        }
      });
      createRouteRoles = createRouteRoles.filter(Boolean);
      const routeRolesToBeInserted = [];
      let routeRoleObj = {};

      await Promise.all(
        createRouteRoles.map(async routeRole => {
          routeRoleObj = await dbService.findOne(RouteRole, {
            routeId: routeRole.routeId,
            roleId: routeRole.roleId,
          });
          if (!routeRoleObj) {
            routeRolesToBeInserted.push({
              routeId: routeRole.routeId,
              roleId: routeRole.roleId,
            });
          }
        })
      );
      if (routeRolesToBeInserted.length) {
        const result = await dbService.create(RouteRole, routeRolesToBeInserted);
        if (result) console.log('RouteRole seeded 🍺');
        else console.log('RouteRole seeder failed!');
      } else {
        console.log('RouteRole is upto date 🍺');
      }
    }
  } catch (error){
    console.log('RouteRole seeder failed due to ', error.message);
  }
}

/* seeds roles for users */
async function seedUserRole (){
  try {
    const userRoles = [{
      'username':'Olin_Adams48',
      'password':'88ChEV2MTJkkCGv'
    },{
      'username':'Luz.Robel70',
      'password':'TZWRBENRHM7boe7'
    }];
    const defaultRoles = await dbService.findMany(Role);
    const insertedUsers = await dbService.findMany(User, { username: { '$in': userRoles.map(userRole => userRole.username) } });
    let user = {};
    const userRolesArr = [];
    userRoles.map(userRole => {
      user = insertedUsers.find(user => user.username === userRole.username && user.isPasswordMatch(userRole.password) && user.isActive && !user.isDeleted);
      if (user) {
        if (user.userType === authConstant.USER_TYPES.Admin){
          userRolesArr.push({
            userId: user.id,
            roleId: defaultRoles.find((d)=>d.code === 'ADMIN')._id
          });
        } else if (user.userType === authConstant.USER_TYPES.User){
          userRolesArr.push({
            userId: user.id,
            roleId: defaultRoles.find((d)=>d.code === 'USER')._id
          });
        } else {
          userRolesArr.push({
            userId: user.id,
            roleId: defaultRoles.find((d)=>d.code === 'SYSTEM_USER')._id
          });
        }  
      }
    });
    let userRoleObj = {};
    const userRolesToBeInserted = [];
    if (userRolesArr.length) {
      await Promise.all(
        userRolesArr.map(async userRole => {
          userRoleObj = await dbService.findOne(UserRole, {
            userId: userRole.userId,
            roleId: userRole.roleId
          });
          if (!userRoleObj) {
            userRolesToBeInserted.push({
              userId: userRole.userId,
              roleId: userRole.roleId
            });
          }
        })
      );
      if (userRolesToBeInserted.length) {
        const result = await dbService.create(UserRole, userRolesToBeInserted);
        if (result) console.log('UserRole seeded 🍺');
        else console.log('UserRole seeder failed');
      } else {
        console.log('UserRole is upto date 🍺');
      }
    }
  } catch (error) {
    console.log('UserRole seeder failed due to ', error.message);
  }
}

async function seedData (allRegisterRoutes){
  await seedUser();
  await seedRole();
  await seedProjectRoutes(allRegisterRoutes);
  await seedRouteRole();
  await seedUserRole();

};
module.exports = seedData;