import Vue from 'vue'
import icsbuilder from './components/icsbuilder.vue'

require('../scss/screen.scss')
require('moment-timezone/builds/moment-timezone-with-data')

window.vm = new Vue({
    el: '#app',
    components: {
        icsbuilder
    },
    data: {},
    mounted: function () {
    },
    methods: {
    }
})
