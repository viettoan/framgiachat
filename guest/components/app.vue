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
                    <div v-for="message in messages" >
                        <div v-if="message.user_id != message.sender_id" class="chat-message clearfix">
                            <img src="http://gravatar.com/avatar/2c0ad52fc5943b78d6abe069cc08f320?s=32" alt="" width="32" height="32">
                            <div class="chat-message-content clearfix">
                                <h5>Admin</h5>
                                <img v-if="message.type_id == 0" :src="'http://localhost:3000/images/' + message.content" style="max-width: 180px; max-height: 135px;">
                                <p v-else>{{ message.content }}</p>
                            </div> <!-- end chat-message-content -->
                        </div> <!-- end chat-message -->
                        <div v-else class="chat-message clearfix">
                            <div class="chat-message-content clearfix">
                                <h5>{{ guest.name }}</h5>
                                <img v-if="message.type_id == 0" :src="'http://localhost:3000/images/' + message.content" style="max-width: 180px; max-height: 135px;">
                                <p v-else>{{ message.content }}</p>
                            </div> <!-- end chat-message-content -->
                        </div> <!-- end chat-message -->
                    </div>
                </div> <!-- end chat-history -->
                <fieldset>
                    <input type="text" v-model="guest.message" placeholder="Type your message…" @keyup.enter="sendMessage()" autofocus>
                    <input type="file" id="upload-file" @change="onFileChange">
                    <img src="http://localhost:3000/images/upload.png" id="upload-image" @click="uploadFile()">
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
                type: 1,
            },
            error: '',
            messages: [],
            imageData: '',
        }
    },
    sockets: {
        connect: function(){
            this.$socket.emit('guest-online', this.$parent.getBrowser());
        },
        serverSendGuestNewMessage(data) {
            $('.chat-history').append(`
                <div class="chat-message clearfix" style="margin-left: 56px;">
                    <div class="chat-message-content clearfix">
                        <h5>${this.guest.name}</h5>
                        ${(data.type_id == 0) ? `<img src="http://localhost:3000/images/${data.content }" style="max-width: 180px; max-height: 135px;">`: `<p>${data.content }</p>`}
                    </div> <!-- end chat-message-content -->
                </div> 
            `);
        },
        serverSendAgentNewMessage(data) {
            $('.chat-history').append(`
                <div class="chat-message clearfix" style="margin: 16px 0;">
                    <img src="http://gravatar.com/avatar/2c0ad52fc5943b78d6abe069cc08f320?s=32" alt="" width="32" height="32" style="border-radius: 50%; float: left;">
                    <div class="chat-message-content clearfix" style="margin-left: 56px;">
                        <h5>Admin</h5>
                        ${(data.type_id == 0) ? `<img src="http://localhost:3000/images/${data.content }" style="max-width: 180px; max-height: 135px;">`: `<p>${data.content }</p>`}
                    </div> <!-- end chat-message-content -->
                </div> <!-- end chat-message -->
            `);
        },
        serverSendAgentNewMessageGuest(data) {
            $('#register-chat').prepend(`
                <div class="chat-message clearfix" style="margin-top: -10px; margin-bottom: 10px;border: 1px solid #fc0303; border-radius: 3px; overflow: auto; padding: 5px 0px;">
                    <img src="http://gravatar.com/avatar/2c0ad52fc5943b78d6abe069cc08f320?s=32" alt="" width="32" height="32" style="border-radius: 50%; float: left;">
                    <div class="chat-message-content clearfix" style="margin-left: 56px;">
                        <h5>Admin</h5>
                        ${(data.type == 0) ? `<img src="http://localhost:3000/images/${data.message }" style="max-width: 180px; max-height: 135px;">`: `<p>${data.message }</p>`}
                    </div> <!-- end chat-message-content -->
                </div> <!-- end chat-message -->
            `);
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
                return false;
            }
            $('#chat-content').show();
            $('#register-chat').hide();
            this.guestRegister();
            this.showMessage(this.$parent.getAppId(), this.guest.email);
        },
        sendMessage: function() {
            this.guest.appId = this.$parent.getAppId();
            this.$socket.emit('guest-send-message', this.guest);
            this.guest.message = '';
        },
        guestRegister: function() {
            this.guest.appId = this.$parent.getAppId();
            this.$socket.emit('guest-register', this.guest);
        },
        showMessage: function(room_id, email) {
            var axiosOptions = {
                method: 'GET',
                url: 'http://localhost:3000/show-message-user',
                json: true,
                params: {'room_id': room_id, 'email': email},
            };

            this.axios(axiosOptions).then(response => {
                this.messages = response.data.messages;
            });
        },
        uploadFile: function() {
            $('#upload-file').click();
        },
        onFileChange(event) {
            this.guest.image = event.target.files[0] || event.dataTransfer.files[0];
            this.createImage(this.guest.image);
        },
        createImage(file) {
            let reader = new FileReader();
            let vm = this;
            reader.onload = (e) => {
                var buffer = e.target.result;
                vm.guest.type = 0;
                vm.$socket.emit('guest-send-message-file', vm.guest, file.name,  buffer);
            }
            reader.readAsBinaryString(file);
        },
    }
};
</script>
<style scoped>
a { text-decoration: none; }

fieldset {
    border: 0;
    margin: 0;
    padding: 0 15px 0 5px;
}

fieldset input[type=text] {
    margin-bottom: 10px;
    padding-right: 5px;
    float: right;
    padding-left: 5px;
}

fieldset input[type=file] {
    display: none;	
}

fieldset #upload-image {
    float: right;
    padding-right: 3px;
    margin-top: 5px;
    width: 24px;
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

.chat-history .image-file {
    width: 180px;
    height: 135px;
}

.chat-message {
    margin: 16px 0;
}

.chat-message > img {
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