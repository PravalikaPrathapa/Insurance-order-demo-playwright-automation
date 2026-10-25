"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeneficiaryPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { withDialogs } = require("../utils/testHelpers");
/**
 * /applications/{id}/beneficiaries
 * Behaviour worth knowing: switching the type shows/hides sections with JavaScript; saving more than 100% raises a
 * browser alert(); marking a beneficiary Irrevocable raises a browser confirm() (not an HTML modal).
 */
class BeneficiaryPage extends BasePage {
    root;
    form;
    errorSummary;
    allocationSummary;
    table;
    emptyState;
    level;
    type;
    relationship;
    allocation;
    designation;
    saveButton;
    continueLink;
    guardianSection;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('beneficiary-page');
        this.form = page.getByTestId('beneficiary-form');
        this.errorSummary = page.getByTestId('beneficiary-error-summary');
        this.allocationSummary = page.getByTestId('beneficiary-allocation-summary');
        this.table = page.getByTestId('beneficiary-table');
        this.emptyState = page.getByTestId('beneficiary-empty-state');
        this.level = page.getByTestId('beneficiary-level-select');
        this.type = page.getByTestId('beneficiary-type-select');
        this.relationship = page.getByTestId('beneficiary-relationship-select');
        this.allocation = page.getByTestId('beneficiary-allocation-input');
        this.designation = page.getByTestId('beneficiary-designation-select');
        this.saveButton = page.getByTestId('beneficiary-save-button');
        this.continueLink = page.getByTestId('beneficiary-continue-button');
        this.guardianSection = page.getByTestId('minor-guardian-section');
    }
    /** Errors can appear in the page-level alert and/or the beneficiary error summary; this returns both as one text. */
    async errorsText() {
        const alert = (await this.errorMessages()).join(' | ');
        const summary = (await this.errorSummary.count()) ? await this.errorSummary.innerText() : '';
        return `${alert} ${summary}`.replace(/\s+/g, ' ').trim();
    }
    field(testId) {
        return this.page.getByTestId(testId);
    }
    async goto(applicationId) {
        await this.page.goto(`/applications/${applicationId}/beneficiaries`);
        await expect(this.root).toBeVisible();
    }
    rows() {
        return this.page.locator('[data-testid^="beneficiary-row-"]');
    }
    async rowIds() {
        const ids = await this.rows().evaluateAll((els) => els.map((e) => e.getAttribute('data-testid') ?? ''));
        return ids.map((t) => Number(t.replace('beneficiary-row-', ''))).filter((n) => !Number.isNaN(n));
    }
    /** Running totals come from data attributes on the allocation summary (primary and secondary are separate). */
    async primaryTotal() {
        return Number((await this.allocationSummary.getAttribute('data-primary-total')) ?? '0');
    }
    async secondaryTotal() {
        return Number((await this.allocationSummary.getAttribute('data-secondary-total')) ?? '0');
    }
    async fill(b) {
        await this.level.selectOption(b.level);
        await this.type.selectOption(b.type);
        await this.relationship.selectOption(b.relationship);
        await this.allocation.fill(String(b.allocation));
        await this.designation.selectOption(b.irrevocable ? '1' : '0');
        if (b.type === 'INDIVIDUAL') {
            if (b.firstName !== undefined)
                await this.field('beneficiary-first-name-input').fill(b.firstName);
            if (b.lastName !== undefined)
                await this.field('beneficiary-last-name-input').fill(b.lastName);
            if (b.dob !== undefined)
                await this.field('beneficiary-dob-input').fill(b.dob);
            if (b.gender)
                await this.field('beneficiary-gender-select').selectOption(b.gender);
            if (b.guardian) {
                await this.field('beneficiary-guardian-name-input').fill(b.guardian.name);
                await this.field('beneficiary-guardian-relationship-input').fill(b.guardian.relationship);
                await this.field('beneficiary-guardian-contact-input').fill(b.guardian.contact);
                await this.field('beneficiary-guardian-address-input').fill(b.guardian.address);
            }
        }
        if (b.type === 'TRUST') {
            if (b.trustName !== undefined)
                await this.field('beneficiary-trust-name-input').fill(b.trustName);
            if (b.trusteeName !== undefined)
                await this.field('beneficiary-trustee-name-input').fill(b.trusteeName);
            if (b.trustDate !== undefined)
                await this.field('beneficiary-trust-date-input').fill(b.trustDate);
        }
        if (b.type === 'ORGANIZATION') {
            if (b.organizationName !== undefined)
                await this.field('beneficiary-organization-name-input').fill(b.organizationName);
            if (b.organizationRegistration !== undefined)
                await this.field('beneficiary-organization-registration-input').fill(b.organizationRegistration);
            if (b.organizationContact !== undefined)
                await this.field('beneficiary-organization-contact-input').fill(b.organizationContact);
        }
        if (b.legalAcknowledgement !== undefined) {
            await this.field('beneficiary-legal-acknowledgement-checkbox').setChecked(b.legalAcknowledgement);
        }
    }
    /** Fills and saves. Browser dialogs are answered with `dialogDecision` (default accept) and returned. */
    async add(b, dialogDecision = 'accept') {
        await this.fill(b);
        const dialogs = await withDialogs(this.page, () => this.saveButton.click(), dialogDecision);
        await this.page.waitForLoadState('domcontentloaded');
        return { dialogs };
    }
    async addAndExpectRow(b, expectedRows) {
        await this.add(b);
        await expect(this.rows()).toHaveCount(expectedRows);
    }
    async remove(id) {
        await withDialogs(this.page, () => this.page.getByTestId(`beneficiary-delete-${id}`).click(), 'accept');
        await this.page.waitForLoadState('domcontentloaded');
    }
    async edit(id) {
        await this.page.getByTestId(`beneficiary-edit-${id}`).click();
        await expect(this.allocation).toBeVisible();
    }
    async changeAllocation(id, allocation) {
        await this.edit(id);
        await this.allocation.fill(String(allocation));
        await withDialogs(this.page, () => this.saveButton.click(), 'accept');
        await this.page.waitForLoadState('domcontentloaded');
    }
}
exports.BeneficiaryPage = BeneficiaryPage;
