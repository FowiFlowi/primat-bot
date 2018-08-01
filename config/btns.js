const settings = require('./settings')

const back = '🔙 Назад'
const setGroup = '📲 Взять группу для визита'
const kpiInternets = '📡 КПИшные интернеты'
const abitInternets = '📡 Абитурные интернеты'
const schedule = '📇 Расписание'
const timeleft = '🕐 Время до конца пары'
const settingsMessages = {
  scheduleLocationShowing: 'Показывать местоположение корпусов под расписанием',
  abstractSubscriber: 'Присылать уведомления о новых лекциях',
}

module.exports = {
  home: {
    student: {
      cabinet: '💼 Кабинет',
      teachers: '👨‍🏫 Мои преподаватели',
      abstracts: '📝 Лекции',
      timeleft,
      schedule,
      kpiInternets,
    },
    abiturient: {
      location: '🏠 Местоположение корпуса',
      studentUpgrade: '🚀 Апргрейд до студента',
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
      timeleft,
      kpiInternets,
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
    settings: '⚙️ Настройки',
    back,
  },
  settings: {
    on: {
      [settings.scheduleLocationShowing]: `❌ ${settingsMessages[settings.scheduleLocationShowing]}`,
      [settings.abstractSubscriber]: `❌ ${settingsMessages[settings.abstractSubscriber]}`,
    },
    off: {
      [settings.scheduleLocationShowing]: `☑️ ${settingsMessages[settings.scheduleLocationShowing]}`,
      [settings.abstractSubscriber]: `☑️ ${settingsMessages[settings.abstractSubscriber]}`,
    },
  },
  telegraph: {
    authUrl: '🔗 Линк для авторизации',
    info: 'ℹ️ Информация',
    back,
  },
  cancel: '❌ Отмена',
  loadLecture: '📤 Загрузить лекцию',
  all: '📚 Все',
  yes: '✅ Да',
  no: '❌ Нет',
  next: '➡️ Далее',
  ph: '📠 Телеграф',
  domoi: '🏠 Домой',
  myLectures: '👨‍🔬 Мои лекции',
  back,
  kpiInternets,
  abitInternets,
}
