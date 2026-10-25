"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { test, asRole, expect } = require("../../fixtures/auth.fixture");
const { emailOf } = require("../../fixtures/users");
const { productData } = require("../../fixtures/applicationData");
const { PRODUCTS, product, FREQUENCIES, RIDERS } = require("../../fixtures/referenceData");
const { ProductCatalogPage } = require("../../pages/ProductCatalogPage");
const { ProductConfigurationPage } = require("../../pages/ProductConfigurationPage");
const { ReviewPage } = require("../../pages/ReviewPage");
const { buildApplication } = require("../../utils/applicationBuilder");
const { expectApiSuccess, expectApiError } = require("../../utils/assertions");
const { MSG } = require("../../utils/messages");
const { periodPremium, totalPremium } = require("../../utils/premium");
const { parseMoney } = require("../../utils/testHelpers");
test.use(asRole('learner'));
const agent = () => emailOf('learner');
const sorted = (a) => [...a].sort();
test.describe('Product selection and policy configuration', () => {
    test("TC-PROD-001 | PROD-V01 | Verify that catalog displays the expected Whole Life products", { "tag": ["@regression", "@smoke", "@api", "@product", "@P1"], "annotation": [{ "type": "validation-id", "description": "PROD-V01" }, { "type": "risk", "description": "R-PROD-05" }, { "type": "priority", "description": "P1" }] }, async ({ page, api }) => {
        const catalog = new ProductCatalogPage(page);
        await catalog.goto();
        const uiCodes = await catalog.productCodes();
        const res = await api.products();
        expectApiSuccess(res);
        const activeApi = res.body.data.filter((p) => !!p.is_active).map((p) => p.product_code);
        expect(sorted(uiCodes), 'UI cards equal active products in the API').toEqual(sorted(activeApi));
        expect(sorted(uiCodes), 'seeded products are all listed').toEqual(sorted(PRODUCTS.map((p) => p.code)));
        for (const code of uiCodes)
            await expect(catalog.card(code)).toBeVisible();
    });
    test("TC-PROD-003 | PROD-V03 | Verify that coverage amount below the minimum is blocked", { "tag": ["@regression", "@api", "@product", "@P2"], "annotation": [{ "type": "validation-id", "description": "PROD-V03" }, { "type": "risk", "description": "R-PROD-02" }, { "type": "priority", "description": "P2" }] }, async ({ page, api }) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' }); // client age 40 is eligible for every product
        const config = new ProductConfigurationPage(page);
        for (const p of PRODUCTS) {
            await test.step(`${p.name}: ${p.faceMin - 1} rejected, ${p.faceMin} accepted`, async () => {
                await config.goto(app.id);
                await config.fill(productData({ productCode: p.code, faceValue: p.faceMin - 1 }));
                await config.save();
                await expect(page).toHaveURL(/\/product/);
                await config.expectErrorMatching(MSG.faceBelowMin);
                await config.goto(app.id);
                await config.fill(productData({ productCode: p.code, faceValue: p.faceMin }));
                await config.save();
                await expect(page, 'minimum is accepted').toHaveURL(/\/riders/);
            });
        }
        await test.step('API rejects below-minimum too', async () => {
            const p = product('WL_SECURE_BASIC');
            const res = await api.saveProduct(app.id, agent(), {
                insurance_product_id: await api.productId(p.code), face_value: p.faceMin - 1,
                premium_frequency: 'MONTHLY', payment_term_years: 20, policy_term: 'WHOLE_LIFE',
            });
            expectApiError(res, 422, MSG.faceBelowMin);
        });
    });
    test("TC-PROD-004 | PROD-V04 | Verify that coverage amount above the maximum is blocked", { "tag": ["@regression", "@api", "@product", "@P2"], "annotation": [{ "type": "validation-id", "description": "PROD-V04" }, { "type": "risk", "description": "R-PROD-02" }, { "type": "priority", "description": "P2" }] }, async ({ page, api }) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
        const config = new ProductConfigurationPage(page);
        for (const p of PRODUCTS) {
            await test.step(`${p.name}: ${p.faceMax + 1} rejected, ${p.faceMax} accepted`, async () => {
                await config.goto(app.id);
                await config.fill(productData({ productCode: p.code, faceValue: p.faceMax + 1 }));
                await config.save();
                await expect(page).toHaveURL(/\/product/);
                await config.expectErrorMatching(MSG.faceAboveMax);
                await config.goto(app.id);
                await config.fill(productData({ productCode: p.code, faceValue: p.faceMax }));
                await config.save();
                await expect(page, 'maximum is accepted').toHaveURL(/\/riders/);
            });
        }
        await test.step('API rejects above-maximum too', async () => {
            const p = product('WL_SECURE_BASIC');
            const res = await api.saveProduct(app.id, agent(), {
                insurance_product_id: await api.productId(p.code), face_value: p.faceMax + 1,
                premium_frequency: 'MONTHLY', payment_term_years: 20, policy_term: 'WHOLE_LIFE',
            });
            expectApiError(res, 422, MSG.faceAboveMax);
        });
    });
    test("TC-PROD-005 | PROD-V05 | Verify that premium recomputes when frequency or coverage amount changes", { "tag": ["@regression", "@api", "@product", "@SDC-12", "@P1"], "annotation": [{ "type": "validation-id", "description": "PROD-V05" }, { "type": "risk", "description": "R-PROD-03" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-12" }] }, async ({ page, api }) => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
        const p = product('WL_SECURE_BASIC');
        const config = new ProductConfigurationPage(page);
        await config.goto(app.id);
        await config.selectProduct(p.code);
        await config.setFaceValue(250000);
        await config.paymentTerm.selectOption('20');
        await config.setPolicyTerm('WHOLE_LIFE');
        const seen = [];
        for (const f of FREQUENCIES) {
            await test.step(`frequency ${f}`, async () => {
                await config.setFrequency(f);
                const expected = periodPremium(250000, p.ratePer1000, f);
                await expect.poll(() => config.premiumShown(), { message: `live premium for ${f}` }).toBe(expected);
                seen.push(expected);
            });
        }
        expect(new Set(seen).size, 'each frequency gives a different premium').toBe(FREQUENCIES.length);
        await test.step('changing the face value changes the premium', async () => {
            await config.setFrequency('MONTHLY');
            await config.setFaceValue(300000);
            await expect.poll(() => config.premiumShown()).toBe(periodPremium(300000, p.ratePer1000, 'MONTHLY'));
        });
        await test.step('saved premium equals the preview and the API', async () => {
            await config.setFrequency('QUARTERLY');
            await config.save();
            await expect(page).toHaveURL(/\/riders/);
            const expected = periodPremium(300000, p.ratePer1000, 'QUARTERLY');
            await config.goto(app.id);
            expect(await config.premiumShown(), 'stored premium after reload').toBe(expected);
            const res = await api.getApplication(app.id, agent());
            expect(Number(res.body?.data?.total_premium), 'API total premium').toBe(expected);
        });
    });
    test("TC-PROD-006 | PROD-V06 | Verify that premium agrees with on configuration, summary, review and API", { "tag": ["@regression", "@api", "@product", "@SDC-12", "@P2"], "annotation": [{ "type": "validation-id", "description": "PROD-V06" }, { "type": "risk", "description": "R-PROD-04" }, { "type": "priority", "description": "P2" }, { "type": "seeded-defect-candidate", "description": "SDC-12" }] }, async ({ page, api }) => {
        const face = 250000;
        const app = await buildApplication(api, {
            agentEmail: agent(), upTo: 'riders', product: { faceValue: face, frequency: 'MONTHLY' }, riders: [{ key: 'ADB', coverage: face }],
        });
        const p = product('WL_SECURE_BASIC');
        const config = new ProductConfigurationPage(page);
        const review = new ReviewPage(page);
        const readAll = async () => {
            await config.goto(app.id);
            const configPremium = await config.premiumShown();
            await page.goto(`/applications/${app.id}`);
            const summary = parseMoney(await page.getByTestId('application-total-premium').innerText());
            await review.goto(app.id);
            const reviewPremium = await review.totalPremium();
            const apiPremium = Number((await api.getApplication(app.id, agent())).body?.data?.total_premium);
            return { configPremium, summary, reviewPremium, apiPremium };
        };
        await test.step('as configured (250,000 + ADB, monthly)', async () => {
            const expected = totalPremium({ face, rate: p.ratePer1000 }, [{ coverage: face, rate: RIDERS.ADB.ratePer1000 }], 'MONTHLY');
            const v = await readAll();
            expect(v, 'all four places show the same premium').toEqual({ configPremium: expected, summary: expected, reviewPremium: expected, apiPremium: expected });
        });
        await test.step('after changing the face value to 300,000', async () => {
            await config.goto(app.id);
            await config.setFaceValue(300000);
            await config.save();
            const v = await readAll();
            const values = Object.values(v);
            expect(new Set(values).size, `premium differs between screens/API: ${JSON.stringify(v)}`).toBe(1);
        });
    });
});
