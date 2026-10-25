"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSurface = exports.ageErrorSurface = void 0;
const { ClientInformationPage } = require("../pages/ClientInformationPage");
const { ReviewPage } = require("../pages/ReviewPage");
const { anyMatches } = require("./assertions");
const { MSG } = require("./messages");
async function ageErrorSurface(page, applicationId, pattern = MSG.ageRange) {
    const client = new ClientInformationPage(page);
    if (anyMatches(await client.errorMessages(), pattern))
        return 'form';
    const review = new ReviewPage(page);
    await review.goto(applicationId);
    if (anyMatches(await review.errors(), pattern))
        return 'review';
    return null;
}
exports.ageErrorSurface = ageErrorSurface;
/** Looks for a message on the current page's alert first, then on the review page. */
async function errorSurface(page, applicationId, pattern) {
    const alert = await page
        .getByTestId('validation-error-alert')
        .locator('li')
        .allInnerTexts()
        .catch(() => []);
    if (anyMatches(alert, pattern))
        return 'form';
    const review = new ReviewPage(page);
    await review.goto(applicationId);
    if (anyMatches(await review.errors(), pattern))
        return 'review';
    return null;
}
exports.errorSurface = errorSurface;
