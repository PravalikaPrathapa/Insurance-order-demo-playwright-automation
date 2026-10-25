"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FREQUENCIES = exports.POLICY_TERMS = exports.PAYMENT_TERMS = exports.DOC_MAX_KB = exports.AFFORDABILITY_PERCENT = exports.MAX_RIDERS = exports.RIDERS = exports.DEFAULT_PRODUCT = exports.product = exports.PRODUCTS = void 0;
exports.PRODUCTS = [
    { code: 'WL_SECURE_BASIC', name: 'SecureLife Whole Life', ageMin: 18, ageMax: 65, faceMin: 100000, faceMax: 1000000, ratePer1000: 4.75 },
    { code: 'WL_WEALTH_BUILDER', name: 'WealthBuilder Whole Life', ageMin: 21, ageMax: 60, faceMin: 150000, faceMax: 1500000, ratePer1000: 5.35 },
    { code: 'WL_ELITE_LEGACY', name: 'Elite Legacy Whole Life', ageMin: 30, ageMax: 65, faceMin: 500000, faceMax: 5000000, ratePer1000: 6.1 },
    { code: 'WL_FLEXI_PAY', name: 'FlexiPay Whole Life', ageMin: 18, ageMax: 62, faceMin: 100000, faceMax: 1200000, ratePer1000: 5.0 },
    { code: 'WL_GUARANTEED_RETURN', name: 'Guaranteed Return Whole Life', ageMin: 25, ageMax: 55, faceMin: 200000, faceMax: 2000000, ratePer1000: 5.85 },
];
const product = (code) => {
    const p = exports.PRODUCTS.find((x) => x.code === code);
    if (!p)
        throw new Error(`Unknown product ${code}`);
    return p;
};
exports.product = product;
exports.DEFAULT_PRODUCT = product('WL_SECURE_BASIC');
exports.RIDERS = {
    ADB: { code: 'RIDER_ADB', rowPattern: /Accidental Death/, ageMin: 18, ageMax: 65, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: null, exclusionGroup: null, ratePer1000: 0.85 },
    DISABILITY: { code: 'RIDER_DISABILITY', rowPattern: /Permanent Disability/, ageMin: 18, ageMax: 60, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: null, exclusionGroup: null, ratePer1000: 1.1 },
    TERM: { code: 'RIDER_TERM_ADDON', rowPattern: /Term Rider/, ageMin: 21, ageMax: 55, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: null, exclusionGroup: null, ratePer1000: 1.25 },
    CI: { code: 'RIDER_CRITICAL_ILLNESS', rowPattern: /Critical Illness Rider/, ageMin: 18, ageMax: 58, coverageType: 'PERCENT_OF_BASE', maxCoverage: 500000, minBaseFace: null, exclusionGroup: null, ratePer1000: 1.6 },
    HOSPITAL: { code: 'RIDER_HOSPITAL_CASH', rowPattern: /Hospital Cash/, ageMin: 18, ageMax: 60, coverageType: 'FIXED_AMOUNT', maxCoverage: 100000, minBaseFace: null, exclusionGroup: null, ratePer1000: 0.65 },
    WAIVER_DISABILITY: { code: 'RIDER_WAIVER_DISABILITY', rowPattern: /Waiver.*Disability/, ageMin: 18, ageMax: 55, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: 200000, exclusionGroup: 'WAIVER_PREMIUM', ratePer1000: 0.7 },
    WAIVER_CI: { code: 'RIDER_WAIVER_CI', rowPattern: /Waiver.*Critical/, ageMin: 18, ageMax: 55, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: 200000, exclusionGroup: 'WAIVER_PREMIUM', ratePer1000: 0.9 },
    FAMILY_INCOME: { code: 'RIDER_FAMILY_INCOME', rowPattern: /Family Income/, ageMin: 25, ageMax: 55, coverageType: 'PERCENT_OF_BASE', maxCoverage: 750000, minBaseFace: 250000, exclusionGroup: null, ratePer1000: 1.35 },
    GUARANTEED_INCOME: { code: 'RIDER_GUARANTEED_INCOME', rowPattern: /Guaranteed Income/, ageMin: 30, ageMax: 60, coverageType: 'PERCENT_OF_BASE', maxCoverage: 500000, minBaseFace: 300000, exclusionGroup: null, ratePer1000: 1.5 },
};
exports.MAX_RIDERS = 4;
exports.AFFORDABILITY_PERCENT = 20;
exports.DOC_MAX_KB = 5 * 1024; // 5 MB
exports.PAYMENT_TERMS = [10, 15, 20, 25, 30];
exports.POLICY_TERMS = ['WHOLE_LIFE', 'TO_AGE_100'];
exports.FREQUENCIES = ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'];
