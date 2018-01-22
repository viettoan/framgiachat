<template>
  	<div id="live-chat">
		
		<header class="clearfix">
			
			<a href="#" class="chat-close">x</a>

			<h4>Admin</h4>

			<span class="chat-message-counter">3</span>

		</header>

		<div class="chat">
			<form id="register-chat">
				
				<div>
					<p><label>Name</label></p><br>
					<input type="text" id="name" name="name" autofocus required v-model="guest.name">
				</div><br>
				<div>
					<p><label>Email</label></p><br>
					<input id="email" type="text" required v-model="guest.email">
				</div><br>
				<p class="warning" v-if="error">{{ error }}</p>
				<input id="chat-button" @click="chatUp()" value="Chat" type="button">
			</form>
			<div id="chat-content">
				<div class="chat-history">
					<div class="chat-message clearfix agent-message">
						<img src="http://gravatar.com/avatar/2c0ad52fc5943b78d6abe069cc08f320?s=32" alt="" width="32" height="32">
						<div class="chat-message-content clearfix">
							<h5>Admin</h5>
							<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
						</div> <!-- end chat-message-content -->
					</div> <!-- end chat-message -->
					<hr>
					<div class="chat-message-content clearfix">
						<span class="chat-time">13:37</span>
						<h5>{{ guest.name }}</h5>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, nulla accusamus magni vel debitis numquam qui tempora rem voluptatem delectus!</p>
					</div> <!-- end chat-message-content -->
					<hr>

				</div> <!-- end chat-history -->

				<p class="chat-feedback">Your partner is typing…</p>
				<fieldset>
					
					<input type="text" v-model="guest.message" placeholder="Type your message…" @keyup.enter="sendMessage()" autofocus>
					<input type="hidden">

				</fieldset>
			</div>
			

		</div> <!-- end chat -->

	</div> <!-- end live-chat -->
</template>
<script>
export default {
	data() {
		return {
			guest: {
				name: '',
				email: '',
				message: '',
				appId: '',
				type: 1
			},
			error: '',
		}
	},
	methods: {
		chatUp: function() {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (this.guest.email == '' || this.guest.name == '') {
				this.error = "Name or email Invalid";
				return false;
			}
			if (re.test(this.guest.email.toLowerCase()) == false) {
				this.error = "Email Invalid";
				console.log(this.error);
				return false;
			}
			$('#chat-content').show();
			$('#register-chat').hide();
			this.guestRegister();
		},
		sendMessage: function() {
			this.guest.appId = this.$parent.getAppId();
			this.$socket.emit('guest-send-message', this.guest);
		},
		guestRegister: function() {
			this.guest.appId = this.$parent.getAppId();
			this.$socket.emit('guest-register', this.guest);
		}
	}
};
</script>
<style scoped>
a { text-decoration: none; }

fieldset {
	border: 0;
	margin: 0;
	padding: 0;
}
fieldset input {
	margin-left: 30px;
	margin-bottom: 30px;
}

h4, h5 {
	line-height: 1.5em;
	margin: 0;
}

hr {
	background: #e9e9e9;
    border: 0;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    height: 1px;
    margin: 0;
    min-height: 1px;
}

img {
    border: 0;
    display: block;
    height: auto;
    max-width: 100%;
}

input {
	border: 0;
	color: inherit;
    font-family: inherit;
    font-size: 100%;
    line-height: normal;
    margin: 0;
}

p { margin: 0; }

.clearfix { *zoom: 1; } /* For IE 6/7 */
.clearfix:before, .clearfix:after {
    content: "";
    display: table;
}
.clearfix:after { clear: both; }

/* ---------- LIVE-CHAT ---------- */

#live-chat {
	bottom: 0;
	font-size: 12px;
	right: 24px;
	position: fixed;
	width: 300px;
}

#live-chat header {
	background: #293239;
	border-radius: 5px 5px 0 0;
	color: #fff;
	cursor: pointer;
	padding: 16px 24px;
}

#live-chat h4:before {
	background: #1a8a34;
	border-radius: 50%;
	content: "";
	display: inline-block;
	height: 8px;
	margin: 0 8px 0 0;
	width: 8px;
}

#live-chat h4 {
	font-size: 12px;
}

#live-chat h5 {
	font-size: 10px;
}

#live-chat form {
	padding: 24px;
}

#live-chat input[type="text"] {
	border: 1px solid #ccc;
	border-radius: 3px;
	padding: 8px;
	outline: none;
	width: 234px;
}

.chat-message-counter {
	background: #e62727;
	border: 1px solid #fff;
	border-radius: 50%;
	display: none;
	font-size: 12px;
	font-weight: bold;
	height: 28px;
	left: 0;
	line-height: 28px;
	margin: -15px 0 0 -15px;
	position: absolute;
	text-align: center;
	top: 0;
	width: 28px;
}

.chat-close {
	background: #1b2126;
	border-radius: 50%;
	color: #fff;
	display: block;
	float: right;
	font-size: 10px;
	height: 16px;
	line-height: 16px;
	margin: 2px 0 0 0;
	text-align: center;
	width: 16px;
}

.chat {
	min-height: 300px;
	background: #fff;
}

.chat-history {
	height: 252px;
	padding: 8px 24px;
	overflow-y: scroll;
}

.chat-message {
	margin: 16px 0;
}

.chat-message img {
	border-radius: 50%;
	float: left;
}
.chat-message-content {
	margin-left: 56px;
}

.chat-time {
	float: right;
	font-size: 10px;
}

.chat-feedback {
	font-style: italic;	
	margin: 0 0 0 80px;
}

#chat-button {
	width: 100px;
	background-color: #fc0303;
	background-image: none;
    border: medium none;
    border-radius: 3px;
    color: #ffffff;
    cursor: pointer;
    display: inline-block;
    font-size: 13px;
    margin: 0 10px 0 0;
    padding: 5px 20px;
    max-width: 150px;
}

.warning {
	color: #fc0303;
	margin-bottom: 10px;
}
</style>