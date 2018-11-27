import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vuetify'

import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: (operation) => {
    if (!localStorage.getItem('graph-token')) {
      localStorage.setItem('graph-token', '')
    }

    operation.setContext({
      headers: {
        authorization: localStorage.getItem('graph-token')
      }
    })
  },
  onError: ({graphQLErrors, networkError}) => {
    if (networkError) {
      console.log({networkError})
    }

    if (graphQLErrors) {
      for (let error of graphQLErrors) {
        console.log(error)
      }
    }
  }
})
const apolloProvider = new VueApollo({defaultClient})

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    return this.$store.dispatch('getCurrentUser')
  }
}).$mount('#app')