"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApplication = exports.toApiBeneficiary = exports.toApiKyc = exports.toApiAddress = exports.toApiClient = void 0;
const { expect } = require("@playwright/test");
const { clientData, addressData, kycData, productData, beneficiary } = require("../fixtures/applicationData");
const { RIDERS } = require("../fixtures/referenceData");
const { makeFile } = require("./fileUploadHelper");
const ORDER = ['draft', 'client', 'address', 'kyc', 'product', 'riders', 'beneficiaries', 'documents'];
function must(res, stage, ok = [200, 201]) {
    if (!ok.includes(res.status)) {
        throw new Error(`Setup step "${stage}" failed: HTTP ${res.status} ${res.text.slice(0, 400)}`);
    }
    return res;
}
// ---- UI-shaped data -> API payloads -------------------------------------------------------------
const toApiClient = (c) => ({
    first_name: c.firstName, middle_name: c.middleName ?? null, last_name: c.lastName, date_of_birth: c.dob, gender: c.gender,
    marital_status: c.maritalStatus, nationality: c.nationality, occupation: c.occupation,
    employer_name: c.employerName, employer_address: c.employerAddress,
});
exports.toApiClient = toApiClient;
const toApiAddress = (a) => ({
    residential: { address_line_1: a.line1, address_line_2: a.line2 ?? null, city: a.city, state_province: a.state, postal_code: a.postalCode, country: 'US' },
    same_as_residential: a.sameAsResidential,
    mailing: a.sameAsResidential || !a.mailing ? null
        : { address_line_1: a.mailing.line1, address_line_2: a.mailing.line2 ?? null, city: a.mailing.city, state_province: a.mailing.state, postal_code: a.mailing.postalCode, country: 'US' },
    primary_email: a.email, mobile_number: a.mobile, alternate_phone_number: a.alternatePhone ?? null, preferred_communication_mode: a.preferredMode,
});
exports.toApiAddress = toApiAddress;
const toApiKyc = (k) => ({
    id_type: k.idType, id_number: k.idNumber, issue_date: k.issueDate ?? null, expiry_date: k.expiryDate ?? null,
    annual_income: k.annualIncome, net_worth: k.netWorth, source_of_funds: k.sourceOfFunds, risk_profile: k.riskProfile,
    is_pep: k.isPep, pep_details: k.pepDetails ?? null, declaration_completed: k.declaration,
});
exports.toApiKyc = toApiKyc;
const toApiBeneficiary = (b) => ({
    beneficiary_level: b.level, beneficiary_type: b.type, relationship: b.relationship, allocation_percentage: b.allocation,
    first_name: b.firstName ?? null, last_name: b.lastName ?? null, date_of_birth: b.dob ?? null, gender: b.gender ?? null,
    trust_name: b.trustName ?? null, trustee_name: b.trusteeName ?? null, trust_date: b.trustDate ?? null,
    organization_name: b.organizationName ?? null, organization_registration_number: b.organizationRegistration ?? null,
    organization_contact: b.organizationContact ?? null,
    guardian_name: b.guardian?.name ?? null, guardian_relationship: b.guardian?.relationship ?? null,
    guardian_contact: b.guardian?.contact ?? null, guardian_address: b.guardian?.address ?? null,
    legal_acknowledgement: b.legalAcknowledgement ? 1 : null,
    is_irrevocable: b.irrevocable ? 1 : 0, irrevocable_confirmation: b.irrevocable ? 1 : 0,
});
exports.toApiBeneficiary = toApiBeneficiary;
/** Creates and fills an application through the API (fast set-up for UI tests). All steps must succeed. */
async function buildApplication(api, opts) {
    const upTo = ORDER.indexOf(opts.upTo ?? 'documents');
    const reached = (s) => ORDER.indexOf(s) <= upTo;
    const agent = opts.agentEmail;
    const client = clientData(opts.client);
    const address = addressData(opts.address);
    const kyc = kycData(opts.kyc);
    const product = productData(opts.product);
    const riders = opts.riders ?? [];
    const beneficiaries = opts.beneficiaries ?? [beneficiary()];
    const created = must(await api.createApplication(agent), 'create draft');
    const id = Number(created.body?.data?.id);
    expect(id, 'new application id').toBeGreaterThan(0);
    if (reached('client'))
        must(await api.saveClient(id, agent, toApiClient(client)), 'client');
    if (reached('address'))
        must(await api.saveAddress(id, agent, toApiAddress(address)), 'address and contact');
    if (reached('kyc'))
        must(await api.saveKyc(id, agent, toApiKyc(kyc)), 'kyc and financial');
    if (reached('product')) {
        must(await api.saveProduct(id, agent, {
            insurance_product_id: await api.productId(product.productCode),
            face_value: product.faceValue, premium_frequency: product.frequency,
            payment_term_years: product.paymentTerm, policy_term: product.policyTerm,
        }), 'product');
    }
    if (reached('riders')) {
        const payload = [];
        for (const r of riders) {
            payload.push({ rider_id: await api.riderId(RIDERS[r.key].code), coverage_amount: r.coverage ?? product.faceValue });
        }
        must(await api.saveRiders(id, agent, payload), 'riders');
    }
    if (reached('beneficiaries')) {
        for (const b of beneficiaries)
            must(await api.addBeneficiary(id, agent, toApiBeneficiary(b)), 'beneficiary');
    }
    if (reached('documents') && opts.withDocument !== false) {
        const f = makeFile('pdf', `kyc-${id}.pdf`);
        must(await api.uploadDocument(id, agent, { type: 'KYC_ID', name: f.name, mimeType: f.mimeType, buffer: f.buffer }), 'document');
    }
    return { id, client, address, kyc, product, riders, beneficiaries };
}
exports.buildApplication = buildApplication;
