<style lang="scss">

    .modal {
        display: none;
        padding:2%;
        position: absolute;
        top: 0px;
        left: 0px;
        height: 90vh;
        width: 100vw;
        z-index: 1000;
        overflow-y: scroll;
        border: 1px solid lightgray;
        background: 'transparent';

    }    
    .modal-close {
        width: 100%;
        text-align: right;
        padding: 2% 5%;
    }
    .active {
        display: block;
    }
    @media (max-width: 500px) {
        .modal {
            margin: 0;
        }
    }
    @media (min-width: 501px) {
        .modal {
        }
    }
</style>

<template>
    <div class="modal" v-bind:class="classObj">
        <i @click="modalClose" class="modal-close fa fa-close"></i>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'Modal',
        props: ['active'],
        computed: {
            classObj() {
                return { active: this.active }
            }
        },
        methods: {
            modalClose() {
                this.$emit('modalclose');
            }
        }
    }
</script>
