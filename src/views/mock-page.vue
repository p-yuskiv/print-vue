<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <section class="mock-page">
        <h1 class="title">Lorem ipsum dolor sit amet.</h1>
        <p class="description">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestias dolores sint atque,
            incidunt magni culpa dicta harum officiis. Unde corporis, et consequatur quaerat tenetur
            nulla, provident fugit deleniti quos mollitia nemo necessitatibus. Facere ducimus a
            itaque iste qui eos vero maiores aliquid tenetur explicabo doloremque molestias vel,
            ratione non sequi?
        </p>

        <hr class="ruler" />

        <div class="navigation-panel">
            <p>I hope this helps you, but now it's time to:</p>
            <RouterLink class="btn btn-primary back-button" to="/product">
                Review Our Products
            </RouterLink>
        </div>
    </section>
</template>

<style scoped lang="scss">
.mock-page {
    .title,
    .ruler {
        margin: 50px 0;
        text-align: center;
    }

    .navigation-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .back-button {
        margin-top: 30px;
        padding: 20px 40px;
    }
}
</style>
