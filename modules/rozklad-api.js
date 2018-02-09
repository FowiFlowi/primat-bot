const { request } = require('./utils'),
      config = require('../config')

class Rozklad {
  constructor() {
    this.apiRoot = config.rozklad_api_root

    this.r = async (path, params = {}) => {
      const names = Object.keys(params)

      if (names.length > 1)
        throw new Error(`Too much params: [${names.join(', ')}]`)

      if (names.find(name => !['filter', 'search'].includes(name)))
        throw new Error(`Wrong parameter`)

      params = names.map(name => `${name}=${JSON.stringify(params[name])}`)
                    .join('&')

      const url = encodeURI(`${this.apiRoot}${path}/?${params}`)
      const { body } = await request(url)
      try {
        return JSON.parse(body).data  
      } catch(e) {
        console.log(body)
        console.error(e)
        return null
      }
    }
  }

  async group(arg) {
    return !arg ? await this.r('groups')
      : typeof arg === 'object'
        ? await this.r('groups', arg)
        : await this.r(`groups/${arg}`)
  }

  async teacher(name) {
    return await this.r(`teachers/${name}`)
  }

  async lessons(id, params) {
    if (!id)
      throw new Error("Group id doens't specified")

    return params
      ? await this.r(`groups/${id}/lessons`, { filter: params })
      : await this.r(`groups/${id}/timetable`)
  }

  async teacherLessons(name) {
    if (!name)
      throw new Error("Teacher name doesn't specified")

    return await this.r(`teachers/${name}/lessons`)
  }

  async groupTeachers(id) {
    if (!id)
      throw new Error("Group id doesn't specified")

    return await this.r(`groups/${id}/teachers`)
  }

  async currWeek() {
    return await this.r('weeks')
  }
}

module.exports = Rozklad