import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils";

export class LogoutPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.logout().then();
    }

    async logout() {


        const result = await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getUserInfo(AuthUtils.refreshTokenKey)
        });

        if (result && !result.error) {
            AuthUtils.removeUserInfo();
            return this.openNewRoute('/login');
        }
    }


}