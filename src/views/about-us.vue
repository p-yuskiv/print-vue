<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <section class="just-for-fun-section">
        <div class="cyber">
            <div class="cyber-wrapper">
                <input type="checkbox" id="animation-off" hidden />
                <label for="animation-off" id="logo-button" />
                <div id="g-1"></div>
                <div id="g-2"></div>
                <div id="g-3"></div>
            </div>
            <p class="description">So, how to turn off this flicker))?</p>
        </div>
        <div class="else">
            <p class="description">Sorry, this screen is too narrow))</p>
            <RouterLink class="btn btn-primary back-button" to="/product">
                Review Our Products
            </RouterLink>
        </div>
    </section>
</template>

<style scoped lang="scss">
.just-for-fun-section {
    @media screen and (max-width: 1100px) {
        .cyber {
            display: none;
        }

        .else {
            display: flex;
            height: 200px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }

    @media screen and (min-width: 1099px) {
        .cyber {
            display: block;
        }

        .else {
            display: none;
        }
    }

    .description {
        margin: 10px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    .cyber-wrapper {
        --background-left-shift: -5px;
        --background-bottom-shift: 1000px;
        --animation-duration: 10s;
        --logo-top-shift: 405px;

        position: relative;
        width: 960px;
        height: 540px;
        background: url('../assets/cyber.png') no-repeat;
        margin: 20px auto;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            height: 20px;
            width: 100%;
            top: 0;
            left: var(--background-left-shift);
            background: url('../assets/cyber.png') no-repeat;

            display: block;
            animation-name: animate_main_bg;
            animation-duration: var(--animation-duration);
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            opacity: 0.8;
        }
    }

    @keyframes animate_main_bg {
        0% {
            top: 0px;
            background-position: 0px 0px;
        }
        100% {
            top: var(--background-bottom-shift);
            background-position: 0px calc(var(--background-bottom-shift) * -1);
        }
    }

    #logo-button {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 554px;
        height: 136px;
        background: url('../assets/cyber-logo.png') no-repeat;
        z-index: 10;
        animation: animate_logo_button 5s;
        animation-iteration-count: infinite;
        overflow: hidden;
        cursor: pointer;

        &::after {
            content: '';
            position: absolute;
            left: var(--background-left-shift);
            width: 100%;
            height: 20px;
            background: url('../assets/cyber-logo.png') no-repeat;
            animation-name: animate_logo_bg;
            animation-duration: var(--animation-duration);
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            opacity: 0.8;
        }
    }

    @keyframes animate_logo_button {
        0% {
            opacity: 1;
        }
        2% {
            opacity: 0;
        }
        4% {
            opacity: 1;
        }
        6% {
            opacity: 0;
        }
        8% {
            opacity: 1;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes animate_logo_bg {
        0% {
            top: calc(var(--logo-top-shift) * -1);
            background-position: 0px var(--logo-top-shift);
        }
        100% {
            top: calc(var(--background-bottom-shift) - var(--logo-top-shift));
            background-position: 0px calc(var(--logo-top-shift) - var(--background-bottom-shift));
        }
    }

    #animation-off:not(:checked) {
        & ~ #g-1 {
            --start-shift: 757px;

            position: absolute;
            left: var(--start-shift);
            top: 0;
            width: 73px;
            height: 15px;
            background-image: linear-gradient(to right, green, red);
            opacity: 0.3;

            &::before {
                content: '';
                position: absolute;
                left: calc(var(--start-shift) * -1);
                top: 530px;
                width: 240px;
                height: 10px;
                background-image: linear-gradient(to right, red, green);
            }
        }

        & ~ #g-2 {
            --left-shift: 390px;
            --top-shift: 120px;

            position: absolute;
            left: var(--left-shift);
            top: var(--top-shift);
            width: 570px;
            height: 39px;
            background-image: linear-gradient(to right, red, green);
            opacity: 0;
            animation: animate_blocks 0.4s;
            animation-delay: 2s;
            animation-iteration-count: infinite;

            &::before {
                content: '';
                position: absolute;
                left: calc(var(--left-shift) * -1);
                top: calc(var(--top-shift) + 10px);
                width: 416px;
                height: 79px;
                background-image: linear-gradient(to right, green, blue);
            }

            &::after {
                content: '';
                position: absolute;
                left: calc(var(--left-shift) - 237px);
                top: calc(var(--top-shift) + 220px);
                width: 416px;
                height: 79px;
                background-image: linear-gradient(to right, green, blue);
            }
        }
        & ~ #g-3 {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 164px;
            height: 77px;
            background-color: red;
            opacity: 0;
            animation: animate_blocks 0.5s;
            animation-iteration-count: infinite;

            &::after {
                content: '';
                position: absolute;
                left: 108px;
                top: 42px;
                width: 115px;
                height: 80px;
                background-color: red;
            }
        }
    }

    @keyframes animate_blocks {
        0% {
            opacity: 0;
        }
        20% {
            opacity: 0.1;
        }
        30% {
            opacity: 0;
        }
        50% {
            opacity: 0.1;
        }
        60% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }
}
</style>
