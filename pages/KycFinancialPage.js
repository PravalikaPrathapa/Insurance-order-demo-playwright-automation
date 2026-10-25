"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycFinancialPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { disableBrowserValidation } = require("../utils/testHelpers");
/** /applications/{id}/kyc-financial (ID, financial suitability, PEP and compliance declaration). */
class KycFinancialPage extends BasePage {
    root;
    idType;
    idNumber;
    issueDate;
    expiryDate;
    annualIncome;
    netWorth;
    sourceOfFunds;
    riskProfile;
    pep;
    pepDetails;
    declaration;
    saveButton;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('kyc-financial-page');
        this.idType = page.getByTestId('kyc-id-type-select');
        this.idNumber = page.getByTestId('kyc-id-number-input');
        this.issueDate = page.getByTestId('kyc-issue-date-input');
        this.expiryDate = page.getByTestId('kyc-expiry-date-input');
        this.annualIncome = page.getByTestId('financial-annual-income-input');
        this.netWorth = page.getByTestId('financial-net-worth-input');
        this.sourceOfFunds = page.getByTestId('financial-source-of-funds-select');
        this.riskProfile = page.getByTestId('financial-risk-profile-select');
        this.pep = page.getByTestId('compliance-pep-select');
        this.pepDetails = page.getByTestId('compliance-pep-details-input');
        this.declaration = page.getByTestId('compliance-declaration-checkbox');
        this.saveButton = page.getByTestId('kyc-financial-save-continue-button');
    }
    async goto(applicationId) {
        await this.page.goto(`/applications/${applicationId}/kyc-financial`);
        await expect(this.root).toBeVisible();
    }
    async fill(k) {
        await this.idType.selectOption(k.idType);
        await this.idNumber.fill(k.idNumber);
        await this.issueDate.fill(k.issueDate ?? '');
        await this.expiryDate.fill(k.expiryDate ?? '');
        await this.annualIncome.fill(String(k.annualIncome));
        await this.netWorth.fill(String(k.netWorth));
        await this.sourceOfFunds.selectOption(k.sourceOfFunds);
        await this.riskProfile.selectOption(k.riskProfile);
        await this.setPep(k.isPep, k.pepDetails);
        await this.declaration.setChecked(k.declaration);
    }
    /** The PEP dropdown uses 0 = No, 1 = Yes. */
    async setPep(isPep, details) {
        await this.pep.selectOption(isPep ? '1' : '0');
        if (details !== undefined)
            await this.pepDetails.fill(details);
    }
    async save(options = {}) {
        if (options.ignoreBrowserValidation)
            await disableBrowserValidation(this.page, 'kyc-financial-form');
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
    async fillAndSave(k) {
        await this.fill(k);
        await this.save();
        await expect(this.page).toHaveURL(/\/product/);
    }
}
exports.KycFinancialPage = KycFinancialPage;
