"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFERENCE_NUMBER = exports.MSG = void 0;
/**
 * Expected user-facing messages, kept tolerant (regex) because the exact wording is confirmed on first run.
 * Source of each pattern: application validation rules read during Submission 2 reconciliation.
 */
exports.MSG = {
    invalidCredentials: /invalid credentials/i,
    accountLocked: /account is locked|account locked/i,
    ageRange: /(age must be between 18 and 65|at least 18 years|not older than 65)/i,
    futureDob: /future date of birth is not allowed/i,
    nameFormat: /only letters, spaces, apostrophes, periods, and hyphens/i,
    zip: /ZIP code must be in 12345 or 12345-6789 format/i,
    phone: /valid US phone number/i,
    email: /email/i,
    faceBelowMin: /(below|less than).*(product )?minimum|minimum/i,
    faceAboveMax: /exceeds.*(product )?maximum|above.*maximum|maximum/i,
    affordability: /afford|20\s?%|exceed.*income/i,
    eligibility: /eligib|suitab/i,
    riderAboveBase: /cannot exceed base policy sum assured|cannot exceed.*(face|base)/i,
    riderAboveMax: /above the maximum allowed amount|exceed.*maximum/i,
    riderMaxCount: /(maximum|more than|no more than|at most).*(4|four)|(4|four).*(rider)/i,
    riderExclusive: /mutually exclusive|only one.*waiver|waiver.*(both|together|exclusive)/i,
    riderAge: /age|eligib/i,
    primaryTotal: /primary beneficiary allocation must total exactly 100/i,
    secondaryTotal: /secondary.*(100|total)/i,
    noPrimary: /at least one primary beneficiary is required/i,
    guardian: /guardian details are required/i,
    duplicate: /duplicate|already exists|already added/i,
    trustName: /trust name is required/i,
    organizationName: /organization name is required/i,
    irrevocableDialog: /irrevocable/i,
    overAllocationDialog: /cannot exceed 100/i,
    docFormat: /unsupported document format/i,
    docSize: /size exceeds the allowed limit/i,
    docRequired: /KYC[_ ]ID.*(required|not been uploaded)|required document/i,
    pepDetails: /pep details are required/i,
    declaration: /declaration(s)? must be completed/i,
    validationFailed: /validation failed/i,
    unauthorized: /unauthorized/i,
    // change-password rule messages (StrongAgentPassword)
    pwdLength: /at least 12 characters/i,
    pwdUpper: /uppercase/i,
    pwdLower: /lowercase/i,
    pwdDigit: /digit/i,
    pwdSpecial: /special character/i,
    pwdUsername: /email username/i,
    pwdCommon: /common or sequential/i,
    pwdRepeat: /repeated characters/i,
};
exports.REFERENCE_NUMBER = /^WL\d{13}$/; // WL + yyyymmdd + 5 digits (generated). Seed data uses 4-digit sequences.
