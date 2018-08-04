const config = require('config')
const mongoose = require('../')
const User = require('./user')
const { telegram } = require('../../modules/telegraf')
const logger = require('../../utils/logger')

const { Schema } = mongoose
const Abstract = new Schema({
  text: String,
  url: { type: String, required: true },
  flow: { type: String, required: true },
  path: { type: String, required: true },
  title: { type: String, required: true },
  course: { type: Number, required: true },
  subject: { type: String, required: true },
  authorId: { type: String, required: true },
  semester: { type: Number, required: true },
  storedPhotos: { type: Array, default: [] },
  photos: { type: Array, default: [] },
}, { versionKey: false, timestamps: true })

Abstract.index({
  flow: 1,
  course: 1,
  semester: 1,
  subject: 1,
})

Abstract.post('save', async data => {
  const {
    flow,
    course,
    semester,
    authorId,
    author,
    subject,
    telegraphUrl,
    title,
  } = data
  logger.info(`${author || authorId} has saved new lecture`
    + `[${flow}, ${course} course, ${semester} semester]: ${subject} | ${title}`)
  const users = await User.find({
    flow,
    course,
    [`settings.${config.settings.abstractSubscriber}`]: true,
    tgId: { $ne: authorId },
  })

  const msg = `${author} сохранил лекцию по предмету ${subject} <a href="${telegraphUrl}">здесь</a>`
  users.forEach(({ tgId }) => telegram.sendMessage(tgId, msg, { parse_mode: 'HTML' }))
})

const Model = mongoose.model('Abstract', Abstract)
Model.ensureIndexes()

module.exports = Model
