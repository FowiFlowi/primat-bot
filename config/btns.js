const back = '🔙 Назад'
const setGroup = '📲 Взять группу для визита'
const kpiInternets = '📡 КПИшные интернеты'
const abitInternets = '📡 Абитурные интернеты'
const schedule = '📇 Расписание'

module.exports = {
  home: {
    student: {
      cabinet: '💼 Кабинет',
      timeleft: '🕐 Время до конца пары',
      teachers: '👨‍🏫 Мои преподаватели',
      schedule,
      abstracts: '📝 Лекции',
      kpiInternets,
      // commands: '📃 Команды',
    },
    abiturient: {
      location: '🏠 Местоположение корпуса',
      setGroup,
      abitInternets,
    },
    noKPI: {
      setGroup,
      kpiInternets,
    },
    teacher: {
      setGroup,
      schedule,
    },
    other: {
      returnRole: '↩️ Вернуться к себе',
    },
  },
  greeter: {
    abiturient: '👶 Я абитуриент',
    teacher: '👨‍🏫 Я преподаватель',
    noKPI: '😢 Я не студент КПИ',
  },
  schedule: {
    today: 'Сегодня',
    tomorrow: 'Завтра',
    yesterday: 'Вчера',
    thisWeek: 'Эта неделя',
    nextWeek: 'Следующая неделя',
    whole: 'Все расписание',
    lessons: '📜 Расписание пар',
    back,
  },
  cabinet: {
    changeGroup: '🔀 Поменять группу',
    changeSemester: '🔁 Сменить семестр',
    whoAmI: '👤 Кто я?',
    back,
  },
  cancel: '🗙 Отмена',
  back,
  kpiInternets,
  abitInternets,
}
