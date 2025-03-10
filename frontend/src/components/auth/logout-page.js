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
        })

        // try {
        //     const response = await fetch(`${config.host}/logout`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-type': 'application/json',
        //             'Accept': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             refreshToken: localStorage.getItem('refreshToken')
        //         })
        //     });
        //
        //     result = await response.json();
        //
        // } catch (e) {
        //     console.log(e.message)
        // }

        if (result && !result.error) {
            AuthUtils.removeUserInfo();
            return this.openNewRoute('/login');
        }
    }


}