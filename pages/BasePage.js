"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
const { expect } = require("@playwright/test");
/** Shared behaviour: alerts, navigation and the helpers used by every page object. */
class BasePage {
    page;
    constructor(page) {
        this.page = page;
    }
    get validationAlert() {
        return this.page.getByTestId('validation-error-alert');
    }
    get statusAlert() {
        return this.page.getByTestId('status-alert');
    }
    /** Messages in the red "Please review the following" alert (empty list when there is none). */
    async errorMessages() {
        if ((await this.validationAlert.count()) === 0)
            return [];
        return (await this.validationAlert.locator('li').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
    }
    async expectErrorMatching(pattern) {
        await expect(this.validationAlert, 'validation alert').toBeVisible();
        await expect(this.validationAlert).toContainText(pattern);
    }
    async expectNoErrors() {
        await expect(this.validationAlert).toHaveCount(0);
    }
    async logout() {
        await this.page.getByTestId('nav-logout-button').click();
    }
    async expectPath(pattern) {
        await expect(this.page).toHaveURL(pattern);
    }
}
exports.BasePage = BasePage;
