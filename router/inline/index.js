const os = require('os')
const mathmode = require('../../modules/mathmode')

const [ipv4] = os.networkInterfaces().eth0 || [{}]
const { address } = ipv4

module.exports = async ctx => {
  console.log(ctx.inlineQuery)
  console.log(ctx.chosenInlineResult)

  if (!address)
    return ctx.answerInlineQuery([])

  const msg = ctx.inlineQuery.query
    .split(' ')
    .map(str => str.trim())
    .join(' ')

  if (!msg)
    return ctx.answerInlineQuery([])

  try {
    const path = `${process.cwd()}/public/${msg.slice(0, 10)}${Date.now()}.png`
    const render = mathmode(msg, path)

    render.on('finish', () => {
      ctx.answerInlineQuery([{
        type: 'photo',
        id: 1,
        title: 'kek',
        description: 'description',
        caption: 'caption',
        photo_url: `${address}${path}`,
        thumb_url: `${address}${path}`
      }])
    })
    render.on('error', console.error)
    // const { body } = await sendImg(ctx.from.id, path)
    // const response = JSON.parse(body)
    // if (response.ok === false)
    //   await sendDocument(ctx.from.id, path)

    // await unlink(path)
  } catch (e) {
    console.error(e)
    return ctx.answerInlineQuery([])
  }
}
