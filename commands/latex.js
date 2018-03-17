const { request, bot } = require('../modules/utils')
const sendDocument = require('../modules/send-document')
const util = require('util')
const fs = require('fs')
const unlink = util.promisify(fs.unlink)

const mathmode = require('../modules/mathmode')

module.exports = async ctx => {
  const msg = ctx.message.text
    .split(' ')
    .slice(1)
    .map(str => str.trim())
    .join(' ')

  if (!msg)
    return ctx.reply('Выражение не указано. Попробуй еще раз')

  try {
    const path = `${process.cwd()}/public/${msg.slice(0, 10)}${Date.now()}.png`
    const render = mathmode(msg, path)
    render.on('finish', async () => {
      const { body } = await sendImg(ctx.from.id, path)
      const response = JSON.parse(body)
      if (response.ok === false)
        await sendDocument(ctx.from.id, path)

      await unlink(path)
    })
    render.on('error', e => {
      ctx.state.error(e)
    })
  } catch (e) {
    ctx.state.error(e)
  }
}

function sendImg(chat_id, filePath) {
  const method = 'POST'
  const url = `${bot.telegram.options.apiRoot}/bot${bot.telegram.token}/sendPhoto`
  const formData = { chat_id, photo: fs.createReadStream(filePath) }
  return request({ method, url, formData })
}
