"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
/** /change-password (authenticated; no OTP needed, unlike /forgot-password). */
class ChangePasswordPage extends BasePage {
    root;
    current;
    newPassword;
    confirm;
    strength;
    submitButton;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('change-password-page');
        this.current = page.getByTestId('change-password-current');
        this.newPassword = page.getByTestId('change-password-new');
        this.confirm = page.getByTestId('change-password-confirm');
        this.strength = page.getByTestId('change-password-strength');
        this.submitButton = page.getByTestId('change-password-submit');
    }
    async goto() {
        await this.page.goto('/change-password');
        await expect(this.root).toBeVisible();
    }
    async submit(current, next, confirm = next) {
        await this.current.fill(current);
        await this.newPassword.fill(next);
        await this.confirm.fill(confirm);
        await this.submitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}
exports.ChangePasswordPage = ChangePasswordPage;
