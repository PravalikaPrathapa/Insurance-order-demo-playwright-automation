"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, asRole, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { beneficiary, GUARDIAN, clientData, addressData, kycData, productData } = require("../../fixtures/applicationData");
const { AddressContactPage } = require("../../pages/AddressContactPage");
const { ApplicationStatusPage } = require("../../pages/ApplicationStatusPage");
const { BeneficiaryPage } = require("../../pages/BeneficiaryPage");
const { ClientInformationPage } = require("../../pages/ClientInformationPage");
const { ConfirmationPage } = require("../../pages/ConfirmationPage");
const { DashboardPage } = require("../../pages/DashboardPage");
const { DocumentUploadPage } = require("../../pages/DocumentUploadPage");
const { KycFinancialPage } = require("../../pages/KycFinancialPage");
const { ProductConfigurationPage } = require("../../pages/ProductConfigurationPage");
const { ReviewPage } = require("../../pages/ReviewPage");
const { RiderSelectionPage } = require("../../pages/RiderSelectionPage");
const { buildApplication } = require("../../utils/applicationBuilder");
const { expectApiSuccess } = require("../../utils/assertions");
const { dobForAge } = require("../../utils/dataGenerator");
const { makeFile } = require("../../utils/fileUploadHelper");
const { REFERENCE_NUMBER } = require("../../utils/messages");
test.use(asRole('learner'));
const agent = () => emailOf('learner');
/** The two data sets of the end-to-end test (TD-E2E-01 and TD-E2E-02). */
const FLOWS = [
    {
        label: 'E2E-01: SecureLife, ADB rider, one individual beneficiary',
        clientAge: 40,
        product: { productCode: 'WL_SECURE_BASIC', faceValue: 250000, frequency: 'MONTHLY', paymentTerm: 20, policyTerm: 'WHOLE_LIFE' },
        riders: [{ key: 'ADB', coverage: 250000 }],
        beneficiaries: [beneficiary({ allocation: 100 })],
    },
    {
        label: 'E2E-02: FlexiPay quarterly, Hospital Cash rider, trust primary and minor secondary with guardian',
        clientAge: 55,
        product: { productCode: 'WL_FLEXI_PAY', faceValue: 300000, frequency: 'QUARTERLY', paymentTerm: 15, policyTerm: 'TO_AGE_100' },
        riders: [{ key: 'HOSPITAL', coverage: 100000 }],
        beneficiaries: [
            beneficiary({ type: 'TRUST', relationship: 'TRUST', allocation: 100, trustName: 'QA Family Trust', trusteeName: 'Pat Trustee', trustDate: dobForAge(1) }),
            beneficiary({ level: 'SECONDARY', relationship: 'CHILD', allocation: 100, dob: dobForAge(10), guardian: GUARDIAN, legalAcknowledgement: true }),
        ],
    },
];
async function submitViaReview(page, id) {
    const review = new ReviewPage(page);
    await review.goto(id);
    await expect(review.passedBox, 'no blocking errors before submit').toBeVisible();
    await review.submit();
    const confirmation = new ConfirmationPage(page);
    await confirmation.expectShown();
    return confirmation.referenceNumber();
}
test.describe('Submission and status tracking', () => {
    test("TC-WF-001 | WF-V01 | Verify that incomplete application is saved as a draft", { "tag": ["@regression", "@workflow", "@SDC-16", "@P1"], "annotation": [{ "type": "validation-id", "description": "WF-V01" }, { "type": "risk", "description": "R-WF-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-16" }] }, async ({ page }) => {
        // The app has no separate "Save draft" button: the draft is created at the start page and saved by each Save and Continue.
        const dashboard = new DashboardPage(page);
        await dashboard.goto();
        const id = await dashboard.startNewApplication();
        await new ClientInformationPage(page).fillAndSave(clientData());
        await new AddressContactPage(page).fillAndSave(addressData());
        await dashboard.goto();
        expect(await dashboard.statusOf(id)).toBe('DRAFT');
        await expect(page.getByTestId(`application-open-${id}`)).toBeVisible();
    });
    test("TC-WF-002 | WF-V02 | Verify that draft can be resumed with the saved data", { "tag": ["@regression", "@api", "@workflow", "@SDC-16", "@P1"], "annotation": [{ "type": "validation-id", "description": "WF-V02" }, { "type": "risk", "description": "R-WF-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-16" }] }, async ({ otherAgent, api }) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
        // A fresh browser context with the same login stands in for "log out, log in again".
        const page = await otherAgent('learner');
        const dashboard = new DashboardPage(page);
        await dashboard.goto();
        await dashboard.openApplication(app.id);
        await test.step('client data is restored', async () => {
            const client = new ClientInformationPage(page);
            await client.goto(app.id);
            expect(await client.values()).toMatchObject({
                firstName: app.client.firstName, lastName: app.client.lastName, dob: app.client.dob,
                gender: app.client.gender, nationality: app.client.nationality, occupation: app.client.occupation,
            });
            const res = await api.getClient(app.id, agent());
            expect(res.body?.data?.first_name).toBe(app.client.firstName);
        });
        await test.step('address and contact data are restored', async () => {
            const address = new AddressContactPage(page);
            await address.goto(app.id);
            await expect(address.resLine1).toHaveValue(app.address.line1);
            await expect(address.email).toHaveValue(app.address.email);
            await expect(address.preferredMode).toHaveValue(app.address.preferredMode);
        });
    });
    test("TC-WF-003 | WF-V03 | Verify that a complete application can be submitted end to end", { "tag": ["@regression", "@smoke", "@e2e", "@api", "@workflow", "@P1"], "annotation": [{ "type": "validation-id", "description": "WF-V03" }, { "type": "risk", "description": "R-WF-03" }, { "type": "priority", "description": "P1" }] }, async ({ page, api }) => {
        test.setTimeout(240000);
        for (const flow of FLOWS) {
            await test.step(flow.label, async () => {
                const dashboard = new DashboardPage(page);
                await dashboard.goto();
                const id = await dashboard.startNewApplication();
                await new ClientInformationPage(page).fillAndSave(clientData({ dob: dobForAge(flow.clientAge) }));
                await new AddressContactPage(page).fillAndSave(addressData());
                await new KycFinancialPage(page).fillAndSave(kycData());
                await new ProductConfigurationPage(page).fillAndSave(productData(flow.product));
                const riders = new RiderSelectionPage(page);
                for (const r of flow.riders)
                    await riders.select(r.key, r.coverage);
                await riders.saveAndExpectNext();
                const ben = new BeneficiaryPage(page);
                for (const [i, b] of flow.beneficiaries.entries())
                    await ben.addAndExpectRow(b, i + 1);
                await ben.continueLink.click();
                await expect(page).toHaveURL(/\/documents/);
                const docs = new DocumentUploadPage(page);
                await docs.upload('KYC_ID', makeFile('pdf', `kyc-${id}.pdf`));
                await docs.expectNoErrors();
                await docs.continueToReview();
                const reference = await submitViaReview(page, id);
                expect(reference, 'generated reference number').toMatch(REFERENCE_NUMBER);
                const status = new ApplicationStatusPage(page);
                await status.goto(id);
                expect(await status.currentStatus()).toBe('SUBMITTED');
                expect(await status.referenceNumber()).toBe(reference);
                await dashboard.goto();
                expect(await dashboard.statusOf(id)).toBe('SUBMITTED');
                const apiStatus = await api.status(id, agent());
                expectApiSuccess(apiStatus);
                expect(apiStatus.body.data.application_status).toBe('SUBMITTED');
                expect(apiStatus.body.data.application_reference_number).toBe(reference);
            });
        }
    });
    test("TC-WF-006 | WF-V06 | Verify that dashboard status refreshes after submission", { "tag": ["@regression", "@api", "@workflow", "@SDC-18", "@P1"], "annotation": [{ "type": "validation-id", "description": "WF-V06" }, { "type": "risk", "description": "R-WF-03, R-DASH-02" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-18" }] }, async ({ page, api }) => {
        const app = await buildApplication(api, { agentEmail: agent() });
        const dashboard = new DashboardPage(page);
        await dashboard.goto();
        expect(await dashboard.statusOf(app.id)).toBe('DRAFT');
        const draftBefore = await dashboard.summaryCount('draft');
        const submittedBefore = await dashboard.summaryCount('submitted');
        await submitViaReview(page, app.id);
        await dashboard.goto();
        expect(await dashboard.statusOf(app.id)).toBe('SUBMITTED');
        expect(await dashboard.summaryCount('draft'), 'draft counter decreases by one').toBe(draftBefore - 1);
        expect(await dashboard.summaryCount('submitted'), 'submitted counter increases by one').toBe(submittedBefore + 1);
    });
    test("TC-WF-007 | WF-V07 | Verify that status page agrees with the status API", { "tag": ["@regression", "@api", "@workflow", "@SDC-18", "@P1"], "annotation": [{ "type": "validation-id", "description": "WF-V07" }, { "type": "risk", "description": "R-DASH-02" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-18" }] }, async ({ page, api }) => {
        const app = await buildApplication(api, { agentEmail: agent() });
        expectApiSuccess(await api.submit(app.id, agent()));
        const apiStatus = (await api.status(app.id, agent())).body.data;
        const status = new ApplicationStatusPage(page);
        await status.goto(app.id);
        expect(await status.currentStatus(), 'current status').toBe(apiStatus.application_status);
        expect(await status.referenceNumber(), 'reference number').toBe(apiStatus.application_reference_number);
        await expect(status.historyRows(), 'history rows equal API history entries').toHaveCount(apiStatus.status_history.length);
    });
});
