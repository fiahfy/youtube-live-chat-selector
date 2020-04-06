<template>
  <v-app>
    <v-content class="fill-height">
      <v-container fluid>
        <div class="d-flex">
          <div class="mr-5">
            <v-switch
              v-model="enabledTypes"
              label="Guest"
              value="guest"
              dense
              class="mt-0"
            />
            <v-switch
              v-model="enabledTypes"
              label="Member"
              value="member"
              dense
              class="mt-0"
            />
            <v-switch
              v-model="enabledTypes"
              label="Moderator"
              value="moderator"
              dense
              class="mt-0"
            />
            <v-switch
              v-model="enabledTypes"
              label="Owner"
              value="owner"
              dense
              class="mt-0"
            />
          </div>
          <div>
            <v-switch
              v-model="enabledTypes"
              label="Super Chat"
              value="super_chat"
              dense
              class="mt-0"
            />
            <v-switch
              v-model="enabledTypes"
              label="Super Sticker"
              value="super_sticker"
              dense
              class="mt-0"
            />
            <v-switch
              v-model="enabledTypes"
              label="Membership"
              value="membership"
              dense
              class="mt-0"
            />
          </div>
        </div>
        <v-btn depressed small block @click="onClickReset">
          Reset
        </v-btn>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { settingsStore } from '~/store'

@Component
export default class Popup extends Vue {
  get enabledTypes() {
    return settingsStore.enabledTypes
  }
  set enabledTypes(value) {
    settingsStore.setEnabledTypes({
      enabledTypes: value,
    })
  }

  onClickReset() {
    settingsStore.reset()
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
html {
  overflow-y: hidden;
}
</style>

<style lang="scss" scoped>
.v-application {
  min-width: 320px;
  .v-content ::v-deep .v-content__wrap {
    overflow-y: auto;
  }
}
</style>
