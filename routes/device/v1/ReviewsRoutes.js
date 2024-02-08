/**
 * ReviewsRoutes.js
 * @description :: CRUD API routes for Reviews
 */

const express = require('express');
const router = express.Router();
const ReviewsController = require('../../../controller/device/v1/ReviewsController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/reviews/create').post(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.addReviews);
router.route('/device/api/v1/reviews/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.bulkInsertReviews);
router.route('/device/api/v1/reviews/list').post(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.findAllReviews);
router.route('/device/api/v1/reviews/count').post(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.getReviewsCount);
router.route('/device/api/v1/reviews/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.getReviews);
router.route('/device/api/v1/reviews/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.updateReviews);    
router.route('/device/api/v1/reviews/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.partialUpdateReviews);
router.route('/device/api/v1/reviews/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.bulkUpdateReviews);
router.route('/device/api/v1/reviews/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.softDeleteReviews);
router.route('/device/api/v1/reviews/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.softDeleteManyReviews);
router.route('/device/api/v1/reviews/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.deleteReviews);
router.route('/device/api/v1/reviews/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,ReviewsController.deleteManyReviews);

module.exports = router;
