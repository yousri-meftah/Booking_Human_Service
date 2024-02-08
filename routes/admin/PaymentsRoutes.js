/**
 * PaymentsRoutes.js
 * @description :: CRUD API routes for Payments
 */

const express = require('express');
const router = express.Router();
const PaymentsController = require('../../controller/admin/PaymentsController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/payments/create').post(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.addPayments);
router.route('/admin/payments/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.bulkInsertPayments);
router.route('/admin/payments/list').post(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.findAllPayments);
router.route('/admin/payments/count').post(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.getPaymentsCount);
router.route('/admin/payments/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.getPayments);
router.route('/admin/payments/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.updatePayments);    
router.route('/admin/payments/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.partialUpdatePayments);
router.route('/admin/payments/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.bulkUpdatePayments);
router.route('/admin/payments/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.softDeletePayments);
router.route('/admin/payments/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.softDeleteManyPayments);
router.route('/admin/payments/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.deletePayments);
router.route('/admin/payments/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,PaymentsController.deleteManyPayments);

module.exports = router;
