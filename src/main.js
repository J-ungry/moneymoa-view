import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import Keycloak from "keycloak-js";

// import * as Keycloak from 'keycloak-js'
import initKeycloakConfig from './keycloak-config.json'

// createApp(App).mount('#app')

const keycloak = new Keycloak(initKeycloakConfig);

init();

function init() {
    // keycloak.init({
    //     onLoad: initKeycloakConfig.onLoad
    // }).then(auth => {
    //     console.log(auth);
    //     console.info("Auth OK");
    //     createApp(App).mount('#app');
    // }).catch((err) => {
    //     console.error(err);
    //     console.error("Auth Failed");
    // })
    keycloak.init({
        onLoad: initKeycloakConfig.onLoad
    }).then(auth => {
        const ONE_MINUTE = 60000;

        if(!auth) {
            window.location.reload();
        } else {
            console.info("auth OK");
        }

        createApp(App).mount('#app');

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

