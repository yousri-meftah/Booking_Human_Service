/**
 * index.js
 * @description :: index route file of device platform.
 */

const express =  require('express');
const router =  express.Router();
router.use('/device/auth',require('./auth'));
router.use(require('./Tool_bookingRoutes'));
router.use(require('./ToolRoutes'));
router.use(require('./MessagesRoutes'));
router.use(require('./PaymentsRoutes'));
router.use(require('./ReviewsRoutes'));
router.use(require('./BookingRoutes'));
router.use(require('./ProviderRoutes'));
router.use(require('./ServicesRoutes'));
router.use(require('./CategoriesRoutes'));
router.use(require('./USERSRoutes'));
router.use(require('./uploadRoutes'));

module.exports = router;
