"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUARDIAN = exports.beneficiary = exports.productData = exports.kycData = exports.FAKE_SSN = exports.addressData = exports.clientData = exports.MANDATORY_CLIENT_FIELDS = void 0;
const { uniqueFirstName, capitalised, alphaId, dobForAge, uniqueEmail } = require("../utils/dataGenerator");
const { DEFAULT_PRODUCT } = require("./referenceData");
exports.MANDATORY_CLIENT_FIELDS = [
    'firstName', 'lastName', 'dob', 'gender', 'maritalStatus', 'nationality', 'occupation', 'employerName', 'employerAddress',
];
function clientData(overrides = {}) {
    return {
        firstName: uniqueFirstName(),
        lastName: capitalised(alphaId(7)),
        dob: dobForAge(40),
        gender: 'MALE',
        maritalStatus: 'SINGLE',
        nationality: 'United States',
        occupation: 'Software Engineer',
        employerName: 'Acme Corporation',
        employerAddress: '1 Corporate Way, New York, NY 10001',
        ...overrides,
    };
}
exports.clientData = clientData;
function addressData(overrides = {}) {
    return {
        line1: '10 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        sameAsResidential: true,
        email: uniqueEmail(),
        mobile: '(212) 555-0147',
        preferredMode: 'EMAIL',
        ...overrides,
    };
}
exports.addressData = addressData;
/** Fake SSN (not a real person). Change it only if the application's format rules reject it. */
exports.FAKE_SSN = '123-45-6789';
function kycData(overrides = {}) {
    return {
        idType: 'SSN',
        idNumber: exports.FAKE_SSN,
        annualIncome: 50000,
        netWorth: 200000,
        sourceOfFunds: 'SALARY',
        riskProfile: 'MODERATE',
        isPep: false,
        declaration: true,
        ...overrides,
    };
}
exports.kycData = kycData;
function productData(overrides = {}) {
    return {
        productCode: DEFAULT_PRODUCT.code,
        faceValue: 250000,
        frequency: 'MONTHLY',
        paymentTerm: 20,
        policyTerm: 'WHOLE_LIFE',
        ...overrides,
    };
}
exports.productData = productData;
function beneficiary(overrides = {}) {
    const individual = (overrides.type ?? 'INDIVIDUAL') === 'INDIVIDUAL';
    return {
        level: 'PRIMARY',
        type: 'INDIVIDUAL',
        relationship: 'SPOUSE',
        allocation: 100,
        ...(individual ? { firstName: 'Jane', lastName: capitalised(alphaId(6)), dob: dobForAge(38), gender: 'FEMALE' } : {}),
        ...overrides,
    };
}
exports.beneficiary = beneficiary;
exports.GUARDIAN = { name: 'Pat Guardian', relationship: 'Parent', contact: '(212) 555-0199', address: '5 Elm St, New York, NY 10001' };
