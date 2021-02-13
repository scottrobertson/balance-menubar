<template>
  <div>
    <li class="p-5 flex hover:bg-white dark:hover:bg-gray-900">
      <img class="h-10 w-10" :src="credential.provider.logo_uri" alt="" />
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-900 dark:text-white">
          {{ credential.provider.display_name }}
        </p>
        <div v-if="credential.consent_created_at" class="text-xs dark:text-white">
          <div>Connected {{ credential.consent_created_at | moment("from") }}</div>
          <div>Expires {{ credential.consent_expires_at | moment("from") }}</div>
        </div>
        <a class="underline cursor-pointer text-xs text-gray-500 dark:text-gray-300" @click="disconnectCredential()"> Disconnect </a> -
        <a class="underline cursor-pointer text-xs text-gray-500 dark:text-gray-300" @click="toggleDebugData()"> {{ debug ? "Hide" : "Show" }} Debug Info </a>
      </div>
    </li>

    <div v-if="debug" class="ml-5 mb-3 bg-gray-50 p-5 dark:bg-gray-800 dark:text-gray-100">
      <p>This is used by TrueLayer for them to debug issues. Do not sure it publically.</p>
      <div v-if="debugError" class="mt-3">Unable to fetch debug info.</div>
      <pre class="mt-3 text-sm">{{ debug }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { fetchDebug } from "../services/truelayer";
import { getAccessToken } from "../services/secure-storage";
import { Credential } from "../services/interfaces";

export default Vue.extend({
  props: {
    credential: {
      type: Object as PropType<Credential>,
      required: true,
    },
  },

  data() {
    return {
      debug: undefined,
      debugError: false,
    };
  },

  methods: {
    async disconnectCredential(): Promise<void> {
      await this.$store.dispatch("deleteCredential", this.credential);
      await this.$store.dispatch("refreshAccounts");
    },
    async toggleDebugData(): Promise<void> {
      if (this.debug) {
        this.debug = undefined;
        this.debugError = false;
      } else {
        const accessToken = await getAccessToken(this.credential);

        if (accessToken) {
          this.debug = "Requesting debug info...";

          try {
            this.debug = await fetchDebug(accessToken);
          } catch (e) {
            this.debug = e.error;
            this.debugError = true;
          }
        } else {
          this.debugError = true;
        }
      }
    },
  },
});
</script>
