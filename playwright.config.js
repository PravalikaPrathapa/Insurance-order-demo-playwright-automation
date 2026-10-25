"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { devices, defineConfig } = require("@playwright/test");
const { config } = require("dotenv");
config();
const BASE_URL = (process.env.INSURANCE_BASE_URL ?? 'http://127.0.0.1:8081').replace(/\/$/, '');
const IS_CI = !!process.env.CI;
// Chromium by default (Q-12). Add firefox/webkit with BROWSERS=chromium,firefox,webkit
const BROWSER_PROJECTS = {
    chromium: { name: 'insurance-chromium', use: { ...devices['Desktop Chrome'] } },
    firefox: { name: 'insurance-firefox', use: { ...devices['Desktop Firefox'] } },
    webkit: { name: 'insurance-webkit', use: { ...devices['Desktop Safari'] } },
};
const selected = (process.env.BROWSERS ?? 'chromium')
    .split(',')
    .map((b) => b.trim().toLowerCase())
    .filter((b) => b in BROWSER_PROJECTS);
exports.default = defineConfig({
    testDir: './tests',
    outputDir: 'reports/test-results',
    globalSetup: './utils/global-setup.js',
    // One worker + serial files: the lab VM is dedicated but earlier assignments showed
    // concurrency artefacts (flaky logins, 500s) under parallel load.
    fullyParallel: false,
    workers: Number(process.env.WORKERS ?? 1),
    retries: IS_CI ? 1 : 0,
    forbidOnly: IS_CI,
    timeout: 60000,
    expect: { timeout: 10000 },
    reporter: [
        ['list'],
        ['html', { outputFolder: 'reports/html', open: 'never' }],
        ['junit', { outputFile: 'reports/junit.xml' }],
        ['json', { outputFile: 'reports/results.json' }],
    ],
    use: {
        baseURL: BASE_URL,
        testIdAttribute: 'data-testid',
        actionTimeout: 15000,
        navigationTimeout: 30000,
        trace: IS_CI ? 'retain-on-failure' : 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: selected.length ? selected.map((b) => BROWSER_PROJECTS[b]) : [BROWSER_PROJECTS.chromium],
});
