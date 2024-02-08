/**
 * MessagesRoutes.js
 * @description :: CRUD API routes for Messages
 */

const express = require('express');
const router = express.Router();
const MessagesController = require('../../../controller/device/v1/MessagesController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/messages/create').post(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.addMessages);
router.route('/device/api/v1/messages/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.bulkInsertMessages);
router.route('/device/api/v1/messages/list').post(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.findAllMessages);
router.route('/device/api/v1/messages/count').post(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.getMessagesCount);
router.route('/device/api/v1/messages/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.getMessages);
router.route('/device/api/v1/messages/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.updateMessages);    
router.route('/device/api/v1/messages/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.partialUpdateMessages);
router.route('/device/api/v1/messages/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.bulkUpdateMessages);
router.route('/device/api/v1/messages/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.softDeleteMessages);
router.route('/device/api/v1/messages/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.softDeleteManyMessages);
router.route('/device/api/v1/messages/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.deleteMessages);
router.route('/device/api/v1/messages/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,MessagesController.deleteManyMessages);

module.exports = router;
