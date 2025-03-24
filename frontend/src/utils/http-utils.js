import config from "../config/config.js";
import {AuthUtils} from "./auth-utils.js";

export class HttpUtils {
    static async request(url, method = "GET", authToken = true, body = null) {

        const result = {
            error: false,
            response: null,
        }

        const params = {
            method: method,
            headers: {
                'Content-type': 'Application/json',
                'Accept': 'Application/json'
            }
        }

        let accessToken = null;

        if (authToken) {
            accessToken = AuthUtils.getUserInfo(AuthUtils.accessTokenKey);
            if (accessToken) {
                params.headers['x-auth-token'] = accessToken;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }


        let response = null;

        try {
            response = await fetch(`${config.host}${url}`, params);

            result.response = await response.json();

        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (authToken && response.status === 401) {
                if (accessToken) {
                    const updateRefreshToken = await AuthUtils.updateTokensWithRefresh()
                    if (updateRefreshToken) {
                        return this.request(url, method, authToken, body);
                    } else {
                        result.redirect = '/login';
                    }
                } else {
                    result.redirect = '/login';
                }
            }
        }
        return result;
    }
}