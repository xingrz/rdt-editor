import Vue from 'vue'
import App from './components/App.vue'

import store from './vuex/store'

new Vue({
  el: 'body',
  components: { App },
  store
})
