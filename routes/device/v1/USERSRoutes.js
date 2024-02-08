/**
 * USERSRoutes.js
 * @description :: CRUD API routes for USERS
 */

const express = require('express');
const router = express.Router();
const USERSController = require('../../../controller/device/v1/USERSController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');

router.route('/device/api/v1/users/me').get(auth(PLATFORM.DEVICE),USERSController.getLoggedInUserInfo);
router.route('/device/api/v1/users/create').post(USERSController.addUSERS);
router.route('/device/api/v1/users/addBulk').post(USERSController.bulkInsertUSERS);
router.route('/device/api/v1/users/list').post(USERSController.findAllUSERS);
router.route('/device/api/v1/users/count').post(USERSController.getUSERSCount);
router.route('/device/api/v1/users/:id').get(USERSController.getUSERS);
router.route('/device/api/v1/users/update/:id').put(USERSController.updateUSERS);    
router.route('/device/api/v1/users/partial-update/:id').put(USERSController.partialUpdateUSERS);
router.route('/device/api/v1/users/updateBulk').put(USERSController.bulkUpdateUSERS);
router.route('/device/api/v1/users/softDelete/:id').put(USERSController.softDeleteUSERS);
router.route('/device/api/v1/users/softDeleteMany').put(USERSController.softDeleteManyUSERS);
router.route('/device/api/v1/users/delete/:id').delete(USERSController.deleteUSERS);
router.route('/device/api/v1/users/deleteMany').post(USERSController.deleteManyUSERS);
router.route('/device/api/v1/users/change-password').put(auth(PLATFORM.DEVICE),USERSController.changePassword);
router.route('/device/api/v1/users/update-profile').put(auth(PLATFORM.DEVICE),USERSController.updateProfile);

module.exports = router;
