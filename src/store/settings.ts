import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Settings from '~/models/settings'

const initialState = {
  types: {
    guest: false,
    member: false,
    moderator: true,
    owner: true,
    superChat: false,
    superSticker: false,
    membership: false
  }
}

@Module({ name: 'settings' })
export default class SettingsModule extends VuexModule {
  types = initialState.types

  get visibleTypes() {
    return Object.entries(this.types)
      .filter(([, v]) => v)
      .map(([k]) => k)
  }

  @Mutation
  setTypes({ types }: { types: Settings['types'] }) {
    this.types = types
  }
  @Mutation
  resetState() {
    for (const [k, v] of Object.entries(initialState)) {
      ;(this as any)[k] = v // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }

  @Action
  setVisibleTypes({ types }: { types: string[] }) {
    const newTypes = Object.keys(initialState.types).reduce(
      (carry, type) => ({ ...carry, [type]: types.includes(type) }),
      {}
    ) as Settings['types']
    this.setTypes({ types: newTypes })
  }
}
