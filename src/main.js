import Vue from 'vue';
import './style.scss';

import VueResource from 'vue-resource';

Vue.use(VueResource);

import moment from 'moment-timezone';

moment.tz.setDefault("UTC");
Object.defineProperty(Vue.prototype, '$moment', {
    get() {
        return this.$root.moment;
    }
});

const bus = new Vue();
Object.defineProperty(Vue.prototype, '$bus', {
    get() {
        return this.$root.bus;
    }
});

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import routes from './util/routes.js'

const router=new VueRouter({ routes})

import tooltip from './util/tooltip';
Vue.use(tooltip)

new Vue({
    el: '#app',
    data: {
        genre: [],
        time: [],
        movies: [],
        moment,
        day: moment(),
        bus
    },
    methods: {
        checkFilter(category, title, checked) {
            if (checked) {
                this[category].push(title);
            } else {
                let index = this[category].indexOf(title);
                if (index > -1) {
                    this[category].splice(index, 1);
                }
            }
        },
        setDay(day){
            this.day = day;
        }
    },

    created() {
        this.$http.get('/api').then(
            response => {
                this.movies = response.data;
            });

        this.$bus.$on('check-filter', this.checkFilter);
        this.$bus.$on('set-day',this.setDay);
    },
    router
});

