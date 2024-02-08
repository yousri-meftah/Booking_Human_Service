/**
 * BookingRoutes.js
 * @description :: CRUD API routes for Booking
 */

const express = require('express');
const router = express.Router();
const BookingController = require('../../../controller/device/v1/BookingController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/booking/create').post(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.addBooking);
router.route('/device/api/v1/booking/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.bulkInsertBooking);
router.route('/device/api/v1/booking/list').post(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.findAllBooking);
router.route('/device/api/v1/booking/count').post(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.getBookingCount);
router.route('/device/api/v1/booking/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.getBooking);
router.route('/device/api/v1/booking/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.updateBooking);    
router.route('/device/api/v1/booking/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.partialUpdateBooking);
router.route('/device/api/v1/booking/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.bulkUpdateBooking);
router.route('/device/api/v1/booking/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.softDeleteBooking);
router.route('/device/api/v1/booking/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.softDeleteManyBooking);
router.route('/device/api/v1/booking/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.deleteBooking);
router.route('/device/api/v1/booking/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,BookingController.deleteManyBooking);

module.exports = router;
