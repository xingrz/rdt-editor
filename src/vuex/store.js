import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  source: localStorage.getItem('content'),
  offset: 0,
  selection: { start: 0, end: 0 }
}

const mutations = {
  SYNC (state, source) {
    state.source = source
  },
  SCROLL (state, offset) {
    state.offset = offset
  },
  SELECT (state, selection) {
    state.selection = selection
  }
}

const middlewares = [
  {
    onMutation (mutation, { source }) {
      localStorage.setItem('content', source)
    }
  }
]

export default new Vuex.Store({
  state,
  mutations,
  middlewares
})
