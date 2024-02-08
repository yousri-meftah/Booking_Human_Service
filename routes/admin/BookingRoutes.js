/**
 * BookingRoutes.js
 * @description :: CRUD API routes for Booking
 */

const express = require('express');
const router = express.Router();
const BookingController = require('../../controller/admin/BookingController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/booking/create').post(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.addBooking);
router.route('/admin/booking/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.bulkInsertBooking);
router.route('/admin/booking/list').post(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.findAllBooking);
router.route('/admin/booking/count').post(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.getBookingCount);
router.route('/admin/booking/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.getBooking);
router.route('/admin/booking/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.updateBooking);    
router.route('/admin/booking/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.partialUpdateBooking);
router.route('/admin/booking/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.bulkUpdateBooking);
router.route('/admin/booking/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.softDeleteBooking);
router.route('/admin/booking/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.softDeleteManyBooking);
router.route('/admin/booking/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.deleteBooking);
router.route('/admin/booking/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,BookingController.deleteManyBooking);

module.exports = router;
