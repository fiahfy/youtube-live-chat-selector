<template>
  <v-list-tile
    class="message-filter-list-item"
  >
    <v-list-tile-content>
      <v-text-field
        v-model="value"
        class="my-2 pt-0"
        placeholder="Message or match pattern"
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
        return this.getMessageFilter({ id: this.filter.id }).value
      },
      set(value) {
        this.setMessageFilterValue({
          id: this.filter.id,
          value
        })
      }
    },
    iconColor() {
      return this.filter.regExp ? 'primary' : 'grey darken-1'
    },
    ...mapGetters('settings', ['getMessageFilter'])
  },
  methods: {
    onRegExpIconClick() {
      this.toggleMessageFilterRegExp({ id: this.filter.id })
    },
    onDeleteIconClick() {
      this.removeMessageFilter({ id: this.filter.id })
    },
    ...mapMutations('settings', [
      'removeMessageFilter',
      'setMessageFilterValue',
      'toggleMessageFilterRegExp'
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
