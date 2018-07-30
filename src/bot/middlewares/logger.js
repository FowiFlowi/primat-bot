const config = require('config')
const logger = require('../../utils/logger')

function filterSessionFields(session) {
  const { ...result } = session
  const { user } = result
  if (user) {
    config.sessionFilter.forEach(field => delete user[field])
  }
  return result
}

module.exports = (ctx, next) => {
  const {
    id,
    username,
    first_name: firstName,
    last_name: lastName,
  } = ctx.from
  let user = ''
  if (ctx.session.role) {
    user += `${ctx.state.user.role}`
    if (ctx.session.role !== ctx.state.user.role) {
      user += `->${ctx.session.role}`
    }
    user += '|'
  }
  user += id
  if (username) {
    user += ` ${username}`
  }
  if (firstName) {
    user += ` ${firstName}`
  }
  if (lastName) {
    user += ` ${lastName}`
  }
  // eslint-disable-next-line no-underscore-dangle
  const currScene = ctx.session.__scenes && ctx.session.__scenes.current
  let msg = currScene ? `[${currScene}] ` : ''
  if (ctx.callbackQuery) {
    msg += `clicked on ${ctx.callbackQuery.message.text} -> ${ctx.callbackQuery.data}`
    logger.info(user, msg)
  }
  if (ctx.message) {
    if (ctx.message.text) {
      msg += `sended ${ctx.message.text}`
      logger.info(user, msg)
    } else if (ctx.message.document) {
      msg += 'sended document'
      logger.info(user, msg, ctx.message.document)
    }
  }
  logger.info(filterSessionFields(ctx.session))
  return next()
}
