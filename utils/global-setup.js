"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLogins = void 0;
const { chromium } = require("@playwright/test");
const { mkdirSync } = require("fs");
const { resolve } = require("path");
const { env } = require("./env");
const { LOGIN_ROLES, emailOf, authFile } = require("../fixtures/users");
const { LoginPage } = require("../pages/LoginPage");
/** Logs in once per role and saves the session. Also called again after tests that log in or out. */
async function saveLogins(roles = LOGIN_ROLES) {
    mkdirSync(resolve(__dirname, '..', '.auth'), { recursive: true });
    const browser = await chromium.launch();
    const failures = [];
    try {
        for (const role of roles) {
            const context = await browser.newContext({ baseURL: env.baseUrl });
            const page = await context.newPage();
            try {
                await new LoginPage(page).loginAndWait(emailOf(role), env.password);
                await context.storageState({ path: authFile(role) });
                console.log(`[setup] saved login for ${role} (${emailOf(role)})`);
            }
            catch (e) {
                failures.push(`${role} (${emailOf(role)}): ${e.message.split('\n')[0]}`);
            }
            finally {
                await context.close();
            }
        }
    }
    finally {
        await browser.close();
    }
    if (failures.length) {
        throw new Error(`[setup] Could not log in, so no saved session was created.\n  - ${failures.join('\n  - ')}\n` +
            'Check .env: INSURANCE_BASE_URL, INSURANCE_PASSWORD and LEARNER_USER (your own assigned account).');
    }
}
exports.saveLogins = saveLogins;
async function globalSetup(_config) {
    const base = env.baseUrl;
    const attempts = [
        { url: `${base}/login`, headers: {} },
        { url: `${base}/api/health`, headers: process.env.INSURANCE_API_KEY ? { 'X-API-Key': process.env.INSURANCE_API_KEY } : {} },
    ];
    const seen = [];
    let healthy = false;
    for (const a of attempts) {
        try {
            const res = await fetch(a.url, { headers: a.headers, redirect: 'manual', signal: AbortSignal.timeout(15000) });
            seen.push(`${a.url} -> HTTP ${res.status}`);
            if (res.status < 500) {
                healthy = true;
                break;
            }
        }
        catch (e) {
            const err = e;
            seen.push(`${a.url} -> ${err.message}${err.cause?.code ? ` (${err.cause.code})` : ''}`);
        }
    }
    if (!healthy) {
        throw new Error(`ENVIRONMENT: the Insurance app did not answer from Node at ${base}.\n  ${seen.join('\n  ')}`);
    }
    console.log(`[setup] application reachable: ${seen[seen.length - 1]}`);
    if (process.env.SKIP_AUTH_SETUP === '1') {
        console.warn('[setup] SKIP_AUTH_SETUP=1: skipping saved logins.');
        return;
    }
    if (!env.hasPassword) {
        console.warn('[setup] INSURANCE_PASSWORD is missing. Continuing without saved login.');
        return;
    }
    await saveLogins();
}
exports.default = globalSetup;
