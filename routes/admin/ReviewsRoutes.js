/**
 * ReviewsRoutes.js
 * @description :: CRUD API routes for Reviews
 */

const express = require('express');
const router = express.Router();
const ReviewsController = require('../../controller/admin/ReviewsController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/reviews/create').post(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.addReviews);
router.route('/admin/reviews/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.bulkInsertReviews);
router.route('/admin/reviews/list').post(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.findAllReviews);
router.route('/admin/reviews/count').post(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.getReviewsCount);
router.route('/admin/reviews/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.getReviews);
router.route('/admin/reviews/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.updateReviews);    
router.route('/admin/reviews/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.partialUpdateReviews);
router.route('/admin/reviews/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.bulkUpdateReviews);
router.route('/admin/reviews/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.softDeleteReviews);
router.route('/admin/reviews/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.softDeleteManyReviews);
router.route('/admin/reviews/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.deleteReviews);
router.route('/admin/reviews/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,ReviewsController.deleteManyReviews);

module.exports = router;
