<script setup>
import { ref } from 'vue';
import { useContactsStore } from '../js/stores/contacts';
import { useActiveIndexStore } from '../js/stores/active_index';
import axios from 'axios';
import { onUpdated } from 'vue';

const contactsStore = useContactsStore()
const activeIndexStore = useActiveIndexStore()
const newMessage = ref('');
const ApiUrl = 'http://localhost:8000/api/messages/store';

onUpdated(() => {
    console.log(newMessage);
})



function addMessage(message, index) {
    try {
        axios.post(ApiUrl, {
            message: message,
            date: null,
            status: 'sent',
            contact_id: contactsStore.contacts[index].id,
        })
        setTimeout(() => {
            location.reload();
        }, 1000);
        newMessage.value = '';
    } catch (error) {
        console.error(error);
    }
}
</script>

<template>
    <div v-if="contactsStore.contacts.length" class="input-message d-flex  align-items-center p-2">
        <i class="far fa-smile fa-lg mx-3"></i>

        <!-- <form class="flex-grow-1"> -->
        <input v-model="newMessage" name="message" class="w-100 border-0 rounded-3 ps-3" type="text"
            placeholder="Scrivi un messaggio" @keyup.enter="addMessage(newMessage, activeIndexStore.activeIndex)">
        <!-- </form> -->

        <i class="fas fa-microphone mx-3"></i>
    </div>

</template>

<style lang="scss" scoped>
@use "../scss/_variables.scss" as *;

.input-message {
    height: 50px;
    background-color: $bg-dark-searchbar;
}

.input-message input {
    line-height: 36px;
    background-color: $bg-dark-input-chat;
    color: $text-contacts;

    &::placeholder {
        color: $text-contacts;
    }
}
</style>
