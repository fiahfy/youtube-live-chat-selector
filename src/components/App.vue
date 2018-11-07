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
            <message-filter-list />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import AuthorFilterList from './AuthorFilterList'
import MessageFilterList from './MessageFilterList'

export default {
  components: {
    AuthorFilterList,
    MessageFilterList
  },
  computed: {
    ...mapState('settings', ['authorFilters', 'messageFilters'])
  },
  watch: {
    authorFilters(value, oldValue) {
      if (value.length > oldValue.length) {
        this.scrollToBottm()
      }
    },
    messageFilters(value, oldValue) {
      if (value.length > oldValue.length) {
        this.scrollToBottm()
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('initialize')
  },
  methods: {
    scrollToBottm() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
    }
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
