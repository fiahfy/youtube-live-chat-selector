import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { Settings, Types } from '~/models'

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

@Module({ name: 'settings' })
export default class SettingsModule extends VuexModule {
  types = initialState.types

  @Mutation
  setTypes({ types }: { types: Types }): void {
    this.types = types
  }
  @Mutation
  reset(): void {
    for (const [k, v] of Object.entries(initialState)) {
      ;(this as any)[k] = v // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }
}
