const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const features = Model.find(req.body);
    const doc = await features;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });

exports.getOne = Model =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    const doc = await query;
    if (!doc) {
      return next(new AppError(`there is no ${Model} found with that id`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('there is no document with that id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
