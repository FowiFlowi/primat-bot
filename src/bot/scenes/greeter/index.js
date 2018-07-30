const config = require('config')
const Scene = require('telegraf/scenes/base')
const service = require('../../service/greeter')
const handleGroupRegistry = require('../../handlers/groupRegistry')
const msgFromDataToUserData = require('../../utils/msgFromDataToUserData')
const ignoreCommand = require('../../utils/ignoreCommand')
const getRegMsg = require('../../../utils/getRegMsg')

const scene = new Scene(config.scenes.greeter.self)
const btns = config.btns.greeter
const { roles } = config

scene.enter(ctx => {
  const { msg, keyboard } = service.welcome(ctx.from.first_name)
  return ctx.replyWithHTML(msg, keyboard)
})
scene.hears(btns.abiturient, async ctx => {
  await service.register(msgFromDataToUserData(ctx.message.from), roles.abiturient, ctx.session)
  return ctx.home(getRegMsg(ctx.session.role))
})
scene.hears(btns.noKPI, async ctx => {
  await service.register(msgFromDataToUserData(ctx.message.from), roles.noKPI, ctx.session)
  return ctx.home(getRegMsg(ctx.session.role))
})
scene.hears(btns.teacher, async ctx => {
  ctx.state.msg = 'Для регистрации и аутентификации введите полностью ФИО (на украинском)'
  ctx.state.keyboard = config.removeMarkup
  return ctx.scene.enter(config.scenes.greeter.teacher)
})
scene.hears(ignoreCommand, handleGroupRegistry)

module.exports = scene
