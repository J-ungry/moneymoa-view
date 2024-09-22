import Keycloak from "keycloak-js";

import keycloakConfig from './keycloak-config.json'

const keycloak = new Keycloak(keycloakConfig);
const config = keycloakConfig;

// export default keycloak;
export { keycloak, config };