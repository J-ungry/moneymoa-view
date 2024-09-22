import './assets/main.css'

import {createApp, ref} from 'vue'
import App from './App.vue'

import {keycloak, config} from './keycloak.js'


init();

function init() {
    keycloak.init({
        onLoad: config.onLoad
    }).then(auth => {
        const ONE_MINUTE = 60000;

        if(!auth) {
            window.location.reload();
        } else {
            console.info("auth OK");
        }

        // const app = createApp(App).mount('#app');
        const app = createApp(App);

        app.provide('keycloak', keycloak);
        // app.config.globalProperties.$keycloak = keycloak;
        app.mount('#app');

        // Vue.prototype.$keycloak = keycloak;keycloak

        localStorage.setItem(`vue-token`, keycloak.token);
        localStorage.setItem(`vue-refresh-token`, keycloak.refreshToken);

        window.setTimeout(refreshToken.bind(null, keycloak), ONE_MINUTE);

    }).catch(() => {
        console.error("Auth Failed");
    });
}

function refreshToken() {
    keycloak.updateToken(70).success(refreshed => {
        if (refreshed) {
            successRefresh(refreshed);
        } else {
            warnRefresh();
        }
    }).error(errorRefresh);
}

function successRefresh(refreshed) {
    console.debug(`Token refreshed ${refreshed}`);
}

function warnRefresh() {
    console.warn(`Token not refreshed, valid for 
  ${Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000)} seconds`);
}

function errorRefresh() {
    console.error('Failed to refresh token');
}

