"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, asRole, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { DocumentUploadPage } = require("../../pages/DocumentUploadPage");
const { ReviewPage } = require("../../pages/ReviewPage");
const { buildApplication } = require("../../utils/applicationBuilder");
const { anyMatches, expectApiError } = require("../../utils/assertions");
const { makeFile } = require("../../utils/fileUploadHelper");
const { MSG } = require("../../utils/messages");
test.use(asRole('learner'));
const agent = () => emailOf('learner');
test.describe('Document upload', () => {
    test("TC-DOC-001 | DOC-V01 | Verify that supported documents (PDF, JPG, PNG) can be uploaded", { "tag": ["@regression", "@smoke", "@api", "@documents", "@P1"], "annotation": [{ "type": "validation-id", "description": "DOC-V01" }, { "type": "risk", "description": "R-DOC-02" }, { "type": "priority", "description": "P1" }] }, async ({ page, api }) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
        const docs = new DocumentUploadPage(page);
        await docs.goto(app.id);
        const uploads = [
            { type: 'KYC_ID', file: makeFile('pdf', `kyc-${app.id}.pdf`) },
            { type: 'ADDRESS_PROOF', file: makeFile('jpg', `address-${app.id}.jpg`) },
            { type: 'INCOME_PROOF', file: makeFile('png', `income-${app.id}.png`) },
        ];
        for (const [i, u] of uploads.entries()) {
            await test.step(`upload ${u.type} (${u.file.name})`, async () => {
                await docs.upload(u.type, u.file);
                await docs.expectNoErrors();
                await expect(docs.rows()).toHaveCount(i + 1);
                expect((await docs.rowTexts()).join(' | ')).toContain(u.file.name);
            });
        }
        await test.step('documents persist after reload and are stored by the API', async () => {
            await docs.goto(app.id);
            await expect(docs.rows()).toHaveCount(3);
            const res = await api.getApplication(app.id, agent());
            expect(res.body?.data?.documents ?? []).toHaveLength(3);
        });
    });
    test("TC-DOC-002 | DOC-V02 | Verify that unsupported file types are blocked", { "tag": ["@regression", "@api", "@documents", "@P3"], "annotation": [{ "type": "validation-id", "description": "DOC-V02" }, { "type": "risk", "description": "R-DOC-01" }, { "type": "priority", "description": "P3" }] }, async ({ page, api }, testInfo) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
        const docs = new DocumentUploadPage(page);
        // KYC_ID rejection is covered by TC-KYC-002; other document types are used here.
        const cases = [
            { type: 'ADDRESS_PROOF', file: makeFile('exe'), hard: true },
            { type: 'INCOME_PROOF', file: makeFile('txt'), hard: true },
            { type: 'OTHER', file: makeFile('fake-pdf'), hard: false }, // text content renamed .pdf
        ];
        for (const c of cases) {
            await test.step(`${c.type}: ${c.file.name}`, async () => {
                await docs.goto(app.id);
                await docs.upload(c.type, c.file);
                const rejected = (await docs.rows().count()) === 0;
                if (c.hard) {
                    await docs.expectErrorMatching(MSG.docFormat);
                    expect(rejected, 'nothing stored').toBe(true);
                }
                else {
                    testInfo.annotations.push({ type: 'observation', description: `Text file renamed .pdf rejected: ${rejected}` });
                    expect.soft(rejected, 'content-based check: a renamed text file should be rejected').toBe(true);
                }
            });
        }
    });
    test("TC-DOC-004 | DOC-V04 | Verify that missing KYC_ID document prevents submission", { "tag": ["@regression", "@api", "@documents", "@SDC-06", "@P1"], "annotation": [{ "type": "validation-id", "description": "DOC-V04" }, { "type": "risk", "description": "R-KYC-02" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-06" }] }, async ({ page, api }) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'beneficiaries' }); // everything except documents
        const review = new ReviewPage(page);
        await review.goto(app.id);
        expect(anyMatches(await review.errors(), MSG.docRequired), 'missing KYC_ID listed').toBe(true);
        await expect(review.submitButton).toBeDisabled();
        await test.step('API submit is rejected and the application stays a draft', async () => {
            const res = await api.submit(app.id, agent());
            expectApiError(res, 422, MSG.docRequired);
            const status = await api.status(app.id, agent());
            expect(status.body?.data?.application_status).toBe('DRAFT');
            expect(status.body?.data?.application_reference_number ?? '').not.toMatch(/^WL\d+/);
        });
    });
});
test.describe('Validation summary and submit control', () => {
    test("TC-DOC-007 | VAL-V03 | Verify that submit remains disabled until critical errors are resolved", { "tag": ["@regression", "@api", "@documents", "@SDC-17", "@P1"], "annotation": [{ "type": "validation-id", "description": "VAL-V03" }, { "type": "risk", "description": "R-WF-02" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-17" }] }, async ({ page, api }) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'beneficiaries' }); // only the KYC_ID document is missing
        const review = new ReviewPage(page);
        const docs = new DocumentUploadPage(page);
        await test.step('one blocking error: Submit is disabled', async () => {
            await review.goto(app.id);
            expect((await review.errors()).length).toBeGreaterThan(0);
            await expect(review.submitButton).toBeDisabled();
        });
        await test.step('resolving it enables Submit', async () => {
            await docs.goto(app.id);
            await docs.upload('KYC_ID', makeFile('pdf', `kyc-${app.id}.pdf`));
            await docs.expectNoErrors();
            await review.goto(app.id);
            await review.runValidation();
            await expect(review.passedBox).toBeVisible();
            await expect(review.submitButton).toBeEnabled();
        });
        await test.step('API refuses to submit an application that still has errors', async () => {
            const incomplete = await buildApplication(api, { agentEmail: agent(), upTo: 'client' });
            expectApiError(await api.submit(incomplete.id, agent()), 422, MSG.validationFailed);
            expect((await api.status(incomplete.id, agent())).body?.data?.application_status).toBe('DRAFT');
        });
    });
});
