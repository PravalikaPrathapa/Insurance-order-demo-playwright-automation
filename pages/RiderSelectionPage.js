"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderSelectionPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { RIDERS } = require("../fixtures/referenceData");
const { disableBrowserValidation } = require("../utils/testHelpers");
/** /applications/{id}/riders */
class RiderSelectionPage extends BasePage {
    root;
    premiumSummary;
    saveButton;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('riders-page');
        this.premiumSummary = page.getByTestId('rider-premium-summary');
        this.saveButton = page.getByTestId('rider-save-continue-button');
    }
    async goto(applicationId) {
        await this.page.goto(`/applications/${applicationId}/riders`);
        await expect(this.root).toBeVisible();
    }
    /** The table row of a rider, found by its name text (rows have numeric ids in their test id). */
    row(key) {
        return this.page.locator('[data-testid^="rider-row-"]').filter({ hasText: RIDERS[key].rowPattern });
    }
    checkbox(key) {
        return this.row(key).locator('[data-testid^="rider-selected-"]');
    }
    coverage(key) {
        return this.row(key).locator('[data-testid^="rider-coverage-amount-"]');
    }
    async select(key, coverageAmount) {
        await this.checkbox(key).check();
        if (coverageAmount !== undefined)
            await this.coverage(key).fill(String(coverageAmount));
    }
    async deselect(key) {
        await this.checkbox(key).uncheck();
    }
    async isSelected(key) {
        return this.checkbox(key).isChecked();
    }
    async selectedCount() {
        return this.page.locator('[data-testid^="rider-selected-"]:checked').count();
    }
    async save(options = {}) {
        if (options.ignoreBrowserValidation)
            await disableBrowserValidation(this.page, 'rider-selection-form');
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
    async saveAndExpectNext() {
        await this.save();
        await expect(this.page).toHaveURL(/beneficiaries/);
    }
    async summaryText() {
        return (await this.premiumSummary.innerText()).replace(/\s+/g, ' ').trim();
    }
}
exports.RiderSelectionPage = RiderSelectionPage;
