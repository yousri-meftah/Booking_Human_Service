/**
 * Tool_bookingRoutes.js
 * @description :: CRUD API routes for Tool_booking
 */

const express = require('express');
const router = express.Router();
const Tool_bookingController = require('../../controller/admin/Tool_bookingController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/tool_booking/create').post(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.addTool_booking);
router.route('/admin/tool_booking/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.bulkInsertTool_booking);
router.route('/admin/tool_booking/list').post(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.findAllTool_booking);
router.route('/admin/tool_booking/count').post(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.getTool_bookingCount);
router.route('/admin/tool_booking/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.getTool_booking);
router.route('/admin/tool_booking/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.updateTool_booking);    
router.route('/admin/tool_booking/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.partialUpdateTool_booking);
router.route('/admin/tool_booking/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.bulkUpdateTool_booking);
router.route('/admin/tool_booking/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.softDeleteTool_booking);
router.route('/admin/tool_booking/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.softDeleteManyTool_booking);
router.route('/admin/tool_booking/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.deleteTool_booking);
router.route('/admin/tool_booking/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,Tool_bookingController.deleteManyTool_booking);

module.exports = router;
