<template>
  <div class="">
    <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800 pb-5">
      <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap">
        <div class="ml-4 mt-2">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white pt-2">Balances</h3>

          <div v-if="credentials">
            <div v-if="lastRefreshed && accounts">
              <span class="text-gray-400 text-xs">Last updated {{ lastRefreshed }} - <a class="underline cursor-pointer" @click="refreshAccounts">Refresh</a></span>
            </div>

            <div v-else>
              <span class="text-gray-400 text-xs">Updating...</span>
            </div>
          </div>
        </div>
        <div class="ml-4 mt-2 flex-shrink-0 pt-2">
          <button
            type="button"
            class="relative inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black dark:bg-gray-700 hover:bg-gray-800 focus:outline-none"
            @click="startTrueLayerAuth"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ReturnedAccount, Credential } from "../services/interfaces";

export default Vue.extend({
  data() {
    return {
      lastRefreshed: undefined,
    };
  },

  computed: {
    lastRefreshedAt(): string {
      return this.$store.getters.lastRefreshedAt;
    },
    accounts(): ReturnedAccount[] {
      return this.$store.getters.allAccounts;
    },
    credentials(): Credential[] {
      return this.$store.getters.allCredentials;
    },
  },

  watch: {
    lastRefreshedAt(newValue: string): void {
      this.updateLocalRefreshedAt(newValue);
    },
  },

  mounted(): void {
    // Keep the "last updated at" reactive.
    this.updateLocalRefreshedAt(this.lastRefreshedAt);
    setInterval(() => {
      this.updateLocalRefreshedAt(this.lastRefreshedAt);
    }, 5000);
  },

  methods: {
    updateLocalRefreshedAt(value: string): void {
      this.lastRefreshed = this.$moment(value).fromNow();
    },

    async startTrueLayerAuth(): Promise<void> {
      this.$electron.shell.openExternal(
        `https://auth.truelayer.com/?response_type=code&client_id=${this.$store.getters.truelayerClientId}&scope=info%20accounts%20balance%20cards%20offline_access&redirect_uri=balancebar://oauth&providers=uk-ob-all%20uk-oauth-all%20uk-cs-mock`
      );
    },

    refreshAccounts(): void {
      this.$store.dispatch("refreshAccounts");
    },
  },
});
</script>
