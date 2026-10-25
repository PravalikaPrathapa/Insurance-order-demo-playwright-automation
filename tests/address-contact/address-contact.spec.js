"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, asRole, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { addressData } = require("../../fixtures/applicationData");
const { AddressContactPage } = require("../../pages/AddressContactPage");
const { buildApplication } = require("../../utils/applicationBuilder");
const { MSG } = require("../../utils/messages");
test.use(asRole('learner'));
/** Set-up through the API: a draft that already has client data, so the UI starts at the address step. */
async function draftWithClient(api) {
    return (await buildApplication(api, { agentEmail: emailOf('learner'), upTo: 'client' })).id;
}
test.describe('Address and contact information', () => {
    test("TC-ADR-001 | CLI-V06 | Verify that same-as-residential duplicates the address to mailing", { "tag": ["@regression", "@smoke", "@address", "@P3"], "annotation": [{ "type": "validation-id", "description": "CLI-V06" }, { "type": "risk", "description": "R-ADR-01" }, { "type": "priority", "description": "P3" }] }, async ({ page, api }, testInfo) => {
        const id = await draftWithClient(api);
        const address = new AddressContactPage(page);
        await address.goto(id);
        await address.fillResidential({ line1: '10 Main St', city: 'New York', state: 'NY', postalCode: '10001' });
        await test.step('ticking the box copies residential data into mailing', async () => {
            await address.setSameAsResidential(true);
            expect(await address.mailingValues()).toEqual(await address.residentialValues());
        });
        await test.step('editing residential afterwards (observation: does mailing follow?)', async () => {
            await address.resLine1.fill('99 Changed Ave');
            const mailing = await address.mailingValues();
            testInfo.annotations.push({
                type: 'observation',
                description: `After editing residential with the box ticked, mailing line 1 = "${mailing.line1}"`,
            });
        });
        await test.step('unticking makes the mailing address editable again', async () => {
            await address.setSameAsResidential(false);
            await expect(address.mailLine1).toBeEnabled();
            await address.setSameAsResidential(true);
        });
        await test.step('saved result: mailing equals residential after reload', async () => {
            await address.resLine1.fill('10 Main St');
            await address.fillContact(addressData());
            await address.save();
            await expect(page).toHaveURL(/kyc-financial/);
            await address.goto(id);
            expect(await address.mailingValues()).toEqual(await address.residentialValues());
        });
    });
    test("TC-ADR-002 | CLI-V07a | Verify that invalid email formats are blocked", { "tag": ["@regression", "@address", "@P3"], "annotation": [{ "type": "validation-id", "description": "CLI-V07a" }, { "type": "risk", "description": "R-ADR-02" }, { "type": "priority", "description": "P3" }] }, async ({ page, api }, testInfo) => {
        const id = await draftWithClient(api);
        const address = new AddressContactPage(page);
        const invalid = ['abc', 'a@@b.com', 'a b@c.com', '@example.com', 'user@'];
        for (const email of invalid) {
            await test.step(`rejects "${email}"`, async () => {
                await address.goto(id);
                await address.fill(addressData({ email }));
                await address.save({ ignoreBrowserValidation: true });
                await expect(page).toHaveURL(/address-contact/);
                expect((await address.errorMessages()).join(' ')).toMatch(MSG.email);
            });
        }
        await test.step('observation: "a@b" (no domain dot) is valid under RFC rules', async () => {
            await address.goto(id);
            await address.fill(addressData({ email: 'a@b' }));
            await address.save({ ignoreBrowserValidation: true });
            const accepted = /kyc-financial/.test(page.url());
            testInfo.annotations.push({ type: 'observation', description: `Email "a@b" accepted by the server: ${accepted}` });
        });
        await test.step('a valid email is accepted', async () => {
            await address.goto(id);
            await address.fill(addressData({ email: 'qa.user@example.com' }));
            await address.save();
            await expect(page).toHaveURL(/kyc-financial/);
        });
    });
    test("TC-ADR-003 | CLI-V07b | Verify that invalid US phone formats are blocked", { "tag": ["@regression", "@address", "@P3"], "annotation": [{ "type": "validation-id", "description": "CLI-V07b" }, { "type": "risk", "description": "R-ADR-02" }, { "type": "priority", "description": "P3" }] }, async ({ page, api }) => {
        const id = await draftWithClient(api);
        const address = new AddressContactPage(page);
        const invalid = ['123', '(055) 123-4567', '+44 20 7946 0958', '555-0100'];
        for (const phone of invalid) {
            await test.step(`mobile "${phone}" is rejected`, async () => {
                await address.goto(id);
                await address.fill(addressData({ mobile: phone }));
                await address.save({ ignoreBrowserValidation: true });
                await expect(page).toHaveURL(/address-contact/);
                await address.expectErrorMatching(MSG.phone);
            });
        }
        await test.step('alternate phone is validated the same way', async () => {
            await address.goto(id);
            await address.fill(addressData({ alternatePhone: '123' }));
            await address.save({ ignoreBrowserValidation: true });
            await expect(page).toHaveURL(/address-contact/);
            await address.expectErrorMatching(MSG.phone);
        });
        for (const phone of ['(212) 555-0147', '+1 212-555-0147', '2125550147']) {
            await test.step(`mobile "${phone}" is accepted`, async () => {
                await address.goto(id);
                await address.fill(addressData({ mobile: phone }));
                await address.save();
                await expect(page).toHaveURL(/kyc-financial/);
            });
        }
    });
});
