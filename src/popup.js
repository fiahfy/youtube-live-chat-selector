import Vue from 'vue'
import vuetify from './plugins/vuetify'
import PopupPage from './components/PopupPage'
import createStore from './store'

createStore().then((store) => {
  new Vue({
    el: '#app',
    store,
    components: { PopupPage },
    template: '<PopupPage />',
    vuetify
  })
})
