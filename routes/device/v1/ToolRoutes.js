/**
 * ToolRoutes.js
 * @description :: CRUD API routes for Tool
 */

const express = require('express');
const router = express.Router();
const ToolController = require('../../../controller/device/v1/ToolController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/tool/create').post(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.addTool);
router.route('/device/api/v1/tool/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.bulkInsertTool);
router.route('/device/api/v1/tool/list').post(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.findAllTool);
router.route('/device/api/v1/tool/count').post(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.getToolCount);
router.route('/device/api/v1/tool/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.getTool);
router.route('/device/api/v1/tool/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.updateTool);    
router.route('/device/api/v1/tool/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.partialUpdateTool);
router.route('/device/api/v1/tool/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.bulkUpdateTool);
router.route('/device/api/v1/tool/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.softDeleteTool);
router.route('/device/api/v1/tool/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.softDeleteManyTool);
router.route('/device/api/v1/tool/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.deleteTool);
router.route('/device/api/v1/tool/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,ToolController.deleteManyTool);

module.exports = router;
