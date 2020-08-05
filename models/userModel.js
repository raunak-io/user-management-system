
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstname: {
      required: [true, 'name field is required'],
    type: String
    },
    lastname: {
      required: [true, 'name field is required'],
    type: String
    },
    email: {
      type: String,
      required: [true, 'email field is required'],
      unique: [true, 'email field is required'],
      lowercase: true,
      validate: [validator.isEmail, 'please enter your correct email address']
    },
    image: String,
    role: {
      type: String,
      enum: ['admin', 'user','manager'],
      default: 'user'
    },
   
    password: {
      required: [true, 'password is required'],
      minlength: [8, 'password should be minimum 8 characters'],
      select: false,
      type: String
    },
    confirmPassword: {
      type: String,
      required: [true, 'please confirm your password'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not same'
      }
    },
    passwordChangedAt: Date,
    
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};


const User = mongoose.model('User', userSchema);
module.exports = User;
