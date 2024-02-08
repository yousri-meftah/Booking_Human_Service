/**
 * MessagesRoutes.js
 * @description :: CRUD API routes for Messages
 */

const express = require('express');
const router = express.Router();
const MessagesController = require('../../controller/admin/MessagesController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/messages/create').post(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.addMessages);
router.route('/admin/messages/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.bulkInsertMessages);
router.route('/admin/messages/list').post(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.findAllMessages);
router.route('/admin/messages/count').post(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.getMessagesCount);
router.route('/admin/messages/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.getMessages);
router.route('/admin/messages/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.updateMessages);    
router.route('/admin/messages/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.partialUpdateMessages);
router.route('/admin/messages/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.bulkUpdateMessages);
router.route('/admin/messages/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.softDeleteMessages);
router.route('/admin/messages/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.softDeleteManyMessages);
router.route('/admin/messages/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.deleteMessages);
router.route('/admin/messages/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,MessagesController.deleteManyMessages);

module.exports = router;
