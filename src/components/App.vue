<script setup lang="ts">
import { computed } from 'vue'
import { Settings } from '~/models'
import { useStore } from '~/store'

const store = useStore()

const enabledTypes = computed({
  get: () =>
    (
      Object.keys(store.state.settings.types) as (keyof Settings['types'])[]
    ).filter((type) => store.state.settings.types[type]),
  set: (value) => {
    const types = (
      Object.keys(store.state.settings.types) as (keyof Settings['types'])[]
    ).reduce((carry, type) => {
      return {
        ...carry,
        [type]: value.includes(type),
      }
    }, {} as Settings['types'])
    store.commit('settings/setTypes', { types })
  },
})

const handleClickReset = () => store.commit('settings/reset')
</script>

<template>
  <v-app>
    <v-main class="fill-height">
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-switch
              v-model="enabledTypes"
              label="Guest"
              value="guest"
              color="primary"
              density="compact"
              hide-details
            />
            <v-switch
              v-model="enabledTypes"
              color="primary"
              density="compact"
              hide-details
              label="Member"
              value="member"
            />
            <v-switch
              v-model="enabledTypes"
              color="primary"
              density="compact"
              hide-details
              label="Moderator"
              value="moderator"
            />
            <v-switch
              v-model="enabledTypes"
              color="primary"
              density="compact"
              hide-details
              label="Owner"
              value="owner"
            />
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="enabledTypes"
              color="primary"
              density="compact"
              hide-details
              label="Super Chat"
              value="super-chat"
            />
            <v-switch
              v-model="enabledTypes"
              color="primary"
              density="compact"
              hide-details
              label="Super Sticker"
              value="super-sticker"
            />
            <v-switch
              v-model="enabledTypes"
              color="primary"
              density="compact"
              hide-details
              label="Membership"
              value="membership"
            />
          </v-col>
        </v-row>
        <v-btn
          block
          class="mt-3"
          size="small"
          variant="contained-text"
          @click="handleClickReset"
        >
          Reset
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
html {
  overflow-y: hidden;
}
</style>

<style lang="scss" scoped>
.v-application {
  min-width: 350px;
}
</style>
