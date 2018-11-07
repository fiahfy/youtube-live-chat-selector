<template>
  <v-list class="message-filter-list">
    <v-subheader class="grey--text text--darken-1">MESSAGE</v-subheader>
    <message-filter-list-item
      v-for="filter of messageFilters"
      :key="filter.id"
      :filter="filter"
    />
    <v-list-tile @click="addMessageFilter">
      <v-list-tile-action>
        <v-icon color="grey darken-1">add_circle_outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-title class="grey--text text--darken-1">Add filter</v-list-tile-title>
    </v-list-tile>
  </v-list>
</template>


<script>
import { mapMutations, mapState } from 'vuex'
import MessageFilterListItem from './MessageFilterListItem'

export default {
  components: {
    MessageFilterListItem
  },
  computed: {
    ...mapState('settings', ['messageFilters'])
  },
  methods: {
    ...mapMutations('settings', ['addMessageFilter'])
  }
}
</script>
