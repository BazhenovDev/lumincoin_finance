import {AuthUtils} from "./auth-utils.js";

export class CheckAuth {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.init();
    }

    init() {
        let result = true;

        const accessToken = AuthUtils.getUserInfo(AuthUtils.accessTokenKey);
        console.log(accessToken)
        const refreshToken = AuthUtils.getUserInfo(AuthUtils.refreshTokenKey);
        console.log(refreshToken)

        if (!accessToken || !refreshToken) {
           result = false
        }

        if (!result) {
          return this.openNewRoute('/login');
        }

    }
}