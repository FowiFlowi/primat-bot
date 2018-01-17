const { Markup } = require('telegraf'),
        validGroup = require('../../modules/valid-group'),
        getGroupId = require('../../modules/group-id'),
        { request } = require('../../modules/utils')

module.exports = Router => {
    const router = Router('cabinet',
        ctx => ctx.message.text !== config.btns.cabinet && !ctx.session.cabinet,
        ctx => ctx.session.cabinet && ctx.session.cabinet.nextCondition || 'cabinet')

    router.on('cabinet', ctx => {
        ctx.session.cabinet = { nextCondition: 'action' }
        const keyboard = ['Поменять группу', 'Сменить семестр', 'Кто я?', 'Назад']
        if (ctx.session.user.telegraph_user)
            keyboard.push('Загрузить лекцию')

        ctx.reply('Тут можешь притвориться кем-то другим', Markup
            .keyboard(keyboard, { columns: 2 }).resize().extra()
        )
        ctx.state.saveSession()
    })

    router.on('action', async ctx => {
        switch (ctx.state.btnVal) {
            case 'Поменять группу':
                ctx.reply('К кому пойдем?', Markup
                    .keyboard(['Назад'])
                    .resize().oneTime().extra()
                )
                ctx.session.cabinet.nextCondition = 'changeGroup'
                break
            case 'Загрузить лекцию': {
                if (ctx.session.user.telegraph_user) {
                    if (!ctx.session.user.telegraph_token)
                        return ctx.reply('У тебя пока нет аккаунта\nТебе поможет команда /telegraph')
                    try {
                        const subjects = ctx.session.subjects
                                ? ctx.session.subjects
                                : await getSubjects(request, ctx.session.user.groupHubId)

                        ctx.session.subjects = subjects

                        const amount = subjects.length
                        if (amount > 0) {
                            ctx.reply('По какому предмету?',
                                Markup.keyboard(subjects.concat('Отмена'), { columns: 3 })
                                    .resize().extra()
                            )
                            ctx.session.cabinet.subjects = subjects
                            ctx.session.cabinet.nextCondition = 'subject'
                        } else {
                            ctx.reply('Твои предметы мне почему-то неизвестны.')
                        }
                    } catch(e) {
                        ctx.state.error(e)
                    }

                } else ctx.reply('Загружать лекции нужно еще заслужить')
                break
            }
            case 'Сменить семестр':
                if (ctx.session.semester) {
                    const currSemester = ctx.session.semester,
                        newSemester = (currSemester + 1) % 3

                    ctx.session.semester = newSemester ? newSemester : 1
                    ctx.reply(`Ты благополучно покинул ${currSemester}-й семестр, `+ 
                        `сменив его на ${ctx.session.semester}-й`)
                } else {
                    ctx.reply('Нет, так дело не пйдет. Попробуй другую группу')
                }
                break
            case 'Кто я?':
                let answer = ''
                if (ctx.session.user.group)
                    answer += `Твоя родина - <b>${ctx.session.user.group.toUpperCase()}.</b> `
                else {
                    answer += 'Ты не с КПИ. '
                }
                if (ctx.session.user.group !== ctx.session.group && 
                    ctx.session.group && ctx.session.semester) {
                    answer += `Но сейчас ты в гостях у <b>${ctx.session.group.toUpperCase()}</b> ` +
                        `в ${ctx.session.semester}-ом семестре.`
                } else if (ctx.session.semester) {
                    answer += ` Сейчас ты в ${ctx.session.semester}-ом семестре. `+
                        `Может, хочешь зайти к кому-то в гости?`
                } else {
                    answer += ' Если хочешь, выбери себе группу для визита'
                }
                if (ctx.session.group && !ctx.session.groupHubId) {
                    answer += ' И расписания по твоей текущей группе нет (можешь попробовать обновить ее)'
                }

                ctx.replyWithHTML(answer)
                break
            case 'Назад':
                ctx.reply('Ну ладно', ctx.state.homeMarkup)
                ctx.session.cabinet = null
                break
            default:
                ctx.reply('Выбери что-то')
        }

        ctx.state.saveSession()
    })

    router.on('changeGroup', async ctx => {
        if (ctx.state.btnVal === 'Назад') {
            ctx.session.cabinet = null
            ctx.reply('В другой раз', ctx.state.homeMarkup)
        } else {
            const group = ctx.message.text.trim().toLowerCase(),
                groupInfo = await validGroup(group)

            if (groupInfo.who !== 'kpi' && groupInfo.who !== 'primat') {
                return ctx.reply('Впервые вижу такую группу. Попробуй еще')
            }

            ctx.session.cabinet = null
            Object.assign(ctx.session, groupInfo.values)
            const answer = groupInfo.values.groupHubId
                ? 'Все готово'
                : 'Добро пожаловать, но расписания по этой группе нет :c'
            ctx.reply(answer, ctx.state.homeMarkup)
        }
        ctx.state.saveSession()
    })

    router.on('subject', ctx => {
        if (ctx.state.btnVal === 'Отмена') {
            ctx.session.cabinet = null
            ctx.state.saveSession()
            return ctx.reply('Возвращайся скорее!', ctx.state.homeMarkup)
        }

        if (ctx.session.cabinet.subjects.includes(ctx.state.btnVal)) {
            ctx.session.cabinet.subject = ctx.state.btnVal
            ctx.session.cabinet.nextCondition = 'upload'
            ctx.reply('Понял-принял. Скидывай свой файл с лекцией', Markup.keyboard(['Отмена'])
                .resize().extra()
            )
        } else {
            ctx.reply('Не нахожу такого предмета :c')
        }
        
        ctx.state.saveSession()
    })

    // this router triggers only when user has sent text message instead of document
    router.on('upload', ctx => {
        if (ctx.state.btnVal === 'Отмена') {
            ctx.session.cabinet = null
            ctx.state.saveSession()
            ctx.reply('Очень жаль, я так люблю читать ваши лекции :c', ctx.state.homeMarkup)
        } else {
            ctx.reply('Ну мне сложно принять это за файл')
        }
    })

    // this router triggers only when user has sent text message instead of photo
    router.on('photo', ctx => {
        if (ctx.state.btnVal === 'Отмена') {
            ctx.session.cabinet = null
            ctx.state.saveSession()
            ctx.reply('Очень жаль, я так люблю читать ваши лекции :c', ctx.state.homeMarkup)
        } else {
            ctx.reply('Фотография выглядит как изображение, если что')
        }  
    })

    return router.middleware()
}

async function getSubjects(request, groupId) {
    const response = await request(encodeURI(`${config.hub_groups_url}${groupId}/timetable`))
    const timetable = JSON.parse(response.body).data
        weeks = [1, 2],
        days = [1, 2, 3, 4, 5, 6],
        nums = [1, 2, 3, 4, 5],
        subjects = []

  weeks.forEach(week => days.forEach(day => {
    const lessons = timetable[week][day]
    if (lessons) {
      nums.forEach(i => {
        const lesson = lessons[i]
        if (lesson) {
          const subject = lesson.discipline.name
          if (!subjects.includes(subject)) {
            subjects.push(subject)
          }
        }
      })
    }
  }))

  return subjects
}