import { nextTick } from 'vue'
import { renderKatex } from '../composables/useKaTeX.js'

export const vKatex = {
  mounted(el) {
    nextTick(() => renderKatex(el))
  },
  updated(el) {
    nextTick(() => renderKatex(el))
  }
}
