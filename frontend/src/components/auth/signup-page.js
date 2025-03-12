import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class SignupPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (localStorage.getItem('accessToken')) {
            return this.openNewRoute('/');
        }

        this.nameInputElement = document.getElementById('name-form');
        this.lastNameInputElement = document.getElementById('lastName-form');
        this.emailInputElement = document.getElementById('email-form');
        this.passwordInputElement = document.getElementById('password-form');
        this.confirmPasswordInputElement = document.getElementById('confirm-password-form');
        this.emailValidText = document.getElementById('email-formFeedback');

        document.getElementById('signup-btn').addEventListener('click', this.signup.bind(this));
    }

    async signup() {

        let error = false;
        if (!this.nameInputElement.value.match(/^[А-Я]+[а-ёяА-ЯЁ\s*]+?$/)) {
            this.nameInputElement.classList.add('is-invalid');
            error = true;
        } else {
            this.nameInputElement.classList.remove('is-invalid');
            this.nameInputElement.classList.add('is-valid');
        }

        if (!this.lastNameInputElement.value.match(/^[А-Я]+[а-ёяА-ЯЁ\s*]+?$/)) {
            this.lastNameInputElement.classList.add('is-invalid');
            error = true;
        } else {
            this.lastNameInputElement.classList.remove('is-invalid');
            this.lastNameInputElement.classList.add('is-valid');
        }

        if (!this.emailInputElement.value.match(/[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_\.-]+\.[a-zA-Z0-9_\.-]+/)) {
            this.emailValidText.innerText = 'Введите корректный e-mail';
            this.emailInputElement.classList.add('is-invalid');
            error = true;
        } else {
            this.emailInputElement.classList.remove('is-invalid');
            this.emailInputElement.classList.add('is-valid');
        }

        if (!this.passwordInputElement.value.match(/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*[0-9]).{8,}/)) {
            this.passwordInputElement.classList.add('is-invalid');
            error = true;
        } else {
            this.passwordInputElement.classList.remove('is-invalid');
            this.passwordInputElement.classList.add('is-valid');
        }

        if (!this.confirmPasswordInputElement.value || this.confirmPasswordInputElement.value !== this.passwordInputElement.value) {
            this.confirmPasswordInputElement.classList.add('is-invalid');
            error = true;
        } else {
            this.confirmPasswordInputElement.classList.remove('is-invalid');
            this.confirmPasswordInputElement.classList.add('is-valid');
        }

        // let resultSignUp = null;

        // if (!error) {
        //     //     try {
        //     //         const response = await fetch(`${config.host}/signup`, {
        //     //             method: 'POST',
        //     //             headers: {
        //     //                 'Content-Type': 'Application/json',
        //     //                 'Accept': 'Application/json',
        //     //             },
        //     //             body: JSON.stringify({
        //     //                 name: this.nameInputElement.value,
        //     //                 lastName: this.lastNameInputElement.value,
        //     //                 email: this.emailInputElement.value,
        //     //                 password: this.passwordInputElement.value,
        //     //                 passwordRepeat: this.confirmPasswordInputElement.value
        //     //             })
        //     //         });
        //     //         resultSignUp = await response.json();
        //     //     } catch (e) {
        //     //         console.log(e.message)
        //     //     }
        //     // }
        //
        //     // if (resultSignUp && resultSignUp.user && resultSignUp.user.email && resultSignUp.user.name && resultSignUp.user.lastName && resultSignUp.user.id && !resultSignUp.error) {
        //     //
        //     //     // try {
        //     //     //     const response = await fetch(`${config.host}/login`, {
        //     //     //         method: "POST", headers: {
        //     //     //             'Content-type': 'application/json', 'Accept': 'application/json',
        //     //     //         }, body: JSON.stringify({
        //     //     //             email: this.emailInputElement.value,
        //     //     //             password: this.passwordInputElement.value,
        //     //     //             rememberMe: false
        //     //     //         })
        //     //     //     });
        //     //     //     resultLogIn = await response.json();
        //     //     // } catch (e) {
        //     //     //     console.log(e.message)
        //     //     // }
        //     //
        //     //     if (resultLogIn && resultLogIn.tokens && resultLogIn.user) {
        //     //         // localStorage.setItem('accessToken', resultLogIn.tokens.accessToken);
        //     //         // localStorage.setItem('refreshToken', resultLogIn.tokens.refreshToken);
        //     //         // localStorage.setItem('userInfo', JSON.stringify({
        //     //         //     name: resultLogIn.user.name,
        //     //         //     lastName: resultLogIn.user.lastName,
        //     //         //     id: resultLogIn.user.id,
        //     //         // }));
        //     //
        //     //
        //     //         // return this.openNewRoute('/');
        //     //     }
        //     // }
        //
        // }

        if (!error) {

            const resultSignUp = await HttpUtils.request('/signup', 'POST', false, {
                name: this.nameInputElement.value,
                lastName: this.lastNameInputElement.value,
                email: this.emailInputElement.value,
                password: this.passwordInputElement.value,
                passwordRepeat: this.confirmPasswordInputElement.value
            });

            if (!resultSignUp.error && resultSignUp.response && resultSignUp.response.user && resultSignUp.response.user.id && resultSignUp.response.user.email && resultSignUp.response.user.name && resultSignUp.response.user.lastName) {
                const resultLogIn = await HttpUtils.request('/login', 'POST', false, {
                    email: resultSignUp.response.user.email,
                    password: this.passwordInputElement.value,
                    rememberMe: false
                });
                if (resultLogIn.response && resultLogIn.response.tokens && resultLogIn.response.tokens.accessToken && resultLogIn.response.tokens.refreshToken && resultLogIn.response.user) {
                    AuthUtils.setUserInfo(resultLogIn.response.tokens.accessToken, resultLogIn.response.tokens.refreshToken, {
                        name: resultLogIn.response.user.name,
                        lastName: resultLogIn.response.user.lastName,
                        id: resultLogIn.response.user.id
                    })
                }
            } else {
                if (resultSignUp.response.error) {
                    this.modal = document.getElementById('custom-modal');
                    this.modalText = document.getElementById('modal-text');
                    this.modalBtn = document.getElementById('custom-modal-btn');
                    if (resultSignUp.response.message.toLowerCase() === 'user with given email already exist') {
                        this.modalText.innerHTML = `<p>Пользователь с таким e-mail уже существует</p>`;
                        this.emailValidText.innerText = 'Пользователь с таким e-mail уже существует';
                        this.emailInputElement.classList.remove('is-valid');
                        this.emailInputElement.classList.add('is-invalid');
                        this.modal.style.display = 'flex';
                        this.modalBtn.addEventListener('click', () => {
                            this.modal.style.display = 'none';
                        })
                        return;
                    } else {
                        this.modalText.innerHTML = `<p>Произошла ошибка на сервере</p> <p>Обратитесь в тех.поддержку или попробуйте зарегистрироваться позже</p>`;
                        this.modal.style.display = 'flex';
                        this.modalBtn.addEventListener('click', () => {
                            this.modal.style.display = 'none';
                        })
                        return;
                    }
                }
            }

            return this.openNewRoute('/');
        }
    }
}