"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentUploadPage = void 0;
const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
/** /applications/{id}/documents */
class DocumentUploadPage extends BasePage {
    root;
    typeSelect;
    fileInput;
    uploadButton;
    table;
    emptyState;
    continueLink;
    constructor(page) {
        super(page);
        this.root = page.getByTestId('documents-page');
        this.typeSelect = page.getByTestId('document-type-select');
        this.fileInput = page.getByTestId('document-upload-kyc');
        this.uploadButton = page.getByTestId('document-upload-button');
        this.table = page.getByTestId('documents-table');
        this.emptyState = page.getByTestId('documents-empty-state');
        this.continueLink = page.getByTestId('documents-continue-review-button');
    }
    async goto(applicationId) {
        await this.page.goto(`/applications/${applicationId}/documents`);
        await expect(this.root).toBeVisible();
    }
    async upload(type, file) {
        await this.typeSelect.selectOption(type);
        await this.fileInput.setInputFiles(file.path);
        await this.uploadButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
    rows() {
        return this.page.locator('[data-testid^="document-row-"]');
    }
    async rowTexts() {
        return (await this.rows().allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
    }
    async continueToReview() {
        await this.continueLink.click();
        await expect(this.page).toHaveURL(/\/review/);
    }
}
exports.DocumentUploadPage = DocumentUploadPage;
