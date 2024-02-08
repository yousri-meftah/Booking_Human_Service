/**
 * PaymentsRoutes.js
 * @description :: CRUD API routes for Payments
 */

const express = require('express');
const router = express.Router();
const PaymentsController = require('../../../controller/device/v1/PaymentsController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/payments/create').post(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.addPayments);
router.route('/device/api/v1/payments/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.bulkInsertPayments);
router.route('/device/api/v1/payments/list').post(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.findAllPayments);
router.route('/device/api/v1/payments/count').post(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.getPaymentsCount);
router.route('/device/api/v1/payments/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.getPayments);
router.route('/device/api/v1/payments/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.updatePayments);    
router.route('/device/api/v1/payments/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.partialUpdatePayments);
router.route('/device/api/v1/payments/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.bulkUpdatePayments);
router.route('/device/api/v1/payments/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.softDeletePayments);
router.route('/device/api/v1/payments/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.softDeleteManyPayments);
router.route('/device/api/v1/payments/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.deletePayments);
router.route('/device/api/v1/payments/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,PaymentsController.deleteManyPayments);

module.exports = router;
