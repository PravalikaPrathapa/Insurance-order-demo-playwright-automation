"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, asRole, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { beneficiary } = require("../../fixtures/applicationData");
const { PRODUCTS, product, RIDERS } = require("../../fixtures/referenceData");
const { ApiClient } = require("../../utils/apiClient");
const { buildApplication, toApiBeneficiary } = require("../../utils/applicationBuilder");
const { expectApiSuccess, expectApiError, errorTexts } = require("../../utils/assertions");
const { futureDate, dobForAge } = require("../../utils/dataGenerator");
const { env } = require("../../utils/env");
const { MSG } = require("../../utils/messages");
test.use(asRole('learner'));
const agent = () => emailOf('learner');
test.describe('API', () => {
    test("TC-API-001 | API-V01 | Verify that products API responds with 200 and the required schema", { "tag": ["@regression", "@smoke", "@api", "@P1"], "annotation": [{ "type": "validation-id", "description": "API-V01" }, { "type": "risk", "description": "R-API-03, R-PROD-05" }, { "type": "priority", "description": "P1" }] }, async ({ api }) => {
        const res = await api.products();
        expectApiSuccess(res);
        const items = res.body.data;
        expect(items).toHaveLength(PRODUCTS.length);
        for (const item of items) {
            for (const key of ['id', 'product_code', 'product_name', 'eligibility_age_min', 'eligibility_age_max', 'face_value_min', 'face_value_max', 'base_rate_per_1000', 'is_active']) {
                expect(item, `product has "${key}"`).toHaveProperty(key);
            }
            const ref = product(String(item.product_code));
            expect(item.product_name).toBe(ref.name);
            expect(Number(item.eligibility_age_min)).toBe(ref.ageMin);
            expect(Number(item.eligibility_age_max)).toBe(ref.ageMax);
            expect(Number(item.face_value_min)).toBe(ref.faceMin);
            expect(Number(item.face_value_max)).toBe(ref.faceMax);
            expect(Number(item.base_rate_per_1000)).toBeCloseTo(ref.ratePer1000, 4);
        }
        await test.step('riders API (extension)', async () => {
            const riders = await api.riders();
            expectApiSuccess(riders);
            const list = riders.body.data;
            expect(list).toHaveLength(Object.keys(RIDERS).length);
            for (const r of Object.values(RIDERS)) {
                const live = list.find((x) => x.rider_code === r.code);
                expect(live, `rider ${r.code} listed`).toBeTruthy();
                expect(Number(live?.eligibility_age_min)).toBe(r.ageMin);
                expect(Number(live?.eligibility_age_max)).toBe(r.ageMax);
            }
        });
    });
    test("TC-API-002 | API-V02 | Verify that application APIs require the API key", { "tag": ["@regression", "@smoke", "@api", "@P1"], "annotation": [{ "type": "validation-id", "description": "API-V02" }, { "type": "risk", "description": "R-API-02, R-AUTH-06" }, { "type": "priority", "description": "P1" }] }, async ({ api }, testInfo) => {
        const noKey = await ApiClient.create({ apiKey: null });
        const wrongKey = await ApiClient.create({ apiKey: 'definitely-wrong-key' });
        try {
            for (const [label, client] of [['no key', noKey], ['wrong key', wrongKey]]) {
                await test.step(label, async () => {
                    const list = await client.listApplications(agent());
                    expectApiError(list, 401, MSG.unauthorized);
                    const submit = await client.submit(1, agent());
                    expectApiError(submit, 401, MSG.unauthorized);
                    expect(list.text, 'no application data leaks').not.toMatch(/application_reference_number/);
                });
            }
            await test.step('health check is public', async () => {
                // The Lab Manual's health example sends the key, so whether health is public is only recorded, not asserted.
                const health = await noKey.health();
                testInfo.annotations.push({ type: 'observation', description: `GET health without a key: HTTP ${health.status}` });
            });
        }
        finally {
            await noKey.dispose();
            await wrongKey.dispose();
        }
        expect((await api.listApplications(agent())).status, 'valid key works').toBe(200);
    });
    test("TC-API-003 | API-V03 | Verify that client API prevents invalid dates of birth", { "tag": ["@regression", "@api", "@SDC-04", "@SDC-05", "@SDC-19", "@P1"], "annotation": [{ "type": "validation-id", "description": "API-V03" }, { "type": "risk", "description": "R-CLI-01, R-CLI-02, R-API-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-04, SDC-05, SDC-19" }] }, async ({ api }, testInfo) => {
        const draft = async () => (await buildApplication(api, { agentEmail: agent(), upTo: 'draft' })).id;
        const payload = (dob) => ({
            first_name: 'Qa', last_name: 'Tester', date_of_birth: dob, gender: 'MALE', marital_status: 'SINGLE',
            nationality: 'United States', occupation: 'Engineer', employer_name: 'Acme', employer_address: '1 Corporate Way',
        });
        await test.step('future date of birth is rejected', async () => {
            const id = await draft();
            const res = await api.saveClient(id, agent(), payload(futureDate(1)));
            expectApiError(res, 422, MSG.futureDob);
            expect(JSON.stringify(res.body.errors)).toMatch(/date_of_birth/);
        });
        for (const c of [{ label: 'age 17 years 364 days', dob: dobForAge(18, 1) }, { label: 'age 66', dob: dobForAge(66) }]) {
            await test.step(`${c.label}: rejected on save, or flagged by validate`, async () => {
                const id = await draft();
                const res = await api.saveClient(id, agent(), payload(c.dob));
                if (res.status === 422) {
                    testInfo.annotations.push({ type: 'observation', description: `${c.label}: rejected when saving` });
                    expect(errorTexts(res).join(' ')).toMatch(MSG.ageRange);
                }
                else {
                    expect(res.status, 'accepted on save').toBe(200);
                    const validate = await api.validate(id, agent());
                    testInfo.annotations.push({ type: 'observation', description: `${c.label}: accepted on save; validate returned HTTP ${validate.status}` });
                    expect(errorTexts(validate).join(' | '), `${c.label} must be flagged somewhere`).toMatch(MSG.ageRange);
                }
            });
        }
        await test.step('a valid date of birth is stored', async () => {
            const id = await draft();
            const dob = dobForAge(40);
            expectApiSuccess(await api.saveClient(id, agent(), payload(dob)));
            const stored = (await api.getClient(id, agent())).body?.data?.date_of_birth;
            expect(String(stored).slice(0, 10)).toBe(dob);
        });
    });
    test("TC-API-004 | API-V04 | Verify that validate API reports beneficiary allocation errors", { "tag": ["@regression", "@api", "@SDC-13", "@SDC-19", "@P1"], "annotation": [{ "type": "validation-id", "description": "API-V04" }, { "type": "risk", "description": "R-BEN-01, R-API-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-13, SDC-19" }] }, async ({ api }, testInfo) => {
        const cases = [
            { label: 'primary total 90%', second: 30, expectError: true },
            { label: 'primary total 110%', second: 50, expectError: true },
            { label: 'primary total 100%', second: 40, expectError: false },
        ];
        for (const c of cases) {
            await test.step(c.label, async () => {
                const app = await buildApplication(api, { agentEmail: agent(), upTo: 'documents', beneficiaries: [beneficiary({ allocation: 60 })] });
                const add = await api.addBeneficiary(app.id, agent(), toApiBeneficiary(beneficiary({ allocation: c.second, relationship: 'CHILD' })));
                if (add.status === 422) {
                    // The API itself may refuse an over-allocation when adding. That also satisfies the rule.
                    testInfo.annotations.push({ type: 'observation', description: `${c.label}: refused when adding the beneficiary (HTTP 422)` });
                    expect(c.expectError, 'only the over-allocation case may be refused on add').toBe(true);
                    return;
                }
                expect(add.status).toBeLessThan(300);
                const res = await api.validate(app.id, agent());
                if (c.expectError) {
                    expectApiError(res, 422, MSG.primaryTotal);
                }
                else {
                    expectApiSuccess(res);
                    expect(errorTexts(res).join(' ')).not.toMatch(MSG.primaryTotal);
                }
            });
        }
    });
    test("TC-API-005 | API-V05 | Verify that submit API prevents an incomplete application", { "tag": ["@regression", "@api", "@SDC-17", "@SDC-06", "@SDC-19", "@P1"], "annotation": [{ "type": "validation-id", "description": "API-V05" }, { "type": "risk", "description": "R-WF-02, R-KYC-02, R-API-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-17, SDC-06, SDC-19" }] }, async ({ api }) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'product' }); // no riders step, beneficiaries or documents
        const res = await api.submit(app.id, agent());
        expectApiError(res, 422, MSG.validationFailed);
        expect(errorTexts(res).join(' | ')).toMatch(/benefici|document/i);
        const status = (await api.status(app.id, agent())).body.data;
        expect(status.application_status, 'still a draft').toBe('DRAFT');
        expect(status.application_reference_number ?? '', 'no WL reference issued').not.toMatch(/^WL\d+/);
    });
    test("TC-API-010 | API-P02 | Verify that login API status codes and response schema", { "tag": ["@regression", "@smoke", "@api", "@SDC-01", "@SDC-02", "@P1"], "annotation": [{ "type": "validation-id", "description": "API-P02" }, { "type": "risk", "description": "R-AUTH-01, R-AUTH-02" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-01, SDC-02" }] }, async ({ api }) => {
        await test.step('valid credentials', async () => {
            const res = await api.login(agent(), env.password);
            expectApiSuccess(res);
            expect(res.body.message).toMatch(/login validated successfully/i);
            for (const key of ['user_id', 'name', 'email', 'role', 'learner_code', 'account_status'])
                expect(res.body.data).toHaveProperty(key);
            expect(res.body.data.email).toBe(agent());
            expect(Object.keys(res.body.data)).not.toContain('password');
            expect(JSON.stringify(res.body), 'no token is issued by this API').not.toMatch(/token/i);
        });
        await test.step('wrong password -> 401', async () => {
            expectApiError(await api.login(agent(), 'Wrong#Pass123'), 401, MSG.invalidCredentials);
        });
        await test.step('blank and malformed input -> 422', async () => {
            expect((await api.login('', '')).status).toBe(422);
            expect((await api.login('not-an-email', 'x')).status).toBe(422);
        });
        await test.step('locked user -> 403', async () => {
            const res = await api.login(emailOf('locked'), env.password);
            expectApiError(res, 403, MSG.accountLocked);
        });
    });
});
