const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'this route is not for password updates . please use update my password.',
        400
      )
    );
  }
  let image = req.body.image;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    image = url + '/images/users/' + req.file.filename;
  }
  const filteredBody = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    image: image
  };
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'this route is not for password updates . please use update my password.',
        400
      )
    );
  }
  let image = req.body.image;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    image = url + '/images/users/' + req.file.filename;
  }
  const filteredBody = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: req.body.role,
    email: req.body.email,
    image: image
  };
  const updateUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getOneUser = factory.getOne(User);

exports.deleteUser = factory.deleteOne(User);
