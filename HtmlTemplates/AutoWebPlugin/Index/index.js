import "babel-polyfill";//ie9下语法错误
import "../../../css/index.css";
import "../../../assets/font-web-wimt/iconfont.css";
import Vue from 'vue';
import App from '../../../vue/App'

new Vue({
    el: '#index',
    render: h=>h(App)
});
