"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, asRole, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { kycData, FAKE_SSN } = require("../../fixtures/applicationData");
const { KycFinancialPage } = require("../../pages/KycFinancialPage");
const { ReviewPage } = require("../../pages/ReviewPage");
const { buildApplication } = require("../../utils/applicationBuilder");
const { anyMatches, errorTexts } = require("../../utils/assertions");
const { errorSurface } = require("../../utils/flows");
const { MSG } = require("../../utils/messages");
test.use(asRole('learner'));
const agent = () => emailOf('learner');
test.describe('KYC, financial and compliance', () => {
    test("TC-KYC-001 | CLI-V08 | Verify that sSN is masked on every screen and response", { "tag": ["@regression", "@smoke", "@api", "@kyc", "@SDC-07", "@P1"], "annotation": [{ "type": "validation-id", "description": "CLI-V08" }, { "type": "risk", "description": "R-KYC-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-07" }] }, async ({ page, api }) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
        const kyc = new KycFinancialPage(page);
        await kyc.goto(app.id);
        await kyc.fillAndSave(kycData({ idType: 'SSN', idNumber: FAKE_SSN }));
        const digitsOnly = FAKE_SSN.replace(/-/g, '');
        const expectMasked = async (label) => {
            const html = await page.content();
            expect(html, `${label}: full SSN must not appear`).not.toContain(FAKE_SSN);
            expect(html, `${label}: unformatted SSN must not appear`).not.toContain(digitsOnly);
        };
        await test.step('KYC page after reload', async () => {
            await kyc.goto(app.id);
            await expectMasked('kyc page');
            const shown = await kyc.idNumber.inputValue();
            if (shown)
                expect(shown, 'field shows only the last four digits').toMatch(/\*+.*6789$|^6789$/);
        });
        await test.step('review page', async () => {
            const review = new ReviewPage(page);
            await review.goto(app.id);
            await expectMasked('review page');
        });
        await test.step('API response for the application', async () => {
            const res = await api.getApplication(app.id, agent());
            expect(res.text).not.toContain(FAKE_SSN);
            expect(res.text).not.toContain(digitsOnly);
            expect(res.text, 'masked value is present').toContain('6789');
        });
    });
    test("TC-KYC-003 | CLI-V10 | Verify that pEP = Yes requires details", { "tag": ["@regression", "@kyc", "@P2"], "annotation": [{ "type": "validation-id", "description": "CLI-V10" }, { "type": "risk", "description": "R-KYC-05" }, { "type": "priority", "description": "P2" }] }, async ({ page, api }, testInfo) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
        const kyc = new KycFinancialPage(page);
        await test.step('PEP Yes without details is flagged', async () => {
            await kyc.goto(app.id);
            await kyc.fill(kycData({ isPep: true, pepDetails: '' }));
            await kyc.save({ ignoreBrowserValidation: true });
            const where = await errorSurface(page, app.id, MSG.pepDetails);
            testInfo.annotations.push({ type: 'observation', description: `PEP-details error shown on: ${where ?? 'NOWHERE'}` });
            expect(where, 'PEP Yes with blank details must raise an error').not.toBeNull();
        });
        await test.step('PEP Yes with details is accepted and no PEP error remains', async () => {
            await kyc.goto(app.id);
            await kyc.fillAndSave(kycData({ isPep: true, pepDetails: 'Former city council member (QA test data)' }));
            const review = new ReviewPage(page);
            await review.goto(app.id);
            expect(anyMatches(await review.errors(), MSG.pepDetails)).toBe(false);
        });
        await test.step('PEP No does not need details', async () => {
            await kyc.goto(app.id);
            await kyc.fillAndSave(kycData({ isPep: false }));
        });
    });
    test("TC-KYC-004 | KYC-P01 | Verify that premium must be affordable against income (20%)", { "tag": ["@regression", "@api", "@kyc", "@SDC-08", "@P1"], "annotation": [{ "type": "validation-id", "description": "KYC-P01" }, { "type": "risk", "description": "R-KYC-03" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-08" }] }, async ({ page, api }) => {
        // SecureLife, face 250,000, monthly => annual premium 1,187.50. 20% limit: income 5,000 -> 1,000 (fails), 50,000 -> 10,000 (passes).
        const app = await buildApplication(api, {
            agentEmail: agent(), upTo: 'product', kyc: { annualIncome: 5000 },
        });
        const review = new ReviewPage(page);
        const kyc = new KycFinancialPage(page);
        await test.step('income 5,000 is flagged on the review page and by the validate API', async () => {
            await review.goto(app.id);
            expect(anyMatches(await review.errors(), MSG.affordability), 'affordability error on review page').toBe(true);
            const res = await api.validate(app.id, agent());
            expect(errorTexts(res).join(' | ')).toMatch(MSG.affordability);
        });
        await test.step('raising income to 50,000 clears the affordability error', async () => {
            await kyc.goto(app.id);
            await kyc.fillAndSave(kycData({ annualIncome: 50000 }));
            await review.goto(app.id);
            expect(anyMatches(await review.errors(), MSG.affordability)).toBe(false);
        });
    });
    test("TC-KYC-006 | KYC-P03 | Verify that incomplete compliance declaration prevents progress", { "tag": ["@regression", "@api", "@kyc", "@P2"], "annotation": [{ "type": "validation-id", "description": "KYC-P03" }, { "type": "risk", "description": "R-KYC-05" }, { "type": "priority", "description": "P2" }] }, async ({ page, api }, testInfo) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
        const kyc = new KycFinancialPage(page);
        await test.step('UI: declaration not ticked', async () => {
            await kyc.goto(app.id);
            await kyc.fill(kycData({ declaration: false }));
            await kyc.save({ ignoreBrowserValidation: true });
            const where = await errorSurface(page, app.id, MSG.declaration);
            testInfo.annotations.push({ type: 'observation', description: `Declaration error shown on: ${where ?? 'NOWHERE'}` });
            expect(where, 'unticked declaration must raise an error').not.toBeNull();
        });
        await test.step('API validate reports the missing declaration', async () => {
            const incomplete = await buildApplication(api, { agentEmail: agent(), upTo: 'product', kyc: { declaration: false } });
            const res = await api.validate(incomplete.id, agent());
            expect(errorTexts(res).join(' | ')).toMatch(MSG.declaration);
        });
    });
});
