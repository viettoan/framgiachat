import Vue from 'vue';
import io from 'socket.io-client';
import VueSocketio from 'vue-socket.io';

import app from './components/app.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
const { detect } = require('detect-browser');
const browser = detect();
import moment from 'moment';

export const SocketInstance = io('http://localhost:3000');

Vue.use(VueAxios, axios)
Vue.use(VueSocketio, SocketInstance);

new Vue({
    el: '#vchat',
    template: '<app></app>',
	components: {
		app: app,
	},
	data: {
		hash: '1',
		guestMessage: [],
		browser: {
			title: '',
			appId: '',
			time: '',
		},
	},
    mounted: function() {
        $('#live-chat header').on('click', function() {
			$('.chat').slideToggle(300, 'swing');
			$('.chat-message-counter').fadeToggle(300, 'swing');
		});

		$('.chat-close').on('click', function(e) {
			e.preventDefault();
			$('#live-chat').fadeOut(300);
		});

		$('#chat-content').hide();
	},
	methods: {
		getAppId: function () {
			var src = $('#vchat-script').attr('src').replace(/^[^\?]+\??/,'');
			var params = this.srcHandle(src);
			return params['appId'];
		},
		getBrowser: function () {
			this.browser.time = moment().format('MM DD YY, h:mm:ss');
			this.browser.title = document.title;
			this.browser.appId = this.getAppId();
			
			return this.browser;
		},
		srcHandle: function (string) {
			var Params = new Object ();
			if ( ! string ) return Params; // return empty object
			var Pairs = string.split(/[;&]/);
			for ( var i = 0; i < Pairs.length; i++ ) {
			   var KeyVal = Pairs[i].split('=');
			   if ( ! KeyVal || KeyVal.length != 2 ) continue;
			   var key = unescape( KeyVal[0] );
			   var val = unescape( KeyVal[1] );
			   val = val.replace(/\+/g, ' ');
			   Params[key] = val;
			}
			return Params;
		}
	}
});