import config from "../config/config.js";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static setUserInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    static getUserInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            if (key === this.userInfoKey) {
                return JSON.parse(localStorage.getItem(this.userInfoKey))
            }
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: JSON.parse(localStorage.getItem(this.userInfoKey))
            }
        }
    }

    static removeUserInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    static async updateTokensWithRefresh() {

        let result = false;

        const refreshToken = this.getUserInfo(this.refreshTokenKey);

        if (refreshToken) {
            const response = await fetch(`${config.host}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });

            if (response && response.status === 200) {
                const tokens = await response.json();
                if (tokens && !tokens.error) {
                    this.setUserInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken);
                    result = true;
                }
            }
        }
        if (!result) {
            this.removeUserInfo();
        }
        return result;
    }
}