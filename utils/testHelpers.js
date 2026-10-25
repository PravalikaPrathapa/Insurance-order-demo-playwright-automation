"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = exports.withDialogs = exports.optionValues = exports.selectByText = exports.isNativelyInvalid = exports.disableBrowserValidation = exports.applicationIdFromUrl = exports.firstInt = exports.parseMoney = void 0;
/** "$1,234.56" -> 1234.56 */
function parseMoney(text) {
    const cleaned = (text ?? '').replace(/[^0-9.\-]/g, '');
    const n = Number(cleaned);
    if (Number.isNaN(n))
        throw new Error(`Cannot parse money from "${text}"`);
    return n;
}
exports.parseMoney = parseMoney;
/** First integer in a text such as "Draft 3" -> 3 */
function firstInt(text) {
    const m = (text ?? '').match(/\d+/);
    if (!m)
        throw new Error(`No number in "${text}"`);
    return Number(m[0]);
}
exports.firstInt = firstInt;
function applicationIdFromUrl(url) {
    const m = url.match(/\/applications\/(\d+)/);
    if (!m)
        throw new Error(`No application id in URL ${url}`);
    return Number(m[1]);
}
exports.applicationIdFromUrl = applicationIdFromUrl;
/**
 * The forms use HTML "required" attributes, so the browser blocks blank submissions before the server sees them.
 * This switches browser validation off so server-side validation messages can be tested.
 */
async function disableBrowserValidation(page, formTestId) {
    await page.getByTestId(formTestId).evaluate((form) => {
        form.noValidate = true;
    });
}
exports.disableBrowserValidation = disableBrowserValidation;
/** True if the browser itself reports the field as invalid (e.g. required but empty). */
async function isNativelyInvalid(field) {
    return field.evaluate((el) => !el.checkValidity());
}
exports.isNativelyInvalid = isNativelyInvalid;
/** Selects the first <option> whose text matches (the Product dropdown shows names, values are ids). */
async function selectByText(select, pattern) {
    const options = await select.locator('option').evaluateAll((els) => els.map((e) => ({ value: e.value, text: (e.textContent ?? '').trim() })));
    const match = options.find((o) => (typeof pattern === 'string' ? o.text.includes(pattern) : pattern.test(o.text)));
    if (!match)
        throw new Error(`No option matching ${pattern}. Options: ${options.map((o) => o.text).join(' | ')}`);
    await select.selectOption(match.value);
    return match.text;
}
exports.selectByText = selectByText;
async function optionValues(select) {
    return select.locator('option').evaluateAll((els) => els.map((e) => e.value));
}
exports.optionValues = optionValues;
/** Runs `action` while answering any browser alert()/confirm() dialogs; returns the dialog messages. */
async function withDialogs(page, action, decision = 'accept') {
    const messages = [];
    const handler = async (d) => {
        messages.push(d.message());
        if (decision === 'accept')
            await d.accept();
        else
            await d.dismiss();
    };
    page.on('dialog', handler);
    try {
        await action();
    }
    finally {
        page.off('dialog', handler);
    }
    return messages;
}
exports.withDialogs = withDialogs;
function range(n) {
    return Array.from({ length: n }, (_, i) => i);
}
exports.range = range;
