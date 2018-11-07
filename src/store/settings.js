export const defaults = {
  authorFilters: [],
  messageFilters: []
}

export default {
  namespaced: true,
  state: {
    ...defaults
  },
  getters: {
    getAuthorFilter(state) {
      return ({ id }) => {
        return state.authorFilters.find((filter) => filter.id === id)
      }
    },
    getMessageFilter(state) {
      return ({ id }) => {
        return state.messageFilters.find((filter) => filter.id === id)
      }
    }
  },
  mutations: {
    addAuthorFilter(state) {
      const id =
        Math.max.apply(null, [
          0,
          ...state.authorFilters.map((filter) => filter.id)
        ]) + 1
      state.authorFilters = [
        ...state.authorFilters,
        {
          id: id + 1
        }
      ]
    },
    removeAuthorFilter(state, { id }) {
      state.authorFilters = state.authorFilters.filter(
        (filter) => filter.id !== id
      )
    },
    setAuthorFilterValue(state, { id, value }) {
      state.authorFilters = state.authorFilters.slice().map((filter) => {
        if (filter.id !== id) {
          return filter
        }
        return {
          ...filter,
          value
        }
      })
    },
    toggleAuthorFilterRegExp(state, { id }) {
      state.authorFilters = state.authorFilters.map((filter) => {
        if (filter.id !== id) {
          return filter
        }
        return {
          ...filter,
          regExp: !filter.regExp
        }
      })
    },
    addMessageFilter(state) {
      const id =
        Math.max.apply(null, [
          0,
          ...state.messageFilters.map((filter) => filter.id)
        ]) + 1
      state.messageFilters = [
        ...state.messageFilters,
        {
          id: id + 1
        }
      ]
    },
    removeMessageFilter(state, { id }) {
      state.messageFilters = state.messageFilters.filter(
        (filter) => filter.id !== id
      )
    },
    setMessageFilterValue(state, { id, value }) {
      state.messageFilters = state.messageFilters.slice().map((filter) => {
        if (filter.id !== id) {
          return filter
        }
        return {
          ...filter,
          value
        }
      })
    },
    toggleMessageFilterRegExp(state, { id }) {
      state.messageFilters = state.messageFilters.map((filter) => {
        if (filter.id !== id) {
          return filter
        }
        return {
          ...filter,
          regExp: !filter.regExp
        }
      })
    }
  }
}
