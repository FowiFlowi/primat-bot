const config = require('config')
const Scene = require('telegraf/scenes/base')
const ignoreCommand = require('../../utils/ignoreCommand')
const handleGroupRegistry = require('../../handlers/groupRegistry')
const handleGroupChange = require('../../handlers/groupChange')

const scene = new Scene(config.scenes.greeter.setCourse)

scene.enter(ctx => {
  const { msg, keyboard } = ctx.state
  return ctx.reply(msg, keyboard)
})
scene.hears(ignoreCommand, async ctx => {
  const course = Number(ctx.state.cleanedMsg)
  if (!course || course < 1 || course > 6) {
    return ctx.reply('Не уверен, что там кто-то учится. У нас ведь всего шесть курсов? Попробуй еще')
  }
  const { userData } = ctx.scene.state
  userData.course = course
  if (ctx.scene.state.parent === config.scenes.home.cabinet.changeGroup) {
    ctx.state.groupData = userData
    return handleGroupChange(ctx)
  }
  ctx.state.userData = userData
  return handleGroupRegistry(ctx)
})

module.exports = scene
