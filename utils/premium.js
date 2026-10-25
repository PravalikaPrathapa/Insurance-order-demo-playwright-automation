"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalPremium = exports.annualPremium = exports.periodPremium = exports.round2 = void 0;
/**
 * Premium rules (application service): annual = amount / 1000 x rate per 1,000;
 * period premium = annual / 12, 4, 2 or 1 and rounded to 2 decimals. Total = rounded base + rounded rider premiums.
 */
const DIVISOR = { MONTHLY: 12, QUARTERLY: 4, SEMI_ANNUAL: 2, ANNUAL: 1 };
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
exports.round2 = round2;
function periodPremium(amount, ratePer1000, frequency) {
    return round2(((amount / 1000) * ratePer1000) / DIVISOR[frequency]);
}
exports.periodPremium = periodPremium;
function annualPremium(amount, ratePer1000) {
    return round2((amount / 1000) * ratePer1000);
}
exports.annualPremium = annualPremium;
function totalPremium(base, riders, frequency) {
    const b = periodPremium(base.face, base.rate, frequency);
    const r = riders.reduce((sum, x) => sum + periodPremium(x.coverage, x.rate, frequency), 0);
    return round2(b + r);
}
exports.totalPremium = totalPremium;
