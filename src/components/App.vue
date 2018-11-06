<template>
  <v-app>
    <v-content>
      <v-container
        class="pa-0"
        fluid
      >
        <v-layout>
          <v-flex xs6>
            <author-filter-list />
          </v-flex>
          <v-flex xs6>
            <v-list>
              <v-subheader class="grey--text text--darken-1">MESSAGE</v-subheader>
              <v-list-tile
                v-for="filter in messageFilters"
                :key="filter.id"
              >
                <v-list-tile-content>
                  <v-text-field
                    class="my-2 pt-0 xs12"
                    placeholder="Message or match pattern"
                    single-line
                    hide-details
                  />
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-layout>
                    <v-btn
                      class="ma-1 regexp"
                      color="grey darken-1"
                      flat
                      icon
                      title="Regular Expression"
                    >
                      Re
                    </v-btn>
                    <v-btn
                      class="ma-1"
                      color="grey darken-1"
                      flat
                      icon
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-layout>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile @click="">
                <v-list-tile-action>
                  <v-icon color="grey darken-1">add_circle_outline</v-icon>
                </v-list-tile-action>
                <v-list-tile-title class="grey--text text--darken-1">Add filter</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import AuthorFilterList from './AuthorFilterList'

export default {
  components: {
    AuthorFilterList
  },
  computed: {
    ...mapState('settings', ['authorFilters', 'messageFilters'])
  },
  watch: {
    authorFilters(value, oldValue) {
      if (value.length > oldValue.length) {
        this.$nextTick(() => {
          window.scrollTo(0, document.body.scrollHeight)
        })
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('initialize')
  }
}
</script>

<style>
@import '~vuetify/dist/vuetify.min.css';
</style>

<style scoped>
.application {
  min-width: 640px;
}
</style>
