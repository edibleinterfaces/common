<style lang="scss">
</style>

<template>
    <div class="collapsible-container">
        <div @click="toggleOpen" class="header-container">
            <slot name="header"></slot>
        </div>
        <div v-show="isOpen" class="content-container">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ei-collapsible',
        data: function() {
            return {
                isOpen: this.open 
            }
        },
        props: {
            open: {
                type: Boolean,
                default: false
            },
            static: {
                type: Boolean,
                default: false
            }

        },
        methods: {
            toggleOpen() {
                if (this.static) 
                    return;
                this.isOpen = !this.isOpen
            }
        }
    }
</script>
