"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const { config } = require("dotenv");
config();
function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in (see README).`);
    }
    return value;
}
/** Central, lazy environment access. Nothing secret is hard-coded anywhere in the repo. */
exports.env = {
    get baseUrl() {
        return (process.env.INSURANCE_BASE_URL ?? 'http://136.83.129.92:8081/login').replace(/\/$/, '');
    },
    /**
     * API base URL. It ALWAYS ends with a trailing slash and API paths used with it have NO leading slash,
     * otherwise Playwright's URL resolution drops the "/api" segment (lesson from the earlier FinServe project).
     */
    get apiBase() {
        const raw = (process.env.INSURANCE_API_BASE_URL ?? `http://136.83.129.92:8081/api/`).replace(/\/+$/, '');
        return `${raw}/`;
    },
    get apiKey() {
        return required('INSURANCE_API_KEY');
    },
    get password() {
        return required('INSURANCE_PASSWORD');
    },
    get hasPassword() {
        return !!process.env.INSURANCE_PASSWORD;
    },
    get learnerEmail() {
        return process.env.LEARNER_USER || 'learner001@insurance.test';
    },
    /** Spare account for the destructive lockout test. Empty means that test is skipped. */
    get disposableEmail() {
        return process.env.DISPOSABLE_USER || '';
    },
};
