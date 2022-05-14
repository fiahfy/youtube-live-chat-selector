import { Module } from 'vuex'
import { Settings } from '~/models'
import { State as RootState } from '~/store'

export type State = Settings

const initialState: Settings = {
  types: {
    guest: true,
    member: true,
    moderator: true,
    owner: true,
    'super-chat': true,
    'super-sticker': true,
    membership: true,
  },
}

export const module: Module<State, RootState> = {
  namespaced: true,
  state: () => ({ types: { ...initialState.types } }),
  mutations: {
    setTypes(state, { types }: { types: Settings['types'] }) {
      state.types = types
    },
    reset(state) {
      state.types = { ...initialState.types }
    },
  },
}
