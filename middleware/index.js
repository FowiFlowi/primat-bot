const User = require('../models/user')

module.exports = (bot, homeMarkup, session) => {
  const start = require('../router/start')(homeMarkup)

  if (process.env.STATUS === 'dev') {
    bot.use((ctx, next) => config.ownerId == ctx.from.id
      ? next()
      : ctx.reply('Соре, я пока кушаю бананы. Но скоро вернусь!')
    )
  }

  bot.use(session.middleware())

  bot.use((ctx, next) => {
    if (ctx.session && ctx.session.user) {
      const { username, tgId, group } = ctx.session.user,
            route = config.routes.reduce((res, route) => res || ctx.session[route] && route || null, null)

      console.log(`${username || tgId}${group ? `, ${group}` : ''} has written ${ctx.message.text}` + 
        `${route ? ` [${route} |> ${ctx.session[route].nextCondition} -> ${ctx.message.text}]` : ''}`)
    }
    next()
  })

  bot.use((ctx, next) => {
    ctx.state.sessionKey = `${ctx.from.id}:${ctx.chat.id}`

    ctx.state.saveSession = () => session.saveSession(ctx.state.sessionKey, ctx.session)

    ctx.state.clearRoutes = () => {
      config.routes.forEach(route => ctx.session[route] = null)
      ctx.state.saveSession()
    }

    ctx.state.error = e => {
      ctx.state.clearRoutes()
      ctx.reply('Ой, что-то пошло не так :c', homeMarkup)
      console.error(e)
    }

    next()
  })

  bot.use(async (ctx, next) => {
    if (!ctx.session.user && !ctx.session.registry) {
      try {
        const user = await User.findOne({ tgId: ctx.from.id })
        if (user) {
          ctx.session.user = user
          config.session_fields.forEach(field => ctx.session[field] = user[field])
          ctx.session.semester = 1
          ctx.state.clearRoutes()
          ctx.state.saveSession()
          return ctx.reply('Ой, я был занят обновлением твоей сессии и пропустил команду. ' +
            'Повтори, пожалуйста', homeMarkup)
        } else start(ctx)
      } catch(e) {
        return ctx.state.error(e)
      }
    } else {
      next()
    }
  })
}