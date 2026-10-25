"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientInformationPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { disableBrowserValidation } = require("../utils/testHelpers");
/** /applications/{id}/client */
class ClientInformationPage extends BasePage {
    root;
    firstName;
    middleName;
    lastName;
    dob;
    gender;
    maritalStatus;
    nationality;
    occupation;
    employerName;
    employerAddress;
    saveButton;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('client-information-page');
        this.firstName = page.getByTestId('client-first-name-input');
        this.middleName = page.getByTestId('client-middle-name-input');
        this.lastName = page.getByTestId('client-last-name-input');
        this.dob = page.getByTestId('client-dob-input');
        this.gender = page.getByTestId('client-gender-select');
        this.maritalStatus = page.getByTestId('client-marital-status-select');
        this.nationality = page.getByTestId('client-nationality-input');
        this.occupation = page.getByTestId('client-occupation-input');
        this.employerName = page.getByTestId('client-employer-name-input');
        this.employerAddress = page.getByTestId('client-employer-address-input');
        this.saveButton = page.getByTestId('client-save-continue-button');
    }
    /** Locator for each mandatory field, keyed like ClientData. */
    field(key) {
        return this[key];
    }
    async goto(applicationId) {
        await this.page.goto(`/applications/${applicationId}/client`);
        await expect(this.root).toBeVisible();
    }
    async fill(d) {
        await this.firstName.fill(d.firstName);
        await this.middleName.fill(d.middleName ?? '');
        await this.lastName.fill(d.lastName);
        await this.dob.fill(d.dob);
        await this.gender.selectOption(d.gender);
        await this.maritalStatus.selectOption(d.maritalStatus);
        await this.nationality.fill(d.nationality);
        await this.occupation.fill(d.occupation);
        await this.employerName.fill(d.employerName);
        await this.employerAddress.fill(d.employerAddress);
    }
    async save(options = {}) {
        if (options.ignoreBrowserValidation)
            await disableBrowserValidation(this.page, 'client-information-form');
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
    async fillAndSave(d) {
        await this.fill(d);
        await this.save();
        await expect(this.page).toHaveURL(/address-contact/);
    }
    async values() {
        return {
            firstName: await this.firstName.inputValue(),
            lastName: await this.lastName.inputValue(),
            dob: await this.dob.inputValue(),
            gender: await this.gender.inputValue(),
            maritalStatus: await this.maritalStatus.inputValue(),
            nationality: await this.nationality.inputValue(),
            occupation: await this.occupation.inputValue(),
            employerName: await this.employerName.inputValue(),
            employerAddress: await this.employerAddress.inputValue(),
        };
    }
}
exports.ClientInformationPage = ClientInformationPage;
