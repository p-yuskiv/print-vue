<script setup lang="ts">
import { RouterView } from 'vue-router';

import TheHeader from '@/components/base-header.vue';
import TheFooter from '@/components/base-footer.vue';
</script>

<template>
    <TheHeader />

    <main class="main" role="main">
        <div class="container">
            <router-view v-slot="{ Component, route }">
                <component class="component" :is="Component" :key="route.path" />
            </router-view>
        </div>
    </main>

    <TheFooter />
</template>

<style lang="scss">
@import '@/assets/variables.scss';
@import '@/assets/base.scss';

#app {
    display: flex;
    min-width: var(--phone-size);
    min-height: 100vh;
    height: 100vh;
    flex-direction: column;

    .main {
        flex-grow: 1;

        .container {
            height: 100%;
        }
    }
}
</style>
