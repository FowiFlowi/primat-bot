const mongoose = require('../modules/mongoose'),
      { telegram } = require('../modules/utils').bot,

  Schema = mongoose.Schema,

  User = new Schema({
    tgId: {
      type: String,
      required: true,
      unique: true
    },
    username: String,
    group: {
      type: String,
      lowercase: true,
      // match: /^[А-яіє]{2,4}-[А-яіє]{0,2}[0-9]{2,3}[А-яіє]?\(?[А-яіє]*\)?\.?$/i,
      trim: true
    },
    groupHubId: Number,
    rGroupId: Number,
    groupOkr: String,
    groupType: String,
    groupScheduleUrl: String,
    flow: {
      type: String,
      lowercase: true,
      trim: true
    },
    course: {
      type: Number,
      min: 1,
      max: 6,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    telegraph_token: String,
    telegraph_authurl: String,
    telegraph_user: Boolean,
    unsubscriber: Boolean,
    hideLocationBtns: { type: Boolean, default: false }
  })

User.post('save', ({ username, tgId, group }) => {
  const msg = `New user ${username || tgId}${group ? ` from ${group}` : ''} has registered!`
  telegram.sendMessage(config.ownerId, msg)
  console.log(msg)
})

module.exports = mongoose.model('User', User)