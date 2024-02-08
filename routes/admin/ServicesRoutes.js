/**
 * ServicesRoutes.js
 * @description :: CRUD API routes for Services
 */

const express = require('express');
const router = express.Router();
const ServicesController = require('../../controller/admin/ServicesController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/services/create').post(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.addServices);
router.route('/admin/services/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.bulkInsertServices);
router.route('/admin/services/list').post(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.findAllServices);
router.route('/admin/services/count').post(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.getServicesCount);
router.route('/admin/services/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.getServices);
router.route('/admin/services/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.updateServices);    
router.route('/admin/services/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.partialUpdateServices);
router.route('/admin/services/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.bulkUpdateServices);
router.route('/admin/services/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.softDeleteServices);
router.route('/admin/services/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.softDeleteManyServices);
router.route('/admin/services/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.deleteServices);
router.route('/admin/services/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,ServicesController.deleteManyServices);

module.exports = router;
