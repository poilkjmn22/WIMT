import { formatBusField, formatMoney } from './format.js'
import Vue from 'vue'

Vue.mixin({
  methods: Object.assign(
    {},
    {
      formatBusField,
      formatMoney,
      localeField(val) {
        let res = `${val === 0 || val === false || val ? val : '--'}`
        if (/[\u4e00-\u9fa5]+/.test(val) && this.$store.getters.locale !== 'zh') {
          res = this.$i18n.t(`fieldValue.${val}`)
        }
        return res
      }
    }
  )
})
