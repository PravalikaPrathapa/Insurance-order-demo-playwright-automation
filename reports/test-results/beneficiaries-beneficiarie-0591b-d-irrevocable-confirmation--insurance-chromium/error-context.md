# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: beneficiaries\beneficiaries.spec.js >> Beneficiary management >> TC-BEN-001 | BEN-V01 | Verify that add a eligible primary beneficiary (and irrevocable confirmation)
- Location: tests\beneficiaries\beneficiaries.spec.js:27:5

# Error details

```
Error: Setup step "create draft" failed: HTTP 404 {
    "message": "The route api/applications could not be found.",
    "exception": "Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException",
    "file": "C:\\qa-lab\\apps\\insurance-order-entry-demo\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\AbstractRouteCollection.php",
    "line": 44,
    "trace": [
        {
            "file": "C:\\qa-lab\\apps\\insurance-order-entry-dem
```

# Test source

```ts
  1  | "use strict";
  2  | Object.defineProperty(exports, "__esModule", { value: true });
  3  | exports.buildApplication = exports.toApiBeneficiary = exports.toApiKyc = exports.toApiAddress = exports.toApiClient = void 0;
  4  | const { expect } = require("@playwright/test");
  5  | const { clientData, addressData, kycData, productData, beneficiary } = require("../fixtures/applicationData");
  6  | const { RIDERS } = require("../fixtures/referenceData");
  7  | const { makeFile } = require("./fileUploadHelper");
  8  | const ORDER = ['draft', 'client', 'address', 'kyc', 'product', 'riders', 'beneficiaries', 'documents'];
  9  | function must(res, stage, ok = [200, 201]) {
  10 |     if (!ok.includes(res.status)) {
> 11 |         throw new Error(`Setup step "${stage}" failed: HTTP ${res.status} ${res.text.slice(0, 400)}`);
     |               ^ Error: Setup step "create draft" failed: HTTP 404 {
  12 |     }
  13 |     return res;
  14 | }
  15 | // ---- UI-shaped data -> API payloads -------------------------------------------------------------
  16 | const toApiClient = (c) => ({
  17 |     first_name: c.firstName, middle_name: c.middleName ?? null, last_name: c.lastName, date_of_birth: c.dob, gender: c.gender,
  18 |     marital_status: c.maritalStatus, nationality: c.nationality, occupation: c.occupation,
  19 |     employer_name: c.employerName, employer_address: c.employerAddress,
  20 | });
  21 | exports.toApiClient = toApiClient;
  22 | const toApiAddress = (a) => ({
  23 |     residential: { address_line_1: a.line1, address_line_2: a.line2 ?? null, city: a.city, state_province: a.state, postal_code: a.postalCode, country: 'US' },
  24 |     same_as_residential: a.sameAsResidential,
  25 |     mailing: a.sameAsResidential || !a.mailing ? null
  26 |         : { address_line_1: a.mailing.line1, address_line_2: a.mailing.line2 ?? null, city: a.mailing.city, state_province: a.mailing.state, postal_code: a.mailing.postalCode, country: 'US' },
  27 |     primary_email: a.email, mobile_number: a.mobile, alternate_phone_number: a.alternatePhone ?? null, preferred_communication_mode: a.preferredMode,
  28 | });
  29 | exports.toApiAddress = toApiAddress;
  30 | const toApiKyc = (k) => ({
  31 |     id_type: k.idType, id_number: k.idNumber, issue_date: k.issueDate ?? null, expiry_date: k.expiryDate ?? null,
  32 |     annual_income: k.annualIncome, net_worth: k.netWorth, source_of_funds: k.sourceOfFunds, risk_profile: k.riskProfile,
  33 |     is_pep: k.isPep, pep_details: k.pepDetails ?? null, declaration_completed: k.declaration,
  34 | });
  35 | exports.toApiKyc = toApiKyc;
  36 | const toApiBeneficiary = (b) => ({
  37 |     beneficiary_level: b.level, beneficiary_type: b.type, relationship: b.relationship, allocation_percentage: b.allocation,
  38 |     first_name: b.firstName ?? null, last_name: b.lastName ?? null, date_of_birth: b.dob ?? null, gender: b.gender ?? null,
  39 |     trust_name: b.trustName ?? null, trustee_name: b.trusteeName ?? null, trust_date: b.trustDate ?? null,
  40 |     organization_name: b.organizationName ?? null, organization_registration_number: b.organizationRegistration ?? null,
  41 |     organization_contact: b.organizationContact ?? null,
  42 |     guardian_name: b.guardian?.name ?? null, guardian_relationship: b.guardian?.relationship ?? null,
  43 |     guardian_contact: b.guardian?.contact ?? null, guardian_address: b.guardian?.address ?? null,
  44 |     legal_acknowledgement: b.legalAcknowledgement ? 1 : null,
  45 |     is_irrevocable: b.irrevocable ? 1 : 0, irrevocable_confirmation: b.irrevocable ? 1 : 0,
  46 | });
  47 | exports.toApiBeneficiary = toApiBeneficiary;
  48 | /** Creates and fills an application through the API (fast set-up for UI tests). All steps must succeed. */
  49 | async function buildApplication(api, opts) {
  50 |     const upTo = ORDER.indexOf(opts.upTo ?? 'documents');
  51 |     const reached = (s) => ORDER.indexOf(s) <= upTo;
  52 |     const agent = opts.agentEmail;
  53 |     const client = clientData(opts.client);
  54 |     const address = addressData(opts.address);
  55 |     const kyc = kycData(opts.kyc);
  56 |     const product = productData(opts.product);
  57 |     const riders = opts.riders ?? [];
  58 |     const beneficiaries = opts.beneficiaries ?? [beneficiary()];
  59 |     const created = must(await api.createApplication(agent), 'create draft');
  60 |     const id = Number(created.body?.data?.id);
  61 |     expect(id, 'new application id').toBeGreaterThan(0);
  62 |     if (reached('client'))
  63 |         must(await api.saveClient(id, agent, toApiClient(client)), 'client');
  64 |     if (reached('address'))
  65 |         must(await api.saveAddress(id, agent, toApiAddress(address)), 'address and contact');
  66 |     if (reached('kyc'))
  67 |         must(await api.saveKyc(id, agent, toApiKyc(kyc)), 'kyc and financial');
  68 |     if (reached('product')) {
  69 |         must(await api.saveProduct(id, agent, {
  70 |             insurance_product_id: await api.productId(product.productCode),
  71 |             face_value: product.faceValue, premium_frequency: product.frequency,
  72 |             payment_term_years: product.paymentTerm, policy_term: product.policyTerm,
  73 |         }), 'product');
  74 |     }
  75 |     if (reached('riders')) {
  76 |         const payload = [];
  77 |         for (const r of riders) {
  78 |             payload.push({ rider_id: await api.riderId(RIDERS[r.key].code), coverage_amount: r.coverage ?? product.faceValue });
  79 |         }
  80 |         must(await api.saveRiders(id, agent, payload), 'riders');
  81 |     }
  82 |     if (reached('beneficiaries')) {
  83 |         for (const b of beneficiaries)
  84 |             must(await api.addBeneficiary(id, agent, toApiBeneficiary(b)), 'beneficiary');
  85 |     }
  86 |     if (reached('documents') && opts.withDocument !== false) {
  87 |         const f = makeFile('pdf', `kyc-${id}.pdf`);
  88 |         must(await api.uploadDocument(id, agent, { type: 'KYC_ID', name: f.name, mimeType: f.mimeType, buffer: f.buffer }), 'document');
  89 |     }
  90 |     return { id, client, address, kyc, product, riders, beneficiaries };
  91 | }
  92 | exports.buildApplication = buildApplication;
  93 | 
```