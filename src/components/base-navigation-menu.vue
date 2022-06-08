<script setup lang="ts">
import { RouterLink } from 'vue-router';

import type { IMenu } from '@/models/menu';

const props = defineProps<{
    menu: IMenu;
}>();
</script>

<template>
    <nav class="nav" role="navigation" :aria-label="props.menu.menuTitle" tabindex="0">
        <ul class="list nav-menu" role="menubar">
            <li
                v-for="menuItem of props.menu.menuItems"
                class="list-item nav-menu-item"
                :key="menuItem.to"
            >
                <RouterLink
                    class="btn link nav-menu-link"
                    :to="menuItem.to"
                    role="menuitem"
                    :aria-label="menuItem.description ?? menuItem.caption"
                >
                    {{ menuItem.caption }}
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss">
.nav {
    --item-color: inherit;
    --item-bg: inherit;
    --active-item-color: var(--palette-50);
    --active-item-bg: var(--palette-400);

    &:focus-within {
        outline: unset;
    }

    .nav-menu-link {
        color: var(--item-color);
        background-color: var(--item-bg);
    }
}

.nav-menu {
    display: flex;

    .list-item:not(:last-child) {
        margin-right: 20px;
    }
}

.nav-menu-link {
    padding: 20px 40px;
    white-space: nowrap;
    transition: color 0.3s, background-color 0.3s;

    &.router-link-active,
    &:hover {
        color: var(--active-item-color);
        background-color: var(--active-item-bg);
    }
}
</style>
