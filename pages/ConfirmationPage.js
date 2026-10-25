"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
/** /applications/{id}/confirmation */
class ConfirmationPage extends BasePage {
    root;
    reference;
    viewStatusLink;
    dashboardLink;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('submission-confirmation-page');
        this.reference = page.getByTestId('confirmation-reference-number');
        this.viewStatusLink = page.getByTestId('confirmation-view-status-link');
        this.dashboardLink = page.getByTestId('confirmation-dashboard-link');
    }
    async expectShown() {
        await expect(this.root).toBeVisible();
        await expect(this.reference).toBeVisible();
    }
    /** Reference number such as WL2026102500123 (extracted from the text block). */
    async referenceNumber() {
        const text = (await this.reference.innerText()).trim();
        const m = text.match(/WL\d+/);
        return m ? m[0] : text;
    }
}
exports.ConfirmationPage = ConfirmationPage;
