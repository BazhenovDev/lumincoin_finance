import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class LoginPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getUserInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.emailInputElement = document.getElementById('email-form');
        this.passwordInputElement = document.getElementById('password-form');
        this.rememberMeElement = document.getElementById('remember-me');

        document.getElementById('login-btn').addEventListener('click', this.login.bind(this));
    }

    async login() {

        let error = false;
        if (!this.emailInputElement.value.match(/^\S+@\S+\.\S+$/)) {
            error = true;
            this.emailInputElement.classList.add('is-invalid');
        } else {
            this.emailInputElement.classList.remove('is-invalid');
            this.emailInputElement.classList.add('is-valid');
        }

        if (this.passwordInputElement.value.length < 6) {
            error = true;
            this.passwordInputElement.classList.add('is-invalid');
        } else {
            this.passwordInputElement.classList.remove('is-invalid');
            this.passwordInputElement.classList.add('is-valid');
        }

        let result = null;

        if (!error) {
            result = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailInputElement.value,
                password: this.passwordInputElement.value,
                rememberMe: this.rememberMeElement.checked
            });
        }

        if (result && result.response.tokens && result.response.user) {
            AuthUtils.setUserInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                name: result.response.user.name,
                lastName: result.response.user.lastName,
                id: result.response.user.id
            })
            return this.openNewRoute('/');
        }

        if (result && result.error && result.response.message) {
            const modalText = document.getElementById('modal-text');
            result.response.message.toLowerCase() === "invalid email or password"
                ? modalText.innerHTML = `<p>Вы ввели неверный пароль</p>`
                : modalText.innerHTML = `<p>Пользователь с таким e-mail не найден</p>`
            document.getElementById('custom-modal').style.display = 'flex';
            document.getElementById('custom-modal-btn').addEventListener('click', () => {
                document.getElementById('custom-modal').style.display = 'none';
            });
        }
    }
}