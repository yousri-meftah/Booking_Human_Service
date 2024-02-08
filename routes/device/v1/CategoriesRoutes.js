/**
 * CategoriesRoutes.js
 * @description :: CRUD API routes for Categories
 */

const express = require('express');
const router = express.Router();
const CategoriesController = require('../../../controller/device/v1/CategoriesController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/categories/create').post(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.addCategories);
router.route('/device/api/v1/categories/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.bulkInsertCategories);
router.route('/device/api/v1/categories/list').post(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.findAllCategories);
router.route('/device/api/v1/categories/count').post(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.getCategoriesCount);
router.route('/device/api/v1/categories/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.getCategories);
router.route('/device/api/v1/categories/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.updateCategories);    
router.route('/device/api/v1/categories/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.partialUpdateCategories);
router.route('/device/api/v1/categories/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.bulkUpdateCategories);
router.route('/device/api/v1/categories/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.softDeleteCategories);
router.route('/device/api/v1/categories/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.softDeleteManyCategories);
router.route('/device/api/v1/categories/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.deleteCategories);
router.route('/device/api/v1/categories/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,CategoriesController.deleteManyCategories);

module.exports = router;
