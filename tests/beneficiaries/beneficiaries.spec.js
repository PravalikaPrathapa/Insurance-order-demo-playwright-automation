"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, asRole, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { beneficiary, GUARDIAN } = require("../../fixtures/applicationData");
const { BeneficiaryPage } = require("../../pages/BeneficiaryPage");
const { ReviewPage } = require("../../pages/ReviewPage");
const { buildApplication } = require("../../utils/applicationBuilder");
const { anyMatches } = require("../../utils/assertions");
const { MSG } = require("../../utils/messages");
const { dobForAge } = require("../../utils/dataGenerator");
test.use(asRole('learner'));
const agent = () => emailOf('learner');
/** Application positioned at the beneficiaries step (client..riders done through the API, no beneficiaries yet). */
async function atBeneficiaries(api) {
    return (await buildApplication(api, { agentEmail: agent(), upTo: 'riders' })).id;
}
/** Does the allocation error show on the beneficiaries page, or only on the review page? */
async function totalErrorSurface(page, ben, id, pattern) {
    if (pattern.test(await ben.errorsText()))
        return 'page';
    const review = new ReviewPage(page);
    await review.goto(id);
    return anyMatches(await review.errors(), pattern) ? 'review' : null;
}
test.describe('Beneficiary management', () => {
    test("TC-BEN-001 | BEN-V01 | Verify that add a eligible primary beneficiary (and irrevocable confirmation)", { "tag": ["@regression", "@smoke", "@beneficiary", "@P1"], "annotation": [{ "type": "validation-id", "description": "BEN-V01" }, { "type": "risk", "description": "R-BEN-04, R-BEN-06" }, { "type": "priority", "description": "P1" }] }, async ({ page, api }) => {
        const id = await atBeneficiaries(api);
        const ben = new BeneficiaryPage(page);
        await ben.goto(id);
        const primary = beneficiary({ allocation: 100 });
        await ben.addAndExpectRow(primary, 1);
        await expect(page.getByText(primary.lastName).first()).toBeVisible();
        expect(await ben.primaryTotal()).toBe(100);
        await expect(ben.errorSummary).toHaveCount(0);
        await test.step('extension: irrevocable designation asks for confirmation (browser confirm dialog)', async () => {
            const secondary = beneficiary({ level: 'SECONDARY', allocation: 50, relationship: 'CHILD', irrevocable: true });
            const before = await ben.rowIds();
            const declined = await ben.add(secondary, 'dismiss');
            expect(declined.dialogs.join(' ')).toMatch(MSG.irrevocableDialog);
            await ben.goto(id);
            await expect(ben.rows(), 'declining the confirmation does not save').toHaveCount(1);
            const accepted = await ben.add(secondary, 'accept');
            expect(accepted.dialogs.join(' ')).toMatch(MSG.irrevocableDialog);
            await expect(ben.rows()).toHaveCount(2);
            const newId = (await ben.rowIds()).find((x) => !before.includes(x));
            await expect(page.getByTestId(`beneficiary-irrevocable-badge-${newId}`)).toBeVisible();
        });
    });
    test("TC-BEN-002 | BEN-V02 | Verify that primary allocation below 100% is flagged and prevents submission", { "tag": ["@regression", "@beneficiary", "@SDC-13", "@P1"], "annotation": [{ "type": "validation-id", "description": "BEN-V02" }, { "type": "risk", "description": "R-BEN-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-13" }] }, async ({ page, api }, testInfo) => {
        const id = await atBeneficiaries(api);
        const ben = new BeneficiaryPage(page);
        await ben.goto(id);
        await ben.addAndExpectRow(beneficiary({ allocation: 60 }), 1);
        await ben.addAndExpectRow(beneficiary({ allocation: 30, relationship: 'CHILD' }), 2);
        expect(await ben.primaryTotal()).toBe(90);
        const where = await totalErrorSurface(page, ben, id, MSG.primaryTotal);
        testInfo.annotations.push({ type: 'observation', description: `Primary-total error shown on: ${where ?? 'NOWHERE'}` });
        expect(where, '90% must raise "must total exactly 100%"').not.toBeNull();
        await test.step('review page keeps Submit disabled', async () => {
            const review = new ReviewPage(page);
            await review.goto(id);
            await expect(review.submitButton).toBeDisabled();
        });
        await test.step('adding 10% fixes the total and clears the error', async () => {
            await ben.goto(id);
            await ben.addAndExpectRow(beneficiary({ allocation: 10, relationship: 'SIBLING' }), 3);
            expect(await ben.primaryTotal()).toBe(100);
            const review = new ReviewPage(page);
            await review.goto(id);
            expect(anyMatches(await review.errors(), MSG.primaryTotal)).toBe(false);
        });
    });
    test("TC-BEN-003 | BEN-V03 | Verify that primary allocation above 100% is blocked", { "tag": ["@regression", "@beneficiary", "@SDC-13", "@P1"], "annotation": [{ "type": "validation-id", "description": "BEN-V03" }, { "type": "risk", "description": "R-BEN-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-13" }] }, async ({ page, api }) => {
        const id = await atBeneficiaries(api);
        const ben = new BeneficiaryPage(page);
        await ben.goto(id);
        await ben.addAndExpectRow(beneficiary({ allocation: 60 }), 1);
        // The page raises a browser alert() when the new total would exceed 100%.
        const result = await ben.add(beneficiary({ allocation: 50, relationship: 'CHILD' }));
        expect(result.dialogs.join(' '), 'over-allocation alert').toMatch(MSG.overAllocationDialog);
        await ben.goto(id);
        await expect(ben.rows(), 'second beneficiary was not saved').toHaveCount(1);
        expect(await ben.primaryTotal()).toBe(60);
    });
    test("TC-BEN-004 | BEN-V04 | Verify that secondary allocation is validated separately", { "tag": ["@regression", "@beneficiary", "@SDC-13", "@P1"], "annotation": [{ "type": "validation-id", "description": "BEN-V04" }, { "type": "risk", "description": "R-BEN-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-13" }] }, async ({ page, api }, testInfo) => {
        const id = await atBeneficiaries(api);
        const ben = new BeneficiaryPage(page);
        await ben.goto(id);
        await ben.addAndExpectRow(beneficiary({ allocation: 100 }), 1);
        await ben.addAndExpectRow(beneficiary({ level: 'SECONDARY', allocation: 50, relationship: 'CHILD' }), 2);
        await ben.addAndExpectRow(beneficiary({ level: 'SECONDARY', allocation: 30, relationship: 'SIBLING' }), 3);
        expect(await ben.primaryTotal(), 'primary group is complete').toBe(100);
        expect(await ben.secondaryTotal(), 'secondary group has its own running total').toBe(80);
        const review = new ReviewPage(page);
        await review.goto(id);
        const errors = await review.errors();
        testInfo.annotations.push({
            type: 'observation',
            description: `Review errors with secondary at 80%: ${errors.filter((e) => /benef|alloc|secondary/i.test(e)).join(' | ') || 'none about beneficiaries'}`,
        });
        expect(anyMatches(errors, MSG.primaryTotal), 'primary error must not appear while primary is 100%').toBe(false);
        await test.step('completing the secondary group to 100%', async () => {
            await ben.goto(id);
            await ben.addAndExpectRow(beneficiary({ level: 'SECONDARY', allocation: 20, relationship: 'PARENT' }), 4);
            expect(await ben.secondaryTotal()).toBe(100);
        });
    });
    test("TC-BEN-005 | BEN-V05 | Verify that minor beneficiary requires guardian details", { "tag": ["@regression", "@beneficiary", "@SDC-14", "@P1"], "annotation": [{ "type": "validation-id", "description": "BEN-V05" }, { "type": "risk", "description": "R-BEN-02" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-14" }] }, async ({ page, api }) => {
        const id = await atBeneficiaries(api);
        const ben = new BeneficiaryPage(page);
        await ben.goto(id);
        const minor = beneficiary({ dob: dobForAge(17), allocation: 50, relationship: 'CHILD' });
        await test.step('minor without guardian is rejected', async () => {
            await expect(ben.guardianSection).toBeVisible();
            await ben.add(minor);
            expect(await ben.errorsText()).toMatch(MSG.guardian);
            await expect(ben.rows()).toHaveCount(0);
        });
        await test.step('minor with guardian details and legal acknowledgement is saved', async () => {
            await ben.goto(id);
            await ben.add({ ...minor, guardian: GUARDIAN, legalAcknowledgement: true });
            await expect(ben.rows()).toHaveCount(1);
        });
        await test.step('an adult needs no guardian', async () => {
            await ben.goto(id);
            await ben.add(beneficiary({ dob: dobForAge(30), allocation: 50, relationship: 'SIBLING' }));
            await expect(ben.rows()).toHaveCount(2);
        });
    });
    test("TC-BEN-008 | BEN-V08 | Verify that duplicate beneficiary is blocked", { "tag": ["@regression", "@api", "@beneficiary", "@SDC-15", "@P2"], "annotation": [{ "type": "validation-id", "description": "BEN-V08" }, { "type": "risk", "description": "R-BEN-03" }, { "type": "priority", "description": "P2" }, { "type": "seeded-defect-candidate", "description": "SDC-15" }] }, async ({ page, api }) => {
        const id = await atBeneficiaries(api);
        const ben = new BeneficiaryPage(page);
        await ben.goto(id);
        const original = beneficiary({ allocation: 40 });
        await ben.addAndExpectRow(original, 1);
        await test.step('same name + date of birth + relationship is blocked', async () => {
            await ben.add({ ...original });
            expect(await ben.errorsText(), 'duplicate error').toMatch(MSG.duplicate);
            await ben.goto(id);
            await expect(ben.rows()).toHaveCount(1);
            const list = await api.listBeneficiaries(id, agent());
            expect(list.body?.data, 'API holds a single record').toHaveLength(1);
        });
        await test.step('a different relationship is a different beneficiary', async () => {
            await ben.addAndExpectRow({ ...original, relationship: 'CHILD' }, 2);
        });
    });
});
