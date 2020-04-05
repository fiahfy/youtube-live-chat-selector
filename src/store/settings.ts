import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import Settings, { AuthorType } from '~/models/settings'

const initialState: Settings = {
  enableTypes: [
    'guest',
    'member',
    'moderator',
    'owner',
    'super_chat',
    'super_sticker',
    'membership',
  ],
}

@Module({ name: 'settings' })
export default class SettingsModule extends VuexModule {
  enableTypes = initialState.enableTypes

  @Mutation
  setEnableTypes({ enableTypes }: { enableTypes: AuthorType[] }) {
    this.enableTypes = enableTypes
  }
  @Mutation
  reset() {
    for (const [k, v] of Object.entries(initialState)) {
      ;(this as any)[k] = v // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }
}
