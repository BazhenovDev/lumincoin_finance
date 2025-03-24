import {AuthUtils} from "./auth-utils.js";

export class CheckAuthUtils {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.init();
    }

    init() {
        let result = true;

        const accessToken = AuthUtils.getUserInfo(AuthUtils.accessTokenKey);
        const refreshToken = AuthUtils.getUserInfo(AuthUtils.refreshTokenKey);

        if (!accessToken || !refreshToken) {
           result = false;
        }

        if (!result) {
          return this.openNewRoute('/login');
        }
    }
}