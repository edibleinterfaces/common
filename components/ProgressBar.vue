<style lang="scss">

    @import '../style/themify.scss';

    .progress-bar-container {
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        width: 100%;
        z-index: 1000;
        & > .progress {
            height: 100%;
        }
    }
</style>
<template>
    <div class="progress-bar-container" :style="containerStyle">
        <div class="progress" :style="progressStyle"></div>
    </div>
</template>
<script>
    export default {
        name: 'ProgressBar',
        props: ['progressValue', 'progressBgColor', 'progressColor'],
        computed: {
            containerStyle() {
                return {
                    background: this.progressBgColor,
                };
            },
            progressStyle() {
                return { 
                    width: `${this.progressValue * 100}%`, 
                    background: this.progressColor
                };
            }
        }
    };
</script>
