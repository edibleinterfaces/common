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
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: -1;
    }
</style>

<template>
    <div class="slide-select-container">
        <!--  quadrants -->
        <div
            @click="move(value)"
            v-for="(value, index) in options"
            :style="quadrantStyle(index)"
            :class="{'selected-option': selectedIndex === index }"
            class="slide-select-quadrant">
            <span>{{ value }}</span>
        </div>
        <!-- slider that moves along x axis, over quadrants -->
        <div
            :style="sliderStyle"
            class="slide-select-container-handle slide-select-quadrant">
            <slot name="handle"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ei-slideselect',
        props: {
            options: Array,
            selected: String
        },
        data: function() {
            return {
                classObject: {}
            }
        },
        methods: {
            move(newValue) {
                this.$emit('slide-select-updated', newValue)
            },
            offsetLeft() {
                let offset = (100 / this.options.length) * this.index;
                return `${offset}%`
            },
            quadrantStyle(index) {
                return {
                    'width': `${100/this.options.length}%`,
                    'left': `${index * 100/this.options.length}%`
                };
            },
        },
        computed: {
          index() {
            return this.options.indexOf(this.selected)
          },
          selectedIndex() {
            return this.options.indexOf(this.selected)
          },
          sliderStyle() {
              return {
                  'width': `${100 / this.options.length}%`,
                  'left': this.offsetLeft()
              }
          },
        }
    };
</script>
