"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressContactPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { disableBrowserValidation } = require("../utils/testHelpers");
/** /applications/{id}/address-contact */
class AddressContactPage extends BasePage {
    root;
    resLine1;
    resLine2;
    resCity;
    resState;
    resPostal;
    sameAsResidential;
    mailLine1;
    mailLine2;
    mailCity;
    mailState;
    mailPostal;
    email;
    mobile;
    alternatePhone;
    preferredMode;
    saveButton;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('address-contact-page');
        this.resLine1 = page.getByTestId('residential-address-line-1-input');
        this.resLine2 = page.getByTestId('residential-address-line-2-input');
        this.resCity = page.getByTestId('residential-city-input');
        this.resState = page.getByTestId('residential-state-province-select');
        this.resPostal = page.getByTestId('residential-postal-code-input');
        this.sameAsResidential = page.getByTestId('address-same-as-residential-checkbox');
        this.mailLine1 = page.getByTestId('mailing-address-line-1-input');
        this.mailLine2 = page.getByTestId('mailing-address-line-2-input');
        this.mailCity = page.getByTestId('mailing-city-input');
        this.mailState = page.getByTestId('mailing-state-province-select');
        this.mailPostal = page.getByTestId('mailing-postal-code-input');
        this.email = page.getByTestId('contact-primary-email-input');
        this.mobile = page.getByTestId('contact-mobile-number-input');
        this.alternatePhone = page.getByTestId('contact-alternate-phone-input');
        this.preferredMode = page.getByTestId('contact-preferred-mode-select');
        this.saveButton = page.getByTestId('address-contact-save-continue-button');
    }
    async goto(applicationId) {
        await this.page.goto(`/applications/${applicationId}/address-contact`);
        await expect(this.root).toBeVisible();
    }
    async fillResidential(a) {
        await this.resLine1.fill(a.line1);
        await this.resLine2.fill(a.line2 ?? '');
        await this.resCity.fill(a.city);
        await this.resState.selectOption(a.state);
        await this.resPostal.fill(a.postalCode);
    }
    async fillContact(a) {
        await this.email.fill(a.email);
        await this.mobile.fill(a.mobile);
        await this.alternatePhone.fill(a.alternatePhone ?? '');
        await this.preferredMode.selectOption(a.preferredMode);
    }
    async setSameAsResidential(on) {
        await this.sameAsResidential.setChecked(on);
    }
    async fillMailing(m) {
        await this.mailLine1.fill(m.line1);
        await this.mailLine2.fill(m.line2 ?? '');
        await this.mailCity.fill(m.city);
        await this.mailState.selectOption(m.state);
        await this.mailPostal.fill(m.postalCode);
    }
    async fill(a) {
        await this.fillResidential(a);
        await this.setSameAsResidential(a.sameAsResidential);
        if (!a.sameAsResidential && a.mailing)
            await this.fillMailing(a.mailing);
        await this.fillContact(a);
    }
    async save(options = {}) {
        if (options.ignoreBrowserValidation)
            await disableBrowserValidation(this.page, 'address-contact-form');
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
    async fillAndSave(a) {
        await this.fill(a);
        await this.save();
        await expect(this.page).toHaveURL(/kyc-financial/);
    }
    async mailingValues() {
        return {
            line1: await this.mailLine1.inputValue(),
            city: await this.mailCity.inputValue(),
            state: await this.mailState.inputValue(),
            postal: await this.mailPostal.inputValue(),
        };
    }
    async residentialValues() {
        return {
            line1: await this.resLine1.inputValue(),
            city: await this.resCity.inputValue(),
            state: await this.resState.inputValue(),
            postal: await this.resPostal.inputValue(),
        };
    }
}
exports.AddressContactPage = AddressContactPage;
