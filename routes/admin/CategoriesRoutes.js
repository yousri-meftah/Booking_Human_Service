/**
 * CategoriesRoutes.js
 * @description :: CRUD API routes for Categories
 */

const express = require('express');
const router = express.Router();
const CategoriesController = require('../../controller/admin/CategoriesController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/categories/create').post(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.addCategories);
router.route('/admin/categories/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.bulkInsertCategories);
router.route('/admin/categories/list').post(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.findAllCategories);
router.route('/admin/categories/count').post(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.getCategoriesCount);
router.route('/admin/categories/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.getCategories);
router.route('/admin/categories/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.updateCategories);    
router.route('/admin/categories/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.partialUpdateCategories);
router.route('/admin/categories/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.bulkUpdateCategories);
router.route('/admin/categories/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.softDeleteCategories);
router.route('/admin/categories/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.softDeleteManyCategories);
router.route('/admin/categories/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.deleteCategories);
router.route('/admin/categories/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,CategoriesController.deleteManyCategories);

module.exports = router;
