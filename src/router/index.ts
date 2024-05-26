import { createRouter, createWebHistory } from 'vue-router';
import SynthView from '@/views/SynthView.vue';

const routes = [
    { path: '/', component: SynthView },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// window.location.host // to get the host name and port (for example: localhost:8080)

export default router;
