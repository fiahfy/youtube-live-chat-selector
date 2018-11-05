<template>
  <v-app>
    <v-content>
      <v-container
        class="pa-0"
        fluid
      >
        <v-list>
          <v-subheader class="grey--text text--darken-1">AUTHOR</v-subheader>
          <v-list-tile
            v-for="room in rooms"
            :key="room.id"
            active-class=""
          >
            <v-list-tile-content>
              <v-text-field
                class="my-2 pt-0 xs12"
                placeholder="Author"
        single-line
        hide-details
              ></v-text-field>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-layout>
                <v-btn
                  class="ma-0"
                  flat
                  icon
                >
                  <v-icon>chat_bubble</v-icon>
                </v-btn>
                <v-btn
                  class="ma-0"
                  flat
                  icon
                >
                  <v-icon>chat_bubble</v-icon>
                </v-btn>
              </v-layout>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile
            @click=""
          >
            <v-list-tile-action>
              <v-icon color="grey darken-1">add_circle_outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-title class="grey--text text--darken-1">New room</v-list-tile-title>
          </v-list-tile>
        </v-list>
        <v-btn
          class="mt-3"
          color="primary"
          flat
          block
          @click="reset"
        >Reset</v-btn>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      rooms: [{id:1}]
    }
  },
  computed: {
    color: {
      get() {
        return this.$store.state.settings.color
      },
      set(value) {
        this.$store.commit('settings/setColor', { color: value })
      }
    },
    memberColor: {
      get() {
        return this.$store.state.settings.memberColor
      },
      set(value) {
        this.$store.commit('settings/setMemberColor', { memberColor: value })
      }
    },
    moderatorColor: {
      get() {
        return this.$store.state.settings.moderatorColor
      },
      set(value) {
        this.$store.commit('settings/setModeratorColor', {
          moderatorColor: value
        })
      }
    },
    ownerColor: {
      get() {
        return this.$store.state.settings.ownerColor
      },
      set(value) {
        this.$store.commit('settings/setOwnerColor', { ownerColor: value })
      }
    },
    paidColor: {
      get() {
        return this.$store.state.settings.paidColor
      },
      set(value) {
        this.$store.commit('settings/setPaidColor', { paidColor: value })
      }
    },
    textShadow: {
      get() {
        return this.$store.state.settings.textShadow
      },
      set(value) {
        this.$store.commit('settings/setTextShadow', { textShadow: value })
      }
    },
    opacity: {
      get() {
        return this.$store.state.settings.opacity
      },
      set(value) {
        this.$store.commit('settings/setOpacity', { opacity: value })
      }
    },
    rows: {
      get() {
        return this.$store.state.settings.rows
      },
      set(value) {
        this.$store.commit('settings/setRows', { rows: value })
      }
    },
    speed: {
      get() {
        return this.$store.state.settings.speed
      },
      set(value) {
        this.$store.commit('settings/setSpeed', { speed: value })
      }
    },
    overflow: {
      get() {
        return { value: this.$store.state.settings.overflow }
      },
      set(value) {
        this.$store.commit('settings/setOverflow', { overflow: value.value })
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('initialize')
  },
  methods: {
    close() {
      window.close()
    },
    ...mapActions({
      reset: 'reset'
    })
  }
}
</script>

<style>
@import '~vuetify/dist/vuetify.min.css';
</style>

<style scoped>
.application {
  min-width: 480px;
}
.color >>> .v-input__slot:before {
  height: 0;
}
.color >>> .v-input__slot:after {
  height: 0;
}
.color >>> input {
  cursor: pointer;
  height: 32px;
  padding: 0;
}
</style>
