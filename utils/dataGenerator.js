"use strict";
/** Test-data helpers. Dates are always relative to "today" so age boundaries stay correct over time. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStamp = exports.uniqueEmail = exports.uniqueFirstName = exports.capitalised = exports.alphaId = exports.ageOn = exports.futureDate = exports.dobForAge = exports.addDays = exports.addYears = exports.toIso = void 0;
const pad = (n) => String(n).padStart(2, '0');
function toIso(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
exports.toIso = toIso;
/** Shifts a date by whole years (Feb 29 rolls to Feb 28 / Mar 1 like the JS Date does). */
function addYears(base, years) {
    const d = new Date(base.getTime());
    d.setFullYear(d.getFullYear() + years);
    return d;
}
exports.addYears = addYears;
function addDays(base, days) {
    const d = new Date(base.getTime());
    d.setDate(d.getDate() + days);
    return d;
}
exports.addDays = addDays;
/**
 * DOB for a person whose age is exactly `years` today (birthday today), shifted by `extraDays`.
 *   dobForAge(18)      -> today - 18y        (age 18, boundary accepted)
 *   dobForAge(18, 1)   -> today - 18y + 1d   (age 17y 364d, rejected)
 *   dobForAge(66)      -> today - 66y        (age 66, rejected)
 */
function dobForAge(years, extraDays = 0, today = new Date()) {
    return toIso(addDays(addYears(today, -years), extraDays));
}
exports.dobForAge = dobForAge;
function futureDate(days, today = new Date()) {
    return toIso(addDays(today, days));
}
exports.futureDate = futureDate;
/** Age in whole years on `today` (what a calculator should show). */
function ageOn(dobIso, today = new Date()) {
    const [y, m, d] = dobIso.split('-').map(Number);
    let age = today.getFullYear() - y;
    const hadBirthday = today.getMonth() + 1 > m || (today.getMonth() + 1 === m && today.getDate() >= d);
    if (!hadBirthday)
        age -= 1;
    return age;
}
exports.ageOn = ageOn;
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
/** Letters only: client/beneficiary names may not contain digits or underscores. */
function alphaId(length = 6) {
    let out = '';
    for (let i = 0; i < length; i += 1)
        out += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    return out;
}
exports.alphaId = alphaId;
function capitalised(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
exports.capitalised = capitalised;
/** Unique, name-safe first name such as "Qaxkrtpl" (regex ^[A-Za-z][A-Za-z' .-]*$). */
function uniqueFirstName(prefix = 'Qa') {
    return `${prefix}${alphaId(6)}`;
}
exports.uniqueFirstName = uniqueFirstName;
function uniqueEmail() {
    return `qa.${alphaId(8)}@example.com`;
}
exports.uniqueEmail = uniqueEmail;
function runStamp() {
    return new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
}
exports.runStamp = runStamp;
