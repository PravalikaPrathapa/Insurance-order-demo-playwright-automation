"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { firstInt, parseMoney } = require("../utils/testHelpers");
/** /applications/{id}/review: blocking validation errors, submit button and the application snapshot. */
class ReviewPage extends BasePage {
    root;
    errorBox;
    passedBox;
    validateButton;
    submitButton;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('review-page');
        this.errorBox = page.getByTestId('review-validation-errors');
        this.passedBox = page.getByTestId('review-validation-passed');
        this.validateButton = page.getByTestId('review-validate-button');
        this.submitButton = page.getByTestId('review-submit-application-button');
    }
    async goto(applicationId) {
        await this.page.goto(`/applications/${applicationId}/review`);
        await expect(this.root).toBeVisible();
    }
    /** Blocking validation errors listed on the page (plain list items). */
    async errors() {
        if ((await this.errorBox.count()) === 0)
            return [];
        return (await this.errorBox.locator('li').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
    }
    /** Number of links inside the error list (the app currently renders plain text). */
    async errorLinkCount() {
        if ((await this.errorBox.count()) === 0)
            return 0;
        return this.errorBox.locator('a').count();
    }
    async runValidation() {
        await this.validateButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.root).toBeVisible();
    }
    async submit() {
        await this.submitButton.click();
        await expect(this.page).toHaveURL(/\/confirmation/);
    }
    async calculatedAge() {
        return firstInt(await this.page.getByTestId('review-client-calculated-age').innerText());
    }
    async totalPremium() {
        return parseMoney(await this.page.getByTestId('review-total-premium').innerText());
    }
}
exports.ReviewPage = ReviewPage;
