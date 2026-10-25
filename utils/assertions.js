"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyMatches = exports.expectNoAlert = exports.expectAlertMatches = exports.alertTexts = exports.expectApiError = exports.expectApiSuccess = exports.errorTexts = void 0;
const { test, expect } = require("@playwright/test");
/** Flattens an API envelope ({message, errors:{field:[...]}}) into a list of strings. */
function errorTexts(result) {
    const out = [];
    const body = result.body;
    if (body && typeof body.message === 'string')
        out.push(body.message);
    const errors = body?.errors;
    if (Array.isArray(errors))
        out.push(...errors.map(String));
    else if (errors && typeof errors === 'object') {
        for (const v of Object.values(errors)) {
            if (Array.isArray(v))
                out.push(...v.map(String));
            else if (typeof v === 'string')
                out.push(v);
        }
    }
    return out;
}
exports.errorTexts = errorTexts;
/** Prints the real response and attaches it to the HTML report for this test. */
function showResponse(result) {
    console.log(`[api] HTTP ${result.status} ${result.text.slice(0, 500)}`);
    try {
        void test.info().attach('api-response', { body: `HTTP ${result.status}\n${result.text}`, contentType: 'text/plain' });
    }
    catch {
        /* not inside a running test */
    }
}
function expectApiSuccess(result, status = 200) {
    showResponse(result);
    expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
    expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('success');
}
exports.expectApiSuccess = expectApiSuccess;
function expectApiError(result, status, pattern) {
    showResponse(result);
    expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
    expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('error');
    if (pattern) {
        const texts = errorTexts(result).join(' | ');
        expect(texts, `error messages. Actual response body: ${result.text.slice(0, 800)}`).toMatch(pattern);
    }
}
exports.expectApiError = expectApiError;
/** Texts currently shown in the red validation alert (server-side validation on a form page). */
async function alertTexts(page) {
    const alert = page.getByTestId('validation-error-alert');
    if ((await alert.count()) === 0)
        return [];
    return (await alert.locator('li').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
}
exports.alertTexts = alertTexts;
async function expectAlertMatches(page, pattern) {
    const alert = page.getByTestId('validation-error-alert');
    await expect(alert, 'validation alert should be visible').toBeVisible();
    await expect(alert).toContainText(pattern);
}
exports.expectAlertMatches = expectAlertMatches;
async function expectNoAlert(page) {
    await expect(page.getByTestId('validation-error-alert')).toHaveCount(0);
}
exports.expectNoAlert = expectNoAlert;
/** True if some message in the list matches. Used where the app may report an error in more than one place. */
function anyMatches(texts, pattern) {
    return texts.some((t) => pattern.test(t));
}
exports.anyMatches = anyMatches;
