const config = require('config')
const Scene = require('telegraf/scenes/base')
const handleGroupRegistry = require('../../handlers/groupRegistry')
const handleGroupChange = require('../../handlers/groupChange')
const ignoreCommand = require('../../utils/ignoreCommand')

const { scenes } = config
const scene = new Scene(scenes.greeter.chooseGroup)

scene.enter(ctx => {
  const { msg, keyboard } = ctx.state
  return ctx.reply(msg, keyboard)
})

scene.hears(ignoreCommand, async ctx => {
  const num = parseInt(ctx.state.cleanedMsg, 10)
  if (!num) {
    return ctx.reply('Выбери какой-то номер')
  }
  const group = ctx.scene.state.groups[num - 1]
  if (!group) {
    return ctx.reply('У тебя есть списочек из номеров')
  }
  ctx.state.group = group
  if (ctx.scene.state.parent === config.scenes.home.cabinet.changeGroup) {
    return handleGroupChange(ctx)
  }
  return handleGroupRegistry(ctx)
})

module.exports = scene
