/**
 * ToolRoutes.js
 * @description :: CRUD API routes for Tool
 */

const express = require('express');
const router = express.Router();
const ToolController = require('../../controller/admin/ToolController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/tool/create').post(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.addTool);
router.route('/admin/tool/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.bulkInsertTool);
router.route('/admin/tool/list').post(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.findAllTool);
router.route('/admin/tool/count').post(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.getToolCount);
router.route('/admin/tool/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.getTool);
router.route('/admin/tool/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.updateTool);    
router.route('/admin/tool/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.partialUpdateTool);
router.route('/admin/tool/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.bulkUpdateTool);
router.route('/admin/tool/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.softDeleteTool);
router.route('/admin/tool/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.softDeleteManyTool);
router.route('/admin/tool/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.deleteTool);
router.route('/admin/tool/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,ToolController.deleteManyTool);

module.exports = router;
