<style lang="scss" scoped>
    .slide-select-container {
        background: lightgray;
        height: 40px;
        position: relative;
        z-index: 0;
        border-radius: 5px;
    }
    .slide-select-container-handle {
        height: 100%;
        background: white;
        border-radius: 5px;
        z-index: 1;
        transition: left 0.2s ease;
        top: 0;
        position: absolute;
    }
    .slide-select-quadrant {
        display: inline-block;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: -1;
    }
</style>

<template>
    <div class="slide-select-container">
        <div 
            @click="move(index)" 
            v-for="(value, index) in options" 
            :style="quadrantStyle(index)"
            class="slide-select-quadrant"></div> 
        <div 
            :style="sliderStyle" 
            class="slide-select-container-handle"></div>
    </div>
</template>

<script>
    export default {
        name: 'ei-slideselect',
        props: {
            options: Array,
            selected: String,
            onUpdate: Function
        },
        data: function() {
            console.log(this.selected);
            console.log('init index: ', this.options.indexOf(this.selected));
            return {
                index: this.options.indexOf(this.selected),
            };
        },
        methods: {
            move(newIndex) {
                console.log(newIndex);
                this.index = newIndex;
                this.onUpdate(this.index);
            },
            offsetLeft() {
                let offset = (100 / this.options.length) * this.index;
                return `${offset}%`; 
            },
            quadrantStyle(index) {
                return {
                    'width': `${100/this.options.length}%`,
                    'left': `${index * 100/this.options.length}%`
                };
            },
        },
        computed: {
            sliderStyle() {
                return {
                    'width': `${100 / this.options.length}%`,
                    'left': this.offsetLeft()
                }
            },
        }
    };
</script>
