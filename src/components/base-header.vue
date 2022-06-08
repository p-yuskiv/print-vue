<script setup lang="ts">
import { RouterLink } from 'vue-router';

import NavigationMenu from '@/components/base-navigation-menu.vue';

import { MAIN_MENU, ACCOUNT_MENU } from '@/data/constants';
</script>

<template>
    <header class="header" role="banner">
        <div class="container">
            <RouterLink class="logo" to="/" aria-hidden>
                Awesome<span class="accented">Logo</span>
            </RouterLink>

            <NavigationMenu class="main-menu" :menu="MAIN_MENU" />

            <NavigationMenu class="account-block" :menu="ACCOUNT_MENU" />
        </div>
    </header>
</template>

<style lang="scss">
@import '@/assets/variables.scss';
@import '@/assets/mixins.scss';

.header {
    padding: 20px 0;
    background-color: var(--header-bg);
    z-index: 1;

    .container {
        display: flex;
        align-items: center;
    }

    .logo {
        margin-right: 50px;
        font-size: 24px;
        font-weight: bold;

        .accented {
            color: var(--accent-color);
        }
    }

    .main-menu {
        margin-right: auto;
    }

    .account-block {
        --item-color: var(--palette-900);
        --item-bg: var(--palette-A200);
    }
}

@media screen and (max-width: 1280px) {
    .header {
        @include collapsed-menu(
            '.account-block',
            (
                'right': 0,
                'top': 0,
            )
        );
    }
}

@media screen and (max-width: 768px) {
    .header {
        .container {
            justify-content: space-between;
        }

        .logo {
            display: none;
        }

        @include collapsed-menu(
            '.main-menu',
            (
                'left': 0,
                'top': 0,
            )
        );

        .main-menu {
            flex-grow: 0;
        }
    }
}
</style>
