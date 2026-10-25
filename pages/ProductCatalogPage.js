"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCatalogPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
/** /products and /products/{id} */
class ProductCatalogPage extends BasePage {
    root;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('product-catalog-page');
    }
    async goto() {
        await this.page.goto('/products');
        await expect(this.root).toBeVisible();
    }
    card(code) {
        return this.page.getByTestId(`product-card-${code}`);
    }
    async productCodes() {
        const ids = await this.page
            .locator('[data-testid^="product-card-"]')
            .evaluateAll((els) => els.map((e) => e.getAttribute('data-testid') ?? ''));
        return ids.map((t) => t.replace('product-card-', ''));
    }
    async openDetails(code) {
        await this.page.getByTestId(`product-details-${code}`).click();
        await expect(this.page.getByTestId('product-detail-page')).toBeVisible();
    }
    async detail() {
        return {
            name: (await this.page.getByTestId('product-name').innerText()).trim(),
            code: (await this.page.getByTestId('product-code').innerText()).trim(),
            features: (await this.page.getByTestId('product-features').innerText()).trim(),
        };
    }
}
exports.ProductCatalogPage = ProductCatalogPage;
