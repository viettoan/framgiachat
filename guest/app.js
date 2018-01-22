import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import app from './components/app.vue'

Vue.use(VueSocketio, 'http://localhost:3000/');

new Vue({
    el: '#vchat',
    template: '<app></app>',
	components: {
		app: app
	},
	data: {
		hash: '1'
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