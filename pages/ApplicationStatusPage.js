"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStatusPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
/** /applications/{id}/status: current status, reference number and status history. */
class ApplicationStatusPage extends BasePage {
    root;
    current;
    reference;
    historyTable;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('status-page');
        this.current = page.getByTestId('status-current-value');
        this.reference = page.getByTestId('status-reference-number');
        this.historyTable = page.getByTestId('status-history-table');
    }
    async goto(applicationId) {
        await this.page.goto(`/applications/${applicationId}/status`);
        await expect(this.root).toBeVisible();
    }
    async currentStatus() {
        return (await this.current.innerText()).trim();
    }
    async referenceNumber() {
        const text = (await this.reference.innerText()).trim();
        const m = text.match(/WL\d+|DRAFT[-\w]*/);
        return m ? m[0] : text;
    }
    historyRows() {
        return this.page.locator('[data-testid^="status-row-"]');
    }
}
exports.ApplicationStatusPage = ApplicationStatusPage;
