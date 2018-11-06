<template>
  <v-list>
    <v-subheader class="grey--text text--darken-1">AUTHOR</v-subheader>
    <v-list-tile
      v-for="filter in authorFilters"
      :key="filter.id"
    >
      <v-list-tile-content>
        <v-text-field
          class="my-2 pt-0 xs12"
          placeholder="Author or match pattern"
          single-line
          hide-details
        />
      </v-list-tile-content>
      <v-list-tile-action>
        <v-layout>
          <v-btn
            :color="getIconColor(filter)"
            class="ma-1 regexp"
            flat
            icon
            title="Regular Expression"
            @click="toggleAuthorFilterRegExp({ id: filter.id })"
          >
            Re
          </v-btn>
          <v-btn
            class="ma-1"
            color="grey darken-1"
            flat
            icon
            @click="removeAuthorFilter({ id: filter.id })"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </v-layout>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile @click="addAuthorFilter">
      <v-list-tile-action>
        <v-icon color="grey darken-1">add_circle_outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-title class="grey--text text--darken-1">Add filter</v-list-tile-title>
    </v-list-tile>
  </v-list>
</template>


<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('settings', ['authorFilters'])
  },
  methods: {
    getIconColor(filter) {
      return filter.regExp ? 'primary' : 'grey darken-1'
    },
    ...mapMutations('settings', [
      'addAuthorFilter',
      'removeAuthorFilter',
      'toggleAuthorFilterRegExp'
    ])
  }
}
</script>

<style scoped>
.v-text-field {
  width: 100%;
}
.regexp {
  text-transform: none;
}
</style>
