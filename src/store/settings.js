export const defaults = {
  authorFilters: [],
  messageFilters: []
}

export default {
  namespaced: true,
  state: {
    ...defaults
  },
  mutations: {
    addAuthorFilter(state) {
      const id = state.authorFilters.reduce((carry, filter) => {
        return Math.max(carry, filter.id)
      }, 0)
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
    toggleAuthorFilterRegExp(state, { id }) {
      state.authorFilters = state.authorFilters.map((filter) => {
        if (filter.id === id) {
          filter.regExp = !filter.regExp
        }
        return filter
      })
    }
  }
}
