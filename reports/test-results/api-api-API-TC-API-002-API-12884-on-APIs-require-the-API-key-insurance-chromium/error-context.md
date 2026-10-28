# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\api.spec.js >> API >> TC-API-002 | API-V02 | Verify that application APIs require the API key
- Location: tests\api\api.spec.js:46:5

# Error details

```
Error: HTTP status. Actual response body: {
    "message": "The route api/applications could not be found.",
    "exception": "Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException",
    "file": "C:\\qa-lab\\apps\\insurance-order-entry-demo\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\AbstractRouteCollection.php",
    "line": 44,
    "trace": [
        {
            "file": "C:\\qa-lab\\apps\\insurance-order-entry-demo\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\RouteCollection.php",
            "line": 184,
            "function": "handleMatchedRoute",
            "class": "Illuminate\\Routing\\AbstractRouteCollection",
            "type": "->"
        },
        {
            "file": "C:\\qa-lab\\apps\\insurance-order-entry-demo\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php",
 

expect(received).toBe(expected) // Object.is equality

Expected: 401
Received: 404
```

# Test source

```ts
  1  | "use strict";
  2  | Object.defineProperty(exports, "__esModule", { value: true });
  3  | exports.anyMatches = exports.expectNoAlert = exports.expectAlertMatches = exports.alertTexts = exports.expectApiError = exports.expectApiSuccess = exports.errorTexts = void 0;
  4  | const { test, expect } = require("@playwright/test");
  5  | /** Flattens an API envelope ({message, errors:{field:[...]}}) into a list of strings. */
  6  | function errorTexts(result) {
  7  |     const out = [];
  8  |     const body = result.body;
  9  |     if (body && typeof body.message === 'string')
  10 |         out.push(body.message);
  11 |     const errors = body?.errors;
  12 |     if (Array.isArray(errors))
  13 |         out.push(...errors.map(String));
  14 |     else if (errors && typeof errors === 'object') {
  15 |         for (const v of Object.values(errors)) {
  16 |             if (Array.isArray(v))
  17 |                 out.push(...v.map(String));
  18 |             else if (typeof v === 'string')
  19 |                 out.push(v);
  20 |         }
  21 |     }
  22 |     return out;
  23 | }
  24 | exports.errorTexts = errorTexts;
  25 | /** Prints the real response and attaches it to the HTML report for this test. */
  26 | function showResponse(result) {
  27 |     console.log(`[api] HTTP ${result.status} ${result.text.slice(0, 500)}`);
  28 |     try {
  29 |         void test.info().attach('api-response', { body: `HTTP ${result.status}\n${result.text}`, contentType: 'text/plain' });
  30 |     }
  31 |     catch {
  32 |         /* not inside a running test */
  33 |     }
  34 | }
  35 | function expectApiSuccess(result, status = 200) {
  36 |     showResponse(result);
  37 |     expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
  38 |     expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('success');
  39 | }
  40 | exports.expectApiSuccess = expectApiSuccess;
  41 | function expectApiError(result, status, pattern) {
  42 |     showResponse(result);
> 43 |     expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
     |                                                                                              ^ Error: HTTP status. Actual response body: {
  44 |     expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('error');
  45 |     if (pattern) {
  46 |         const texts = errorTexts(result).join(' | ');
  47 |         expect(texts, `error messages. Actual response body: ${result.text.slice(0, 800)}`).toMatch(pattern);
  48 |     }
  49 | }
  50 | exports.expectApiError = expectApiError;
  51 | /** Texts currently shown in the red validation alert (server-side validation on a form page). */
  52 | async function alertTexts(page) {
  53 |     const alert = page.getByTestId('validation-error-alert');
  54 |     if ((await alert.count()) === 0)
  55 |         return [];
  56 |     return (await alert.locator('li').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  57 | }
  58 | exports.alertTexts = alertTexts;
  59 | async function expectAlertMatches(page, pattern) {
  60 |     const alert = page.getByTestId('validation-error-alert');
  61 |     await expect(alert, 'validation alert should be visible').toBeVisible();
  62 |     await expect(alert).toContainText(pattern);
  63 | }
  64 | exports.expectAlertMatches = expectAlertMatches;
  65 | async function expectNoAlert(page) {
  66 |     await expect(page.getByTestId('validation-error-alert')).toHaveCount(0);
  67 | }
  68 | exports.expectNoAlert = expectNoAlert;
  69 | /** True if some message in the list matches. Used where the app may report an error in more than one place. */
  70 | function anyMatches(texts, pattern) {
  71 |     return texts.some((t) => pattern.test(t));
  72 | }
  73 | exports.anyMatches = anyMatches;
  74 | 
```