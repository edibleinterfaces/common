<style lang="scss">
</style>

<template>
    <div class="collapsible-container">
        <div @click="toggleOpen" class="header-container">
            <slot name="header"></slot>
        </div>
        <div v-show="open" class="content-container">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ei-collapsible',
        data: function() {
            return { open: false };
        },
        methods: {
            toggleOpen() {
                this.open = !this.open;
            }
        }
    }
</script>
