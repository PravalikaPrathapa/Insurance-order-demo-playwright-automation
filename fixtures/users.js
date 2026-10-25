"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEEDED = exports.authFile = exports.LOGIN_ROLES = exports.emailOf = void 0;
const { resolve } = require("path");
const { env } = require("../utils/env");
const FIXED = {
    valid: 'agent.valid@insurance.test',
    draft: 'agent.draft@insurance.test',
    new: 'agent.new@insurance.test',
    submitted: 'agent.submitted@insurance.test',
    locked: 'agent.locked@insurance.test',
};
function emailOf(role) {
    return role === 'learner' ? env.learnerEmail : FIXED[role];
}
exports.emailOf = emailOf;
/** Roles that get a saved login (storage state) in global setup. The locked user can never log in. */
exports.LOGIN_ROLES = ['valid', 'draft', 'new', 'submitted', 'learner'];
function authFile(role) {
    return resolve(__dirname, '..', '.auth', `${role}.json`);
}
exports.authFile = authFile;
exports.SEEDED = {
    /** Seeded SUBMITTED application owned by agent.submitted (Lab seed data). */
    submittedReference: 'WL202605170003',
    validDraftReference: 'WL202605170001',
};
