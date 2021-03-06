const config = require('config')
const mongoose = require('../db')
const telegraf = require('../modules/telegraf')
const middlewares = require('./middlewares')
const commands = require('./commands')
const logger = require('../utils/logger')
const callbackQueryHandler = require('./handlers/callbackQuery')
const inlineQueryHandler = require('./handlers/inlineQuery')

const session = new middlewares.Session(mongoose.connections[0])

module.exports = {
  setMiddlewares() {
    telegraf.use(session.middleware)
    telegraf.use(middlewares.errorHandler)
    telegraf.use(middlewares.auth)
    telegraf.use(middlewares.logger)
    telegraf.use(middlewares.processMessage)
    telegraf.use(middlewares.scenes)
    telegraf.use(middlewares.triggerScene)
  },
  async start() {
    telegraf.on('inline_query', inlineQueryHandler)
    await session.setup()
    this.setMiddlewares()
    commands()
    // commands.set()

    telegraf.on('callback_query', callbackQueryHandler)

    telegraf.catch(e => {
      logger.error(e)
      telegraf.telegram.sendMessage(config.adminId, `Error: ${e.message}`)
    })
  },
}
