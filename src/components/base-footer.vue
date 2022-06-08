<template>
    <footer class="footer" role="contentinfo">
        <div class="container">
            <div class="logo">Awesome<span class="accented">Logo</span></div>
            <address>
                <p>Some address</p>
                <p>Some phone</p>
            </address>
        </div>
    </footer>
</template>

<style scoped lang="scss">
.footer {
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
}

@media screen and (max-width: 768px) {
    .footer .container {
        display: block;

        .logo {
            margin-bottom: 20px;
        }
    }
}
</style>
