<template>
  <v-list-tile
    class="author-filter-list-item"
  >
    <v-list-tile-content>
      <v-text-field
        v-model="value"
        class="my-2 pt-0"
        placeholder="Author or match pattern"
        single-line
        hide-details
      />
    </v-list-tile-content>
    <v-list-tile-action>
      <v-layout>
        <!-- <v-btn
          :color="iconColor"
          class="ma-1 regexp"
          flat
          icon
          title="Regular Expression"
          @click="onRegExpIconClick"
        >
          Re
        </v-btn> -->
        <v-btn
          class="ma-1"
          color="grey darken-1"
          flat
          icon
          @click="onDeleteIconClick"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-layout>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    filter: {
      type: Object,
      required: true
    }
  },
  computed: {
    value: {
      get() {
        return this.getAuthorFilter({ id: this.filter.id }).value
      },
      set(value) {
        this.setAuthorFilterValue({
          id: this.filter.id,
          value
        })
      }
    },
    iconColor() {
      return this.filter.regExp ? 'primary' : 'grey darken-1'
    },
    ...mapGetters('settings', ['getAuthorFilter'])
  },
  methods: {
    onRegExpIconClick() {
      this.toggleAuthorFilterRegExp({ id: this.filter.id })
    },
    onDeleteIconClick() {
      this.removeAuthorFilter({ id: this.filter.id })
    },
    ...mapMutations('settings', [
      'removeAuthorFilter',
      'setAuthorFilterValue',
      'toggleAuthorFilterRegExp'
    ])
  }
}
</script>

<style scoped>
.v-text-field {
  width: 100%;
}
.v-list__tile__action {
  min-width: auto;
}
.regexp {
  text-transform: none;
}
</style>
