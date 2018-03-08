const group = require('./group'),
      course = require('./course'),
      teacher = require('./teacher'),

      { Router } = require('../../modules/utils')

const router = Router('registry', ctx => !ctx.session.registry, ctx => ctx.session.registry.nextCondition)

router.on('group', group)
router.on('course', course)
router.on('teacher', teacher)

module.exports = router.middleware()
