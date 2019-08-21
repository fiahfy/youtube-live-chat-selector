import browser from 'webextension-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersistence({
  storage: browser.storage.local,
  asyncStorage: true,
  restoreState: async (key, storage) => {
    const result = await storage.get(key)
    const json = result[key]

    let state = {}
    try {
      state = JSON.parse(json)
    } catch (e) {} // eslint-disable-line no-empty

    return {
      ...state,
      __storageReady: true
    }
  },
  saveState: async (key, state, storage) => {
    const json = JSON.stringify(state)
    await storage.set({ [key]: json })
  }
})

const initialState = {
  types: {
    guest: false,
    member: false,
    moderator: true,
    owner: true,
    super_chat: false,
    super_sticker: false,
    membership: false
  }
}

const config = {
  state: {
    ...initialState
  },
  getters: {
    types(state) {
      return Object.entries(state.types)
        .filter(([, v]) => v)
        .map(([k]) => k)
    }
  },
  mutations: {
    setTypes(state, { types }) {
      state.types = types
    },
    resetState(state) {
      for (let [k, v] of Object.entries(initialState)) {
        state[k] = v
      }
    }
  },
  actions: {
    setTypes({ commit }, { types }) {
      const newTypes = Object.keys(initialState.types).reduce(
        (carry, type) => ({ ...carry, [type]: types.includes(type) }),
        {}
      )
      commit('setTypes', { types: newTypes })
    }
  },
  plugins: [
    vuexPersist.plugin,
    (store) => {
      store.subscribe(() => {
        browser.runtime.sendMessage({ id: 'settingsChanged' })
      })
    }
  ]
}

export default function createStore(waitStorageReady = false) {
  return new Promise((resolve) => {
    const store = new Vuex.Store(config)
    if (!waitStorageReady) {
      resolve(store)
      return
    }
    // wait for async storage restore
    // @see https://github.com/championswimmer/vuex-persist/issues/15
    const timeout = Date.now() + 1000
    const timer = setInterval(() => {
      if (store.state.__storageReady || Date.now() > timeout) {
        clearInterval(timer)
        resolve(store)
      }
    }, 100)
  })
}
