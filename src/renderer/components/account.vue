<template>
  <li
    class="p-5 flex hover:bg-white dark:hover:bg-gray-900 cursor-pointer"
    :class="{ 'bg-red-100 dark:bg-red-600 hover:bg-red-200 dark:hover:bg-red-500': account.error }"
    @click="account.error ? goToConnections() : copyBalance()"
  >
    <img class="h-10 w-10" :src="account.bank.icon" alt="" />
    <div class="ml-3">
      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ account.bank.name }} - {{ screenshotMode ? "Account Name" : account.name }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-300" :class="{ 'dark:text-white': account.error }">
        <span v-if="screenshotMode">£123.45</span>
        <span v-else>{{ account.error ? account.error : account.balance }}</span>
        <transition name="fade">
          <span v-show="balanceCopied" class="text-gray-400"> copied</span>
        </transition>
      </p>
    </div>
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { ReturnedAccount } from "../services/interfaces";

export default Vue.extend({
  props: {
    account: {
      type: Object as PropType<ReturnedAccount>,
      required: true,
    },
  },

  data() {
    return {
      balanceCopied: false,
      screenshotMode: false, // A development helper to hide details for screenshots
    };
  },

  methods: {
    goToConnections(): void {
      this.$router.push("/connections");
    },
    copyBalance(): void {
      if (this.account.balance) {
        this.$copyText(this.account.balance).then(() => {
          this.balanceCopied = true;

          setTimeout(() => {
            this.balanceCopied = false;
          }, 2000);
        });
      }
    },
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
