<template>
  <v-app>
    <v-content>
      <v-container class="pa-0" fluid>
        <v-card class="pa-5" flat>
          <v-switch
            v-model="enabled"
            class="mt-0"
            label="Enabled on this tab"
          />
          <v-subheader class="pl-0">Visible Messages</v-subheader>
          <v-row>
            <v-col cols="6" class="py-0">
              <v-switch
                v-model="types"
                label="Guest"
                value="guest"
                hide-details
                :disabled="!enabled"
              />
              <v-switch
                v-model="types"
                label="Member"
                value="member"
                hide-details
                :disabled="!enabled"
              />
              <v-switch
                v-model="types"
                label="Moderator"
                value="moderator"
                hide-details
                :disabled="!enabled"
              />
              <v-switch
                v-model="types"
                label="Owner"
                value="owner"
                hide-details
                :disabled="!enabled"
              />
            </v-col>
            <v-col cols="6" class="py-0">
              <v-switch
                v-model="types"
                label="Super Chat"
                value="superChat"
                hide-details
                :disabled="!enabled"
              />
              <v-switch
                v-model="types"
                label="Super Sticker"
                value="superSticker"
                hide-details
                :disabled="!enabled"
              />
              <v-switch
                v-model="types"
                label="Membership"
                value="membership"
                hide-details
                :disabled="!enabled"
              />
            </v-col>
          </v-row>
          <v-btn class="mt-5" depressed block @click="onResetClick">
            Reset Settings to Default
          </v-btn>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { browser } from 'webextension-polyfill-ts'
import { settingsStore } from '~/store'

@Component
export default class Popup extends Vue {
  enabled = false

  get types() {
    return settingsStore.visibleTypes
  }
  set types(value) {
    settingsStore.setVisibleTypes({
      types: value
    })
  }

  @Watch('enabled')
  onEnabledChanged(value: boolean) {
    browser.runtime.sendMessage({
      id: 'enabledChanged',
      data: { enabled: value }
    })
  }

  async created() {
    const { enabled } = await browser.runtime.sendMessage({ id: 'popupLoaded' })
    this.enabled = enabled
  }

  onResetClick() {
    settingsStore.resetState()
  }
}
</script>

<style lang="scss" scoped>
.v-application {
  min-width: 380px;
}
.v-input ::v-deep {
  .v-input--selection-controls__input {
    margin-right: 16px;
  }
  .v-input >>> .v-label {
    font-size: 14px;
  }
}
</style>
