const KoaRouter = require('koa-router')
const cors = require('koa2-cors')
const User = require('../db/models/user')
const groupService = require('../bot/service/group')
const userService = require('../bot/service/user')
const service = require('../service/auth')
const errors = require('../errors')

const auth = new KoaRouter()

module.exports = router => {
  auth.post('/', async ctx => {
    const { user: userData } = ctx.request.body
    if (!userData) {
      return errors.badRequest('User field doesn\'t provided')
    }
    const dbUser = await User.findOne({ tgId: userData.tgId })
    if (dbUser) {
      return errors.badRequest('User already exists')
    }
    return ctx.body = await service.register(userData)
  })
  auth.get('/login/:tgId', async ctx => {
    /* TODO: check hash */
    const { tgId } = ctx.params
    const user = await User.findOne({ tgId })
    if (!user) {
      return errors.notFound('User with such telegram id is not registered')
    }
    return ctx.body = userService.filterSensitiveFields(user)
  })
  auth.get('/group/:id', async ctx => ctx.body = await groupService.processGroup(ctx.params.id))
  auth.post('/group', async ctx => {
    const { group } = ctx.request.body
    return ctx.body = await groupService.processGroup(group)
  })
  router.use('/auth', cors(), auth.routes(), auth.allowedMethods())
}