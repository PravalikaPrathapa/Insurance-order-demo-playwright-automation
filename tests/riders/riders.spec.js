"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, asRole, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { product, RIDERS } = require("../../fixtures/referenceData");
const { RiderSelectionPage } = require("../../pages/RiderSelectionPage");
const { buildApplication } = require("../../utils/applicationBuilder");
const { expectApiError } = require("../../utils/assertions");
const { MSG } = require("../../utils/messages");
const { periodPremium, totalPremium } = require("../../utils/premium");
const { dobForAge } = require("../../utils/dataGenerator");
test.use(asRole('learner'));
const agent = () => emailOf('learner');
const BASE = product('WL_SECURE_BASIC');
const FACE = 250000;
/** Application with client age 40, SecureLife 250,000 monthly saved, positioned at the riders step. */
async function atRiders(api, opts = {}) {
    return buildApplication(api, {
        agentEmail: agent(), upTo: 'product',
        client: opts.age ? { dob: dobForAge(opts.age) } : undefined,
        product: { productCode: BASE.code, faceValue: opts.face ?? FACE, frequency: 'MONTHLY' },
    });
}
async function riderPayload(api, picks) {
    const out = [];
    for (const p of picks)
        out.push({ rider_id: await api.riderId(RIDERS[p.key].code), coverage_amount: p.coverage });
    return out;
}
test.describe('Rider selection', () => {
    test("TC-RID-001 | RIDER-V01 | Verify that an agent is able to add an eligible protection rider (ADB)", { "tag": ["@regression", "@smoke", "@rider", "@P2"], "annotation": [{ "type": "validation-id", "description": "RIDER-V01" }, { "type": "risk", "description": "R-RID-05" }, { "type": "priority", "description": "P2" }] }, async ({ page, api }) => {
        const app = await atRiders(api);
        const riders = new RiderSelectionPage(page);
        await riders.goto(app.id);
        await riders.select('ADB', FACE);
        await riders.saveAndExpectNext();
        await test.step('rider is stored and itemised in the premium', async () => {
            await riders.goto(app.id);
            expect(await riders.isSelected('ADB')).toBe(true);
            const adb = periodPremium(FACE, RIDERS.ADB.ratePer1000, 'MONTHLY'); // 17.71
            expect(await riders.summaryText()).toContain(adb.toFixed(2));
            const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, [{ coverage: FACE, rate: RIDERS.ADB.ratePer1000 }], 'MONTHLY'); // 116.67
            const stored = Number((await api.getApplication(app.id, agent())).body?.data?.total_premium);
            expect(stored, 'API total premium includes the rider').toBe(total);
        });
    });
    test("TC-RID-002 | RIDER-V02 | Verify that rider coverage cannot exceed the base coverage amount", { "tag": ["@regression", "@api", "@rider", "@SDC-10", "@P1"], "annotation": [{ "type": "validation-id", "description": "RIDER-V02" }, { "type": "risk", "description": "R-RID-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-10" }] }, async ({ page, api }) => {
        const riders = new RiderSelectionPage(page);
        await test.step('ADB at face value + 1 is rejected, at face value accepted', async () => {
            const app = await atRiders(api);
            await riders.goto(app.id);
            await riders.select('ADB', FACE + 1);
            await riders.save();
            await expect(page).toHaveURL(/\/riders/);
            await riders.expectErrorMatching(MSG.riderAboveBase);
            await riders.goto(app.id);
            await riders.select('ADB', FACE);
            await riders.saveAndExpectNext();
        });
        await test.step('API rejects the same request', async () => {
            const app = await atRiders(api);
            const res = await api.saveRiders(app.id, agent(), await riderPayload(api, [{ key: 'ADB', coverage: FACE + 1 }]));
            expectApiError(res, 422, MSG.riderAboveBase);
        });
        await test.step('Critical Illness is capped at 500,000 even when the base is larger', async () => {
            const app = await atRiders(api, { face: 1000000 });
            await riders.goto(app.id);
            await riders.select('CI', 500001);
            await riders.save();
            await expect(page).toHaveURL(/\/riders/);
            await riders.expectErrorMatching(MSG.riderAboveMax);
        });
    });
    test("TC-RID-003 | RIDER-V03 | Verify that age-ineligible rider cannot be added", { "tag": ["@regression", "@api", "@rider", "@P2"], "annotation": [{ "type": "validation-id", "description": "RIDER-V03" }, { "type": "risk", "description": "R-RID-03" }, { "type": "priority", "description": "P2" }] }, async ({ page, api }) => {
        // Waiver of Premium - Disability is for ages 18-55; the client below is 56.
        const app = await atRiders(api, { age: 56 });
        const riders = new RiderSelectionPage(page);
        await riders.goto(app.id);
        await riders.select('WAIVER_DISABILITY', FACE);
        await riders.save();
        await expect(page).toHaveURL(/\/riders/);
        await riders.expectErrorMatching(MSG.riderAge);
        await test.step('API rejects it as well', async () => {
            const res = await api.saveRiders(app.id, agent(), await riderPayload(api, [{ key: 'WAIVER_DISABILITY', coverage: FACE }]));
            expectApiError(res, 422, MSG.riderAge);
        });
        await test.step('an eligible age (50) is accepted', async () => {
            const eligible = await atRiders(api, { age: 50 });
            await riders.goto(eligible.id);
            await riders.select('WAIVER_DISABILITY', FACE);
            await riders.saveAndExpectNext();
        });
    });
    test("TC-RID-007 | RIDER-V07 | Verify that rider premiums are listed separately in the total premium", { "tag": ["@regression", "@api", "@rider", "@SDC-12", "@P2"], "annotation": [{ "type": "validation-id", "description": "RIDER-V07" }, { "type": "risk", "description": "R-RID-05" }, { "type": "priority", "description": "P2" }, { "type": "seeded-defect-candidate", "description": "SDC-12" }] }, async ({ page, api }) => {
        const app = await atRiders(api);
        const riders = new RiderSelectionPage(page);
        const picks = [{ key: 'ADB', coverage: FACE }, { key: 'HOSPITAL', coverage: 100000 }];
        const rate = (k) => RIDERS[k].ratePer1000;
        await riders.goto(app.id);
        for (const p of picks)
            await riders.select(p.key, p.coverage);
        await riders.saveAndExpectNext();
        await test.step('itemised premiums and total with both riders', async () => {
            await riders.goto(app.id);
            const text = await riders.summaryText();
            for (const p of picks)
                expect(text, `${p.key} premium itemised`).toContain(periodPremium(p.coverage, rate(p.key), 'MONTHLY').toFixed(2));
            const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, picks.map((p) => ({ coverage: p.coverage, rate: rate(p.key) })), 'MONTHLY');
            expect(Number((await api.getApplication(app.id, agent())).body?.data?.total_premium), 'API total').toBe(total);
        });
        await test.step('removing a rider lowers the total', async () => {
            await riders.deselect('HOSPITAL');
            await riders.saveAndExpectNext();
            const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, [{ coverage: FACE, rate: rate('ADB') }], 'MONTHLY');
            expect(Number((await api.getApplication(app.id, agent())).body?.data?.total_premium), 'API total after removal').toBe(total);
        });
    });
});
