"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = exports.test = exports.asRole = exports.NO_SESSION = void 0;
const { expect, test } = require("@playwright/test");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return expect; } });
const { ApiClient } = require("../utils/apiClient");
const { authFile } = require("./users");
const { alphaId } = require("../utils/dataGenerator");
exports.NO_SESSION = { cookies: [], origins: [] };
/** Use at file/describe level: `test.use(asRole('learner'))` starts every test already logged in as that role. */
function asRole(role) {
    return { storageState: authFile(role) };
}
exports.asRole = asRole;
exports.test = test.extend({
    api: async ({}, use) => {
        const client = await ApiClient.create();
        await use(client);
        await client.dispose();
    },
    uid: async ({}, use) => {
        await use(alphaId(6));
    },
    otherAgent: async ({ browser, baseURL }, use, testInfo) => {
        const contexts = [];
        await use(async (role) => {
            const context = await browser.newContext({ baseURL, storageState: authFile(role) });
            contexts.push(context);
            return context.newPage();
        });
        for (const context of contexts) {
            if (testInfo.status !== testInfo.expectedStatus) {
                for (const [i, p] of context.pages().entries()) {
                    const body = await p.screenshot().catch(() => null);
                    if (body)
                        await testInfo.attach(`other-agent-page-${i}.png`, { body, contentType: 'image/png' });
                }
            }
            await context.close();
        }
    },
    evidence: [
        async ({ page }, use, testInfo) => {
            const log = [];
            page.on('console', (m) => {
                if (m.type() === 'error' || m.type() === 'warning')
                    log.push(`[console.${m.type()}] ${m.text()}`);
            });
            page.on('pageerror', (e) => log.push(`[pageerror] ${e.message}`));
            page.on('response', (r) => {
                if (r.status() >= 400)
                    log.push(`[http ${r.status()}] ${r.request().method()} ${r.url()}`);
            });
            await use();
            if (testInfo.status !== testInfo.expectedStatus && log.length > 0) {
                await testInfo.attach('console-and-network.log', { body: log.join('\n'), contentType: 'text/plain' });
            }
        },
        { auto: true },
    ],
});
