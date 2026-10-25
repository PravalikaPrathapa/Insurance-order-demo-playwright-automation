"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductConfigurationPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { product } = require("../fixtures/referenceData");
const { selectByText, disableBrowserValidation, parseMoney, optionValues } = require("../utils/testHelpers");
/** /applications/{id}/product: product, face value, frequency, terms and the live premium preview. */
class ProductConfigurationPage extends BasePage {
    root;
    productSelect;
    faceValue;
    frequency;
    paymentTerm;
    policyTerm;
    totalPremium;
    previewHelp;
    rangeHelp;
    saveButton;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('product-configuration-page');
        this.productSelect = page.getByTestId('product-select');
        this.faceValue = page.getByTestId('product-sum-assured-input');
        this.frequency = page.getByTestId('product-premium-frequency-select');
        this.paymentTerm = page.getByTestId('product-payment-term-select');
        this.policyTerm = page.getByTestId('product-coverage-term-select');
        this.totalPremium = page.getByTestId('product-current-total-premium');
        this.previewHelp = page.getByTestId('premium-preview-help');
        this.rangeHelp = page.getByTestId('product-range-help');
        this.saveButton = page.getByTestId('product-save-continue-button');
    }
    async goto(applicationId) {
        await this.page.goto(`/applications/${applicationId}/product`);
        await expect(this.root).toBeVisible();
    }
    async selectProduct(code) {
        await selectByText(this.productSelect, product(code).name);
    }
    async setFaceValue(amount) {
        await this.faceValue.fill(String(amount));
    }
    async setFrequency(f) {
        await this.frequency.selectOption(f);
    }
    async setPolicyTerm(t) {
        await this.policyTerm.selectOption(t);
    }
    async fill(d) {
        await this.selectProduct(d.productCode);
        await this.setFaceValue(d.faceValue);
        await this.setFrequency(d.frequency);
        await this.paymentTerm.selectOption(String(d.paymentTerm));
        await this.setPolicyTerm(d.policyTerm);
    }
    async save(options = {}) {
        if (options.ignoreBrowserValidation)
            await disableBrowserValidation(this.page, 'product-configuration-form');
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
    async fillAndSave(d) {
        await this.fill(d);
        await this.save();
        await expect(this.page).toHaveURL(/\/riders/);
    }
    /** Number shown in the premium box (live JavaScript preview until saved, then the stored total). */
    async premiumShown() {
        return parseMoney(await this.totalPremium.innerText());
    }
    paymentTermOptions() {
        return optionValues(this.paymentTerm).then((v) => v.filter(Boolean));
    }
    policyTermOptions() {
        return optionValues(this.policyTerm).then((v) => v.filter(Boolean));
    }
}
exports.ProductConfigurationPage = ProductConfigurationPage;
