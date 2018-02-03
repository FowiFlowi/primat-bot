const Abstract = require('../../models/abstract'),
      { Extra } = require('telegraf')

module.exports = async ctx => {
  if (ctx.state.btnVal === 'Отмена')
    return ctx.state.home('nu lan')

  try {
    const skip = ctx.state.btnVal === 'Все' ? 0 : ctx.state.btnVal - 1,
          limit = ctx.state.btnVal === 'Все' ? 0 : 1,
          abstracts = await Abstract.find({
              subject: ctx.session.abstract.subject,
              course: ctx.session.course,
              flow: ctx.session.flow,
              semester: ctx.session.semester
            }, { telegraph_url: 1 })
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit)

    if (abstracts.length !== 0) {
      const getAbstractMarkup = id =>
        Extra.markup(m => m.inlineKeyboard([m.callbackButton('Загрузить в pdf', id)]))

      let timer = 0
      abstracts.forEach(abstract =>
          setTimeout(ctx.reply, (timer += 100), abstract.telegraph_url, getAbstractMarkup(abstract._id))
      )                
    } else
      return ctx.reply('Лекции под таким номером нет')

    ctx.session.abstract = null
    ctx.state.saveSession()
    ctx.reply(
      'Держи, бро. Надеюсь, это тебе поможет не вылететь',
      ctx.state.homeMarkup
    )
  } catch (e) {
    return ctx.state.error(e)
  }
}