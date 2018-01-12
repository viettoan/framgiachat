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
});