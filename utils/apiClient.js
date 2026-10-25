"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const { request } = require("@playwright/test");
const { env } = require("./env");
/**
 * Thin client for the Insurance Order Entry API.
 *  - Auth is a STATIC header (X-API-Key), there is no per-user token.
 *  - The acting agent is chosen with `agent_email`. If you forget it the API silently uses learner001,
 *    so every call below takes the agent explicitly. UI and API comparisons must use the SAME agent.
 *  - Paths have no leading slash (see env.apiBase).
 *  - Redirects are never followed so a 302 to /login can't masquerade as 200.
 */
class ApiClient {
    ctx;
    productCache = null;
    riderCache = null;
    constructor(ctx) {
        this.ctx = ctx;
    }
    /** apiKey: undefined = use .env key, null = send no key, string = send that key. */
    static async create(options = {}) {
        const key = options.apiKey === undefined ? env.apiKey : options.apiKey;
        const headers = { Accept: 'application/json' };
        if (key)
            headers['X-API-Key'] = key;
        const ctx = await request.newContext({ baseURL: env.apiBase, extraHTTPHeaders: headers });
        return new ApiClient(ctx);
    }
    async dispose() {
        await this.ctx.dispose();
    }
    async toResult(res) {
        const text = await res.text();
        let body = null;
        try {
            body = JSON.parse(text);
        }
        catch {
            body = null;
        }
        return { status: res.status(), ok: res.ok(), body, text };
    }
    async get(path, params) {
        return this.toResult(await this.ctx.get(path, { params, maxRedirects: 0 }));
    }
    async post(path, data = {}) {
        return this.toResult(await this.ctx.post(path, { data, maxRedirects: 0 }));
    }
    // ---- public / reference endpoints ------------------------------------------------------------
    health() {
        return this.get('health');
    }
    products() {
        return this.get('products');
    }
    product(id) {
        return this.get(`products/${id}`);
    }
    riders() {
        return this.get('riders');
    }
    login(email, password) {
        return this.post('login', { email, password });
    }
    // ---- applications ----------------------------------------------------------------------------
    listApplications(agentEmail, status) {
        const params = { agent_email: agentEmail };
        if (status)
            params.status = status;
        return this.get('applications', params);
    }
    createApplication(agentEmail) {
        return this.post('applications', { agent_email: agentEmail });
    }
    getApplication(id, agentEmail) {
        return this.get(`applications/${id}`, { agent_email: agentEmail });
    }
    getClient(id, agentEmail) {
        return this.get(`applications/${id}/client`, { agent_email: agentEmail });
    }
    saveClient(id, agentEmail, data) {
        return this.post(`applications/${id}/client`, { agent_email: agentEmail, ...data });
    }
    saveAddress(id, agentEmail, data) {
        return this.post(`applications/${id}/address-contact`, { agent_email: agentEmail, ...data });
    }
    saveKyc(id, agentEmail, data) {
        return this.post(`applications/${id}/kyc-financial`, { agent_email: agentEmail, ...data });
    }
    saveProduct(id, agentEmail, data) {
        return this.post(`applications/${id}/product`, { agent_email: agentEmail, ...data });
    }
    saveRiders(id, agentEmail, riders) {
        return this.post(`applications/${id}/riders`, { agent_email: agentEmail, riders });
    }
    listBeneficiaries(id, agentEmail) {
        return this.get(`applications/${id}/beneficiaries`, { agent_email: agentEmail });
    }
    addBeneficiary(id, agentEmail, data) {
        return this.post(`applications/${id}/beneficiaries`, { agent_email: agentEmail, ...data });
    }
    async uploadDocument(id, agentEmail, doc) {
        const res = await this.ctx.post(`applications/${id}/documents`, {
            multipart: { agent_email: agentEmail, document_type: doc.type, document: { name: doc.name, mimeType: doc.mimeType, buffer: doc.buffer } },
            maxRedirects: 0,
        });
        return this.toResult(res);
    }
    validate(id, agentEmail) {
        return this.post(`applications/${id}/validate`, { agent_email: agentEmail });
    }
    submit(id, agentEmail) {
        return this.post(`applications/${id}/submit`, { agent_email: agentEmail });
    }
    status(id, agentEmail) {
        return this.get(`applications/${id}/status`, { agent_email: agentEmail });
    }
    // ---- id lookups (cached) ---------------------------------------------------------------------
    async productId(code) {
        const list = this.productCache ?? (this.productCache = (await this.products()).body?.data ?? []);
        const p = list.find((x) => x.product_code === code);
        if (!p)
            throw new Error(`Product ${code} not found in /api/products`);
        return Number(p.id);
    }
    async riderId(code) {
        const list = this.riderCache ?? (this.riderCache = (await this.riders()).body?.data ?? []);
        const r = list.find((x) => x.rider_code === code);
        if (!r)
            throw new Error(`Rider ${code} not found in /api/riders`);
        return Number(r.id);
    }
}
exports.ApiClient = ApiClient;
