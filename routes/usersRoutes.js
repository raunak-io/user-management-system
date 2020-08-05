const express = require('express');
const userControllers = require('./../controllers/usersControllers');
const authController = require('./../controllers/authController');
const imageValidator = require('../utils/imageValidator');
const router = express.Router();

router.post('/login', authController.login);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userControllers.getMe, userControllers.getOneUser);

router.patch('/updateMe', imageValidator, userControllers.updateMe);
router.delete('/deleteMe', userControllers.deleteMe);

router.use(authController.restrictTo('admin', 'manager'));

router.post('/createUser', imageValidator, authController.createUser);
router.patch('/updateUser/:id', imageValidator, userControllers.updateUser);

router.route('/').get(userControllers.getAllUsers);

router.route('/:id').get(userControllers.getOneUser);

router.use(authController.restrictTo('admin'));
router.route('/:id').delete(userControllers.deleteUser);

module.exports = router;
