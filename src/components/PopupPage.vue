<template>
  <v-app>
    <v-content>
      <v-container class="pa-0" fluid>
        <v-card class="pa-3" flat>
          <v-switch v-model="enabled" label="Enabled on this tab" />
          <v-subheader class="pl-0">Visibility</v-subheader>
          <v-row>
            <v-col cols="6" class="py-0">
              <v-switch
                v-model="types"
                label="Guest"
                value="guest"
                hide-details
              />
              <v-switch
                v-model="types"
                label="Member"
                value="member"
                hide-details
              />
              <v-switch
                v-model="types"
                label="Moderator"
                value="moderator"
                hide-details
              />
              <v-switch
                v-model="types"
                label="Owner"
                value="owner"
                hide-details
              />
            </v-col>
            <v-col cols="6" class="py-0">
              <v-switch
                v-model="types"
                label="Super Chat"
                value="super_chat"
                hide-details
              />
              <v-switch
                v-model="types"
                label="Super Sticker"
                value="super_sticker"
                hide-details
              />
              <v-switch
                v-model="types"
                label="Membership"
                value="membership"
                hide-details
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

<script>
import browser from 'webextension-polyfill'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      enabled: false
    }
  },
  computed: {
    types: {
      get() {
        return this.$store.state.types
      },
      set(value) {
        this.$store.commit('setTypes', {
          types: value
        })
      }
    }
  },
  watch: {
    enabled(value) {
      browser.runtime.sendMessage({
        id: 'enabledChanged',
        data: { enabled: value }
      })
    }
  },
  async created() {
    const { enabled } = await browser.runtime.sendMessage({ id: 'popupLoaded' })
    this.enabled = enabled
  },
  methods: {
    onResetClick() {
      this.resetState()
    },
    ...mapMutations(['resetState'])
  }
}
</script>

<style scoped>
.v-application {
  min-width: 350px;
}
.v-input >>> .v-input--selection-controls__input {
  margin-right: 16px;
}
.v-input >>> .v-label {
  font-size: 14px;
}
</style>
