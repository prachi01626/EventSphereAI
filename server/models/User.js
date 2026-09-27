const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { createMockModel } = require('./mockStore');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Organizer', 'Participant', 'Volunteer'],
      default: 'Participant',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);
const mockUser = createMockModel('users');

const UserProxy = new Proxy(MongooseUser, {
  get(target, prop) {
    if (global.__MOCK_DB_ACTIVE__) {
      return mockUser[prop] !== undefined ? mockUser[prop] : target[prop];
    }
    return target[prop];
  },
});

module.exports = UserProxy;
