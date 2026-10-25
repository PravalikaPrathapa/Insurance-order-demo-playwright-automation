"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, asRole, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { DashboardPage } = require("../../pages/DashboardPage");
const { ClientInformationPage } = require("../../pages/ClientInformationPage");
const { buildApplication } = require("../../utils/applicationBuilder");
const STATUS_BY_KEY = {
    draft: 'DRAFT',
    submitted: 'SUBMITTED',
    'under-review': 'UNDER_REVIEW',
    approved: 'APPROVED',
    'requires-info': 'REQUIRES_INFO',
};
test.describe('Dashboard (agent.valid)', () => {
    test.use(asRole('valid'));
    test("TC-DASH-001 | DASH-V01 | Verify that dashboard opens after login", { "tag": ["@regression", "@smoke", "@dashboard", "@P1"], "annotation": [{ "type": "validation-id", "description": "DASH-V01" }, { "type": "risk", "description": "R-DASH-04" }, { "type": "priority", "description": "P1" }] }, async ({ page }) => {
        const dashboard = new DashboardPage(page);
        await dashboard.goto();
        for (const key of Object.keys(STATUS_BY_KEY)) {
            await expect(dashboard.summaryCard(key), `summary card ${key}`).toBeVisible();
        }
        await expect(dashboard.newApplicationButton).toBeVisible();
        await expect(dashboard.newApplicationButton).toBeEnabled();
        // agent.valid owns a seeded draft, so the table (not the empty state) is expected
        await expect(dashboard.table).toBeVisible();
    });
    test("TC-DASH-002 | DASH-V02 | Verify that agent sees only their own applications", { "tag": ["@regression", "@api", "@dashboard", "@P2"], "annotation": [{ "type": "validation-id", "description": "DASH-V02" }, { "type": "risk", "description": "R-DASH-01" }, { "type": "priority", "description": "P2" }] }, async ({ page, otherAgent, api }) => {
        const mine = emailOf('valid');
        const theirs = emailOf('draft');
        const dashboard = new DashboardPage(page);
        await dashboard.goto();
        const myUiIds = await dashboard.applicationIds();
        const otherPage = await otherAgent('draft');
        const other = new DashboardPage(otherPage);
        await other.goto();
        const otherUiIds = await other.applicationIds();
        const myApi = ((await api.listApplications(mine)).body?.data ?? []).map((a) => a.id);
        const otherApi = ((await api.listApplications(theirs)).body?.data ?? []).map((a) => a.id);
        expect(myUiIds.length, 'agent.valid has applications').toBeGreaterThan(0);
        expect(otherUiIds.length, 'agent.draft has applications').toBeGreaterThan(0);
        expect(myUiIds.filter((id) => otherUiIds.includes(id)), 'no application shown to both agents').toEqual([]);
        expect(myUiIds.every((id) => myApi.includes(id)), 'every UI row for agent.valid is in that agent\'s API list').toBe(true);
        expect(otherUiIds.every((id) => otherApi.includes(id)), 'every UI row for agent.draft is in that agent\'s API list').toBe(true);
        expect(myApi.filter((id) => otherApi.includes(id)), 'API lists do not overlap').toEqual([]);
    });
});
test.describe('Dashboard (agent.new)', () => {
    test.use(asRole('new'));
});
test.describe('Dashboard (learner: write flows)', () => {
    test.use(asRole('learner'));
    test("TC-DASH-004 | DASH-V04 | Verify that draft can be resumed from the dashboard", { "tag": ["@regression", "@dashboard", "@SDC-16", "@P2"], "annotation": [{ "type": "validation-id", "description": "DASH-V04" }, { "type": "risk", "description": "R-DASH-03" }, { "type": "priority", "description": "P2" }, { "type": "seeded-defect-candidate", "description": "SDC-16" }] }, async ({ page, api }) => {
        const agent = emailOf('learner');
        const app = await buildApplication(api, { agentEmail: agent, upTo: 'client' });
        const dashboard = new DashboardPage(page);
        await dashboard.goto();
        await dashboard.openApplication(app.id);
        await expect(page.getByTestId('application-summary-page')).toBeVisible();
        await test.step('the draft keeps the saved client data', async () => {
            const client = new ClientInformationPage(page);
            await client.goto(app.id);
            await expect(client.firstName).toHaveValue(app.client.firstName);
            await expect(client.lastName).toHaveValue(app.client.lastName);
            await expect(client.dob).toHaveValue(app.client.dob);
        });
    });
});
