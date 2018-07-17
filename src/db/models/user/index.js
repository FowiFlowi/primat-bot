const mongoose = require('../../')

const { Schema } = mongoose
const User = new Schema({
  tgId: {
    type: String,
    required: true,
    unique: true,
  },
  username: String,
  firstName: { type: String, required: true },
  lastName: String,
  group: {
    type: String,
    lowercase: true,
    // match: /^[А-яіє]{2,4}-[А-яіє]{0,2}[0-9]{2,3}[А-яіє]?\(?[А-яіє]*\)?\.?$/i,
    trim: true,
  },
  role: { type: String, required: true },
  groupId: Number,
  tId: Number,
  tName: String,
  tFullName: String,
  tShortName: String,
  tScheduleUrl: String,
  tRating: Number,
  groupOkr: String,
  groupType: String,
  groupScheduleUrl: String,
  flow: {
    type: String,
    lowercase: true,
    trim: true,
  },
  course: {
    type: Number,
    min: 1,
    max: 6,
    trim: true,
  },
  telegraph_token: String,
  telegraph_authurl: String,
  telegraph_user: Boolean,
  subscriber: { type: Boolean, default: true },
  hideLocationBtns: { type: Boolean, default: false },
}, { strict: 'throw', timestamps: true })

module.exports = mongoose.model('User', User)

const postSave = require('./postSave')
const postUpdate = require('./postUpdate')

User.post('save', postSave)
User.post('findOneAndUpdate', postUpdate)
