/**
 * ProviderRoutes.js
 * @description :: CRUD API routes for Provider
 */

const express = require('express');
const router = express.Router();
const ProviderController = require('../../../controller/device/v1/ProviderController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/provider/create').post(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.addProvider);
router.route('/device/api/v1/provider/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.bulkInsertProvider);
router.route('/device/api/v1/provider/list').post(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.findAllProvider);
router.route('/device/api/v1/provider/count').post(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.getProviderCount);
router.route('/device/api/v1/provider/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.getProvider);
router.route('/device/api/v1/provider/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.updateProvider);    
router.route('/device/api/v1/provider/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.partialUpdateProvider);
router.route('/device/api/v1/provider/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.bulkUpdateProvider);
router.route('/device/api/v1/provider/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.softDeleteProvider);
router.route('/device/api/v1/provider/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.softDeleteManyProvider);
router.route('/device/api/v1/provider/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.deleteProvider);
router.route('/device/api/v1/provider/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,ProviderController.deleteManyProvider);

module.exports = router;
