<script setup lang="ts">
import { HISTORY } from '@/data/history';
const isCentred = (text: string) => text.startsWith('!');

const getText = (text: string) => (isCentred(text) ? text.slice(1) : text);
</script>

<template>
    <section class="presentation-section">
        <p class="presentation-title">A long time ago in a land far, far away...</p>
        <h1 class="presentation-logo">
            Print Awesome
            <sub class="presentation-logo-description">Vue Assignment</sub>
        </h1>
        <div class="history-wrapper">
            <div class="history-list">
                <p
                    v-for="(line, index) of HISTORY"
                    :key="index"
                    class="history-list-item"
                    :class="{ center: isCentred(line) }"
                >
                    {{ getText(line) }}
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import url(https://fonts.googleapis.com/css?family=Droid+Sans:400,700);

.presentation-section {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    font-family: 'Droid Sans', arial, verdana, sans-serif;
    font-weight: 700;
    color: #ff6;
    background-color: #000;
    overflow: hidden;

    .presentation-title {
        position: absolute;
        margin: 0;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 200%;
        font-weight: 400;
        color: #4ee;
        opacity: 0;
        z-index: 1;
        animation: intro 2s ease-out;

        @media screen and (max-width: 768px) {
            font-size: 150%;
        }
    }

    .presentation-logo {
        margin: 10% auto;
        width: 5em;
        font-size: 9em;
        line-height: 0.8em;
        letter-spacing: -0.05em;
        text-align: center;
        color: #000;
        text-shadow: -2px -2px 0 #ff6, 2px -2px 0 #ff6, -2px 2px 0 #ff6, 2px 2px 0 #ff6;
        opacity: 0;
        z-index: 1;
        animation: logo 5s ease-out 2.5s;

        @media screen and (max-width: 1280px) {
            font-size: 7em;
        }

        @media screen and (max-width: 768px) {
            font-size: 4em;
        }

        .presentation-logo-description {
            display: block;
            font-size: 0.3em;
            letter-spacing: 0;
            line-height: 0.8em;
        }
    }

    .history-wrapper {
        position: absolute;
        width: 100%;
        height: 500%;
        bottom: 0;
        left: 50%;
        font-size: 350%;
        text-align: justify;
        overflow: hidden;
        transform-origin: 50% 100%;
        transform: translateX(-50%) perspective(300px) rotateX(25deg);

        &:after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 60%;
            background-image: linear-gradient(180deg, #000 0%, transparent 100%);
            pointer-events: none;
        }
    }

    .history-list {
        position: absolute;
        width: 100%;
        top: 100%;
        animation: scroll 100s linear 4s infinite;
    }

    .history-list-item {
        text-align: justify;
        margin: 0.8em 0;
    }

    .center {
        text-align: center;
    }
}

@keyframes intro {
    0% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

@keyframes logo {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: scale(0.1);
        opacity: 0;
    }
}

@keyframes scroll {
    0% {
        top: 100%;
    }
    100% {
        top: -170%;
    }
}
</style>
