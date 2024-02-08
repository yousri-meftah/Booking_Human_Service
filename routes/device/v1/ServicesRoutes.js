/**
 * ServicesRoutes.js
 * @description :: CRUD API routes for Services
 */

const express = require('express');
const router = express.Router();
const ServicesController = require('../../../controller/device/v1/ServicesController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/services/create').post(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.addServices);
router.route('/device/api/v1/services/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.bulkInsertServices);
router.route('/device/api/v1/services/list').post(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.findAllServices);
router.route('/device/api/v1/services/count').post(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.getServicesCount);
router.route('/device/api/v1/services/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.getServices);
router.route('/device/api/v1/services/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.updateServices);    
router.route('/device/api/v1/services/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.partialUpdateServices);
router.route('/device/api/v1/services/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.bulkUpdateServices);
router.route('/device/api/v1/services/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.softDeleteServices);
router.route('/device/api/v1/services/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.softDeleteManyServices);
router.route('/device/api/v1/services/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.deleteServices);
router.route('/device/api/v1/services/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,ServicesController.deleteManyServices);

module.exports = router;
