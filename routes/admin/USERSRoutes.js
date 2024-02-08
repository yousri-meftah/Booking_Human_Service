/**
 * USERSRoutes.js
 * @description :: CRUD API routes for USERS
 */

const express = require('express');
const router = express.Router();
const USERSController = require('../../controller/admin/USERSController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/users/me').get(auth(PLATFORM.ADMIN),USERSController.getLoggedInUserInfo);
router.route('/admin/users/create').post(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.addUSERS);
router.route('/admin/users/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.bulkInsertUSERS);
router.route('/admin/users/list').post(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.findAllUSERS);
router.route('/admin/users/count').post(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.getUSERSCount);
router.route('/admin/users/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.getUSERS);
router.route('/admin/users/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.updateUSERS);    
router.route('/admin/users/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.partialUpdateUSERS);
router.route('/admin/users/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.bulkUpdateUSERS);
router.route('/admin/users/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.softDeleteUSERS);
router.route('/admin/users/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.softDeleteManyUSERS);
router.route('/admin/users/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.deleteUSERS);
router.route('/admin/users/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,USERSController.deleteManyUSERS);
router.route('/admin/users/change-password').put(auth(PLATFORM.ADMIN),USERSController.changePassword);
router.route('/admin/users/update-profile').put(auth(PLATFORM.ADMIN),USERSController.updateProfile);

module.exports = router;
