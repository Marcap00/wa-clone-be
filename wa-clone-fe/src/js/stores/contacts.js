import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useRouter } from 'vue-router';
import axios from 'axios';

export const useContactsStore = defineStore('contacts', {
    state: () => ({
        contacts: [],
        apiUrlContacts: 'http://localhost:8000/api/contacts',
        textToFind: ''
    }),
    actions: {
        async getContacts() {
            try {
                const authStore = useAuthStore();
                const router = useRouter();
                const userId = localStorage.getItem('user_id') ? JSON.parse(localStorage.getItem('user_id')) : authStore.userId;

                if (!userId) {
                    console.error('Nessun utente autenticato');
                    router.push({ name: 'unauthorized' });
                    return;
                }

                const response = await axios.get(this.apiUrlContacts, {
                    params: {
                        user_id: localStorage.getItem('user_id') ? JSON.parse(localStorage.getItem('user_id')) : userId
                    }
                });

                if (response.data?.success) {
                    this.contacts = response.data.results;
                    console.log(this.contacts);
                }
            } catch (error) {
                console.error('Errore nel caricamento dei contatti:', error);
            }
        },
        capitalize(text) {
            return text.charAt(0).toUpperCase() + text.substring(1);
        },
        isInclude(text, textToFind) {
            text = text.toLowerCase();
            textToFind = textToFind.toLowerCase();
            return text.includes(textToFind);
        },
        searchContacts() {
            this.contacts.forEach(contact => {
                contact.visible = this.isInclude(contact.name, this.textToFind);
                contact.name = this.capitalize(contact.name);
            });
        }
    }
});

export default useContactsStore;
