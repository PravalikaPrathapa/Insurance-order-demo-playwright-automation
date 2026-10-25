"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { disableBrowserValidation } = require("../utils/testHelpers");
/** /login, plus session checks (protected routes redirect here). */
class LoginPage extends BasePage {
    form;
    email;
    password;
    submitButton;
    constructor(page) {
        super(page);
        this.form = page.getByTestId('login-form');
        this.email = page.getByTestId('login-email-input');
        this.password = page.getByTestId('login-password-input');
        this.submitButton = page.getByTestId('login-submit-button');
    }
    async goto() {
        await this.page.goto('/login');
        await expect(this.form).toBeVisible();
    }
    async fillCredentials(email, password) {
        await this.email.fill(email);
        await this.password.fill(password);
    }
    async submit() {
        await this.submitButton.click();
    }
    async login(email, password) {
        await this.fillCredentials(email, password);
        await this.submit();
    }
    /** Full happy-path login: navigates, signs in and waits until the dashboard is shown. */
    async loginAndWait(email, password) {
        await this.goto();
        await this.login(email, password);
        await expect(this.page).not.toHaveURL(/\/login/);
    }
    async submitIgnoringBrowserValidation() {
        await disableBrowserValidation(this.page, 'login-form');
        await this.submit();
    }
    async expectOnLogin() {
        await expect(this.page).toHaveURL(/\/login/);
        await expect(this.form).toBeVisible();
    }
    async expectSessionBlocked(path) {
        await this.page.goto(path);
        await this.expectOnLogin();
    }
}
exports.LoginPage = LoginPage;
