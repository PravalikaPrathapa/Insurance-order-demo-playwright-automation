# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-selection\product-selection.spec.js >> Product selection and policy configuration >> TC-PROD-001 | PROD-V01 | Verify that catalog displays the expected Whole Life products
- Location: tests\product-selection\product-selection.spec.js:19:5

# Error details

```
Error: HTTP status. Actual response body: {
    "message": "The route api/products could not be found.",
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

Expected: 200
Received: 404
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=e4] [cursor=pointer]:
        - /url: http://35.200.146.53:8081/dashboard
        - generic [aria-hidden] [ref=e5]: IO
        - generic [ref=e6]:
          - generic [ref=e7]: Insurance Order Entry Demo Platform
          - generic [ref=e8]: QA Automation Training App
      - generic [ref=e9]:
        - list [ref=e10]:
          - listitem [ref=e11]:
            - link "Dashboard" [ref=e12] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/dashboard
          - listitem [ref=e13]:
            - link "Applications" [ref=e14] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/applications
          - listitem [ref=e15]:
            - link "Products" [ref=e16] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/products
          - listitem [ref=e17]:
            - link "Support" [ref=e18] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/support
        - generic [ref=e19]:
          - link "Learner Agent 001" [ref=e20] [cursor=pointer]:
            - /url: http://35.200.146.53:8081/profile
          - button "Logout" [ref=e22] [cursor=pointer]
  - main [ref=e23]:
    - generic [ref=e24]:
      - heading "Whole Life Product Catalog" [level=1] [ref=e25]
      - paragraph [ref=e26]: Use these products while configuring an insurance application.
    - generic [ref=e27]:
      - generic [ref=e30]:
        - generic [ref=e31]: WL_ELITE_LEGACY
        - heading "Elite Legacy Whole Life" [level=2] [ref=e32]
        - paragraph [ref=e33]: High-net-worth offering for estate planning and tax efficiency.
        - generic [ref=e34]:
          - term [ref=e35]: Age
          - definition [ref=e36]: 30 - 65
          - term [ref=e37]: Sum Assured
          - definition [ref=e38]: 500,000 - 5,000,000
          - term [ref=e39]: Rate / 1000
          - definition [ref=e40]: "6.1000"
        - link "View Details" [ref=e41] [cursor=pointer]:
          - /url: http://35.200.146.53:8081/products/3
      - generic [ref=e44]:
        - generic [ref=e45]: WL_FLEXI_PAY
        - heading "FlexiPay Whole Life" [level=2] [ref=e46]
        - paragraph [ref=e47]: Flexible premium payment options with adjustable premiums.
        - generic [ref=e48]:
          - term [ref=e49]: Age
          - definition [ref=e50]: 19 - 62
          - term [ref=e51]: Sum Assured
          - definition [ref=e52]: 100,000 - 1,200,000
          - term [ref=e53]: Rate / 1000
          - definition [ref=e54]: "5.1500"
        - link "View Details" [ref=e55] [cursor=pointer]:
          - /url: http://35.200.146.53:8081/products/4
      - generic [ref=e58]:
        - generic [ref=e59]: WL_SECURE_BASIC
        - heading "SecureLife Whole Life" [level=2] [ref=e60]
        - paragraph [ref=e61]: Basic lifelong coverage with fixed premium and guaranteed death benefit.
        - generic [ref=e62]:
          - term [ref=e63]: Age
          - definition [ref=e64]: 18 - 65
          - term [ref=e65]: Sum Assured
          - definition [ref=e66]: 100,000 - 1,000,000
          - term [ref=e67]: Rate / 1000
          - definition [ref=e68]: "4.7500"
        - link "View Details" [ref=e69] [cursor=pointer]:
          - /url: http://35.200.146.53:8081/products/1
      - generic [ref=e72]:
        - generic [ref=e73]: WL_WEALTH_BUILDER
        - heading "WealthBuilder Whole Life" [level=2] [ref=e74]
        - paragraph [ref=e75]: Growth and protection product with cash value accumulation.
        - generic [ref=e76]:
          - term [ref=e77]: Age
          - definition [ref=e78]: 21 - 60
          - term [ref=e79]: Sum Assured
          - definition [ref=e80]: 150,000 - 1,500,000
          - term [ref=e81]: Rate / 1000
          - definition [ref=e82]: "5.3500"
        - link "View Details" [ref=e83] [cursor=pointer]:
          - /url: http://35.200.146.53:8081/products/2
  - contentinfo [ref=e84]:
    - generic [ref=e85]:
      - generic [ref=e86]: TalentFarm QA Automation Lab
      - generic [ref=e87]: Insurance Order Entry Demo
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
> 37 |     expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
     |                                                                                              ^ Error: HTTP status. Actual response body: {
  38 |     expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('success');
  39 | }
  40 | exports.expectApiSuccess = expectApiSuccess;
  41 | function expectApiError(result, status, pattern) {
  42 |     showResponse(result);
  43 |     expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
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