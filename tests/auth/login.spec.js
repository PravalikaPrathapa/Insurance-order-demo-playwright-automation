"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, NO_SESSION, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { LoginPage } = require("../../pages/LoginPage");
const { env } = require("../../utils/env");
const { MSG } = require("../../utils/messages");
const { expectApiError, errorTexts } = require("../../utils/assertions");
const { saveLogins } = require("../../utils/global-setup");
// Login tests start with NO saved session.
test.use({ storageState: NO_SESSION });
test.afterAll(async () => {
    await saveLogins(); // login/logout tests may have invalidated the saved sessions
});
test.describe('Authentication: login, logout and access control', () => {
    test("TC-AUTH-001 | AUTH-V01 | Verify that a valid agent is able to sign in", { "tag": ["@regression", "@smoke", "@authentication", "@SDC-01", "@P1"], "annotation": [{ "type": "validation-id", "description": "AUTH-V01" }, { "type": "risk", "description": "R-AUTH-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-01" }] }, async ({ page }) => {
        const login = new LoginPage(page);
        for (const role of ['valid', 'draft', 'new', 'submitted']) {
            await test.step(`log in as ${role}`, async () => {
                await page.context().clearCookies();
                await login.loginAndWait(emailOf(role), env.password);
                await login.expectNoErrors();
            });
        }
    });
    test("TC-AUTH-002 | AUTH-V02 | Verify that incorrect password displays the invalid-credentials message", { "tag": ["@regression", "@smoke", "@authentication", "@P1"], "annotation": [{ "type": "validation-id", "description": "AUTH-V02" }, { "type": "risk", "description": "R-AUTH-05" }, { "type": "priority", "description": "P1" }] }, async ({ page }) => {
        // Uses the learner account (not a seeded user): a wrong password counts towards the 5-attempt lock.
        const login = new LoginPage(page);
        await login.goto();
        await login.login(emailOf('learner'), 'Wrong#Pass123');
        await login.expectOnLogin();
        await login.expectErrorMatching(MSG.invalidCredentials);
        await login.expectSessionBlocked('/dashboard');
    });
    test("TC-AUTH-004 | AUTH-V04 | Verify that logout clears the session", { "tag": ["@regression", "@authentication", "@P2"], "annotation": [{ "type": "validation-id", "description": "AUTH-V04" }, { "type": "risk", "description": "R-AUTH-06" }, { "type": "priority", "description": "P2" }] }, async ({ page, browser, baseURL }) => {
        const login = new LoginPage(page);
        await login.loginAndWait(emailOf('learner'), env.password);
        const cookiesBeforeLogout = await page.context().cookies();
        await login.logout();
        await login.expectOnLogin();
        await login.expectSessionBlocked('/dashboard');
        await test.step('the pre-logout session cookie no longer works in a new browser context', async () => {
            const replay = await browser.newContext({ baseURL });
            try {
                await replay.addCookies(cookiesBeforeLogout);
                const p = await replay.newPage();
                await p.goto('/dashboard');
                await expect(p).toHaveURL(/\/login/);
            }
            finally {
                await replay.close();
            }
        });
    });
    test("TC-AUTH-005 | AUTH-V05 | Verify that secured pages redirect to login without a session", { "tag": ["@regression", "@smoke", "@authentication", "@P1"], "annotation": [{ "type": "validation-id", "description": "AUTH-V05" }, { "type": "risk", "description": "R-AUTH-06" }, { "type": "priority", "description": "P1" }] }, async ({ page, api }) => {
        const login = new LoginPage(page);
        const routes = ['/dashboard', '/applications', '/applications/new', '/profile', '/support', '/change-password'];
        const existing = await api.listApplications(emailOf('valid'));
        const firstId = existing.body?.data?.[0]?.id;
        if (firstId)
            routes.push(`/applications/${firstId}/client`, `/applications/${firstId}/review`);
        for (const route of routes) {
            await test.step(`GET ${route} without a session`, async () => {
                await page.context().clearCookies();
                await login.expectSessionBlocked(route);
            });
        }
    });
    test("TC-AUTH-006 | AUTH-V06 | Verify that locked user cannot access the dashboard (UI and API)", { "tag": ["@regression", "@api", "@authentication", "@SDC-02", "@P2"], "annotation": [{ "type": "validation-id", "description": "AUTH-V06" }, { "type": "risk", "description": "R-AUTH-02" }, { "type": "priority", "description": "P2" }, { "type": "seeded-defect-candidate", "description": "SDC-02" }] }, async ({ page, api }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.login(emailOf('locked'), env.password);
        await test.step('UI shows the account-locked message, not the generic invalid-password message', async () => {
            await login.expectOnLogin();
            await login.expectErrorMatching(MSG.accountLocked);
            await login.expectSessionBlocked('/dashboard');
        });
        await test.step('API refuses the same credentials with 403 "Account locked"', async () => {
            const res = await api.login(emailOf('locked'), env.password);
            expectApiError(res, 403, MSG.accountLocked);
            expect(JSON.stringify(res.body?.errors ?? {})).toMatch(/account_status/);
            expect(errorTexts(res).join(' ')).not.toMatch(MSG.invalidCredentials);
        });
    });
});
