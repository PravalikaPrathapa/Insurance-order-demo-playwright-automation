"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { firstInt, applicationIdFromUrl } = require("../utils/testHelpers");
/** /dashboard (latest 10 applications and status counters) and the start-new-application flow. */
class DashboardPage extends BasePage {
    root;
    newApplicationButton;
    table;
    emptyState;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('dashboard-page');
        this.newApplicationButton = page.getByTestId('dashboard-new-application-button');
        this.table = page.getByTestId('dashboard-applications-table');
        this.emptyState = page.getByTestId('dashboard-empty-state');
    }
    async goto() {
        await this.page.goto('/dashboard');
        await expect(this.root).toBeVisible();
    }
    summaryCard(key) {
        return this.page.getByTestId(`dashboard-summary-${key}`);
    }
    async summaryCount(key) {
        return firstInt(await this.summaryCard(key).innerText());
    }
    /** Application ids of the rows currently listed (the dashboard shows the latest 10). */
    async applicationIds() {
        const ids = await this.page
            .locator('[data-testid^="application-open-"]')
            .evaluateAll((els) => els.map((e) => e.getAttribute('data-testid') ?? ''));
        return ids.map((t) => Number(t.replace('application-open-', ''))).filter((n) => !Number.isNaN(n));
    }
    async statusOf(id) {
        return (await this.page.getByTestId(`application-status-${id}`).innerText()).trim();
    }
    async openApplication(id) {
        await this.page.getByTestId(`application-open-${id}`).click();
        await expect(this.page).toHaveURL(new RegExp(`/applications/${id}(\\b|/)`));
    }
    /** Dashboard -> Start New Application -> Create Draft. Returns the new application id. */
    async startNewApplication() {
        await this.newApplicationButton.click();
        await expect(this.page.getByTestId('application-start-page')).toBeVisible();
        await this.page.getByTestId('application-create-draft-button').click();
        await this.page.waitForURL(/\/applications\/\d+\/client/);
        return applicationIdFromUrl(this.page.url());
    }
}
exports.DashboardPage = DashboardPage;
