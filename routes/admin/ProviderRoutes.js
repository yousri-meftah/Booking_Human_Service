/**
 * ProviderRoutes.js
 * @description :: CRUD API routes for Provider
 */

const express = require('express');
const router = express.Router();
const ProviderController = require('../../controller/admin/ProviderController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/provider/create').post(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.addProvider);
router.route('/admin/provider/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.bulkInsertProvider);
router.route('/admin/provider/list').post(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.findAllProvider);
router.route('/admin/provider/count').post(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.getProviderCount);
router.route('/admin/provider/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.getProvider);
router.route('/admin/provider/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.updateProvider);    
router.route('/admin/provider/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.partialUpdateProvider);
router.route('/admin/provider/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.bulkUpdateProvider);
router.route('/admin/provider/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.softDeleteProvider);
router.route('/admin/provider/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.softDeleteManyProvider);
router.route('/admin/provider/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.deleteProvider);
router.route('/admin/provider/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,ProviderController.deleteManyProvider);

module.exports = router;
