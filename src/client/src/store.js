import Vue from 'vue';
import Vuex from 'vuex';
import {defaultClient as apolloClient} from './main';
import {GET_POSTS, LOGIN, REGISTER, GET_CURRENT_USER} from '../queries';
import router from './router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false,
    user: null,
    error: null,
    authError: null
  },
  mutations: {
    getPosts(state, posts) {
      state.posts = posts;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
    setAuthError(state, error) {
      state.authError = error;
    },
  },
  actions: {
    getPosts({commit}) {
      commit('setLoading', true);
      apolloClient.query({query: GET_POSTS})
        .then(({data}) => {
          commit('getPosts', data.getPosts);
          commit('setLoading', false);
        })
        .catch(error => {
          commit('setLoading', false);
          console.error(error);
        })
    },
    registerUser({commit}, payload) {
      commit('clearError');
      commit('setLoading', true);
      apolloClient.mutate({
        mutation: REGISTER,
        variables: payload
      })
        .then(({data}) => {
          localStorage.setItem('graph-token', data.register.token);
          router.go()
        })
        .catch((error) => {
          commit('setLoading', false);
          commit('setError', error);
          console.error(error);
        });
    },
    setUser({commit}, payload) {
      commit('clearError');
      commit('setLoading', true);
      apolloClient.mutate({
        mutation: LOGIN,
        variables: payload
      })
        .then(({data}) => {
          localStorage.setItem('graph-token', data.login.token);
          router.go();
        })
        .catch((error) => {
          commit('setLoading', false);
          commit('setError', error);
          console.error(error);
        });
    },
    getCurrentUser({commit}) {
      commit('setLoading', true);
      apolloClient.query({query: GET_CURRENT_USER})
        .then(({data}) => {
          commit('setUser', data.getCurrentUser);
          commit('setLoading', false);
        })
        .catch(error => {
          console.error(error);
          commit('setLoading', false);
        })
    },
    async clearUser({commit}) {
      commit('clearUser');
      await apolloClient.resetStore();
      router.push('/');
    }
  },
  getters: {
    posts: (state) => state.posts,
    loading: (state) => state.loading,
    user: (state) => state.user,
    error: (state) => state.error,
    authError: (state) => state.authError
  }
});
