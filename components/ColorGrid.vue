<style lang="scss" scoped>
    .colorgrid-container {
        .colorgrid-row {
            width: 100%;
            .colorgrid-color {
                height: 100%;
                display: inline-block;
            }
        }
    } 
</style>

<template>
    <ul class="colorgrid-container">
        <ul 
            :style="rowStyle"
            class="colorgrid-row" 
            v-for="row in gridRows">
            <li 
                :style="colorStyle(color)"
                v-for="color in row"
                class="colorgrid-color"></li>
        </ul>
    </ul>
</template>

<script>
    export default {
        name: 'app-colorgrid',
        props: {
            colors: Array,
            numRows: Number 
        },
        data: function() {
            return {
                rowStyle: {
                    height: `${100/this.numRows}%`,
                }
            };
        },
        methods: {
            // one way to parameterize style object... 
            colorStyle(bgColor) {
                return {
                    width: `${this.numRows/this.colors.length * 100}%`,
                    background: bgColor,
                };
            },
        },
        computed: {
            gridRows() {
                let max = this.colors.length,
                    step = max / this.numRows,
                    start = 0,
                    rows = [];

                while (step < max) {
                    rows.push(this.colors.slice(start, step));
                    start += step;
                    step += start;
                }

                rows.push(this.colors.slice(start, step));
                return rows;
            } 

        }
    };
</script>
