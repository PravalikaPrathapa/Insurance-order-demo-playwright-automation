# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow\workflow.spec.js >> Submission and status tracking >> TC-WF-003 | WF-V03 | Verify that a complete application can be submitted end to end
- Location: tests\workflow\workflow.spec.js:90:5

# Error details

```
Error: HTTP status. Actual response body: {
    "message": "The route api/applications/63/status could not be found.",
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
            "file": "C:\\qa-lab\\apps\\insurance-order-entry-demo\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Rout

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Page snapshot

```yaml
- generic [active] [ref=f15e1]:
  - navigation [ref=f15e2]:
    - generic [ref=f15e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f15e4] [cursor=pointer]:
        - /url: http://35.200.146.53:8081/dashboard
        - generic [aria-hidden] [ref=f15e5]: IO
        - generic [ref=f15e6]:
          - generic [ref=f15e7]: Insurance Order Entry Demo Platform
          - generic [ref=f15e8]: QA Automation Training App
      - generic [ref=f15e9]:
        - list [ref=f15e10]:
          - listitem [ref=f15e11]:
            - link "Dashboard" [ref=f15e12] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/dashboard
          - listitem [ref=f15e13]:
            - link "Applications" [ref=f15e14] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/applications
          - listitem [ref=f15e15]:
            - link "Products" [ref=f15e16] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/products
          - listitem [ref=f15e17]:
            - link "Support" [ref=f15e18] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/support
        - generic [ref=f15e19]:
          - link "Learner Agent 001" [ref=f15e20] [cursor=pointer]:
            - /url: http://35.200.146.53:8081/profile
          - button "Logout" [ref=f15e22] [cursor=pointer]
  - main [ref=f15e23]:
    - generic [ref=f15e24]:
      - generic [ref=f15e25]:
        - heading "Agent Dashboard" [level=1] [ref=f15e26]
        - paragraph [ref=f15e27]: Track drafts, submitted applications, and policy order entry work.
      - link "Start New Application" [ref=f15e28] [cursor=pointer]:
        - /url: http://35.200.146.53:8081/applications/new
    - generic [ref=f15e29]:
      - generic [ref=f15e32]:
        - generic [ref=f15e33]: Draft
        - generic [ref=f15e34]: "9"
      - generic [ref=f15e37]:
        - generic [ref=f15e38]: Submitted
        - generic [ref=f15e39]: "6"
      - generic [ref=f15e42]:
        - generic [ref=f15e43]: Under Review
        - generic [ref=f15e44]: "0"
      - generic [ref=f15e47]:
        - generic [ref=f15e48]: Approved
        - generic [ref=f15e49]: "0"
      - generic [ref=f15e52]:
        - generic [ref=f15e53]: Requires Info
        - generic [ref=f15e54]: "0"
    - generic [ref=f15e55]:
      - generic [ref=f15e56]:
        - heading "Recent Applications" [level=2] [ref=f15e57]
        - link "View all" [ref=f15e58] [cursor=pointer]:
          - /url: http://35.200.146.53:8081/applications
      - table [ref=f15e60]:
        - rowgroup [ref=f15e61]:
          - row [ref=f15e62]:
            - columnheader "Reference" [ref=f15e63]
            - columnheader "Client" [ref=f15e64]
            - columnheader "Product" [ref=f15e65]
            - columnheader "Status" [ref=f15e66]
            - columnheader "Updated" [ref=f15e67]
            - columnheader [ref=f15e68]
        - rowgroup [ref=f15e69]:
          - row [ref=f15e70]:
            - cell "WL2026102813272" [ref=f15e71]
            - cell "Qagwycnh Wsndgkh" [ref=f15e72]
            - cell "SecureLife Whole Life" [ref=f15e73]
            - cell "SUBMITTED" [ref=f15e74]
            - cell "28 Oct 2026" [ref=f15e76]
            - cell [ref=f15e77]:
              - link "Open" [ref=f15e78] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/63
          - row [ref=f15e79]:
            - 'cell "Draft #62" [ref=f15e80]'
            - cell "Qauyekxp Hsquwsz" [ref=f15e81]
            - cell "Not selected" [ref=f15e82]
            - cell "DRAFT" [ref=f15e83]
            - cell "28 Oct 2026" [ref=f15e85]
            - cell [ref=f15e86]:
              - link "Open" [ref=f15e87] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/62
          - row [ref=f15e88]:
            - cell "WL2026102853941" [ref=f15e89]
            - cell "Qaozcgrx Sneecvl" [ref=f15e90]
            - cell "SecureLife Whole Life" [ref=f15e91]
            - cell "SUBMITTED" [ref=f15e92]
            - cell "28 Oct 2026" [ref=f15e94]
            - cell [ref=f15e95]:
              - link "Open" [ref=f15e96] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/61
          - row [ref=f15e97]:
            - 'cell "Draft #60" [ref=f15e98]'
            - cell "Qaadeqyo Nrnopcc" [ref=f15e99]
            - cell "Not selected" [ref=f15e100]
            - cell "DRAFT" [ref=f15e101]
            - cell "28 Oct 2026" [ref=f15e103]
            - cell [ref=f15e104]:
              - link "Open" [ref=f15e105] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/60
          - row [ref=f15e106]:
            - cell "WL2026102817676" [ref=f15e107]
            - cell "Qasbuygq Mgdchsx" [ref=f15e108]
            - cell "SecureLife Whole Life" [ref=f15e109]
            - cell "SUBMITTED" [ref=f15e110]
            - cell "28 Oct 2026" [ref=f15e112]
            - cell [ref=f15e113]:
              - link "Open" [ref=f15e114] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/59
          - row [ref=f15e115]:
            - 'cell "Draft #58" [ref=f15e116]'
            - cell "Qaqpqgwb Urerseo" [ref=f15e117]
            - cell "Not selected" [ref=f15e118]
            - cell "DRAFT" [ref=f15e119]
            - cell "28 Oct 2026" [ref=f15e121]
            - cell [ref=f15e122]:
              - link "Open" [ref=f15e123] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/58
          - row [ref=f15e124]:
            - 'cell "Draft #57" [ref=f15e125]'
            - cell "Qayqoiyn Ljuykmt" [ref=f15e126]
            - cell "Not selected" [ref=f15e127]
            - cell "DRAFT" [ref=f15e128]
            - cell "28 Oct 2026" [ref=f15e130]
            - cell [ref=f15e131]:
              - link "Open" [ref=f15e132] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/57
          - row [ref=f15e133]:
            - cell "WL2026102850377" [ref=f15e134]
            - cell "Qasqsfar Xvucpkf" [ref=f15e135]
            - cell "SecureLife Whole Life" [ref=f15e136]
            - cell "SUBMITTED" [ref=f15e137]
            - cell "28 Oct 2026" [ref=f15e139]
            - cell [ref=f15e140]:
              - link "Open" [ref=f15e141] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/56
          - row [ref=f15e142]:
            - 'cell "Draft #55" [ref=f15e143]'
            - cell "Qaulsspm Fbqeyyr" [ref=f15e144]
            - cell "Not selected" [ref=f15e145]
            - cell "DRAFT" [ref=f15e146]
            - cell "28 Oct 2026" [ref=f15e148]
            - cell [ref=f15e149]:
              - link "Open" [ref=f15e150] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/55
          - row [ref=f15e151]:
            - cell "WL2026102661255" [ref=f15e152]
            - cell "Qayprgjg Yraqfhz" [ref=f15e153]
            - cell "SecureLife Whole Life" [ref=f15e154]
            - cell "SUBMITTED" [ref=f15e155]
            - cell "26 Oct 2026" [ref=f15e157]
            - cell [ref=f15e158]:
              - link "Open" [ref=f15e159] [cursor=pointer]:
                - /url: http://35.200.146.53:8081/applications/54
  - contentinfo [ref=f15e160]:
    - generic [ref=f15e161]:
      - generic [ref=f15e162]: TalentFarm QA Automation Lab
      - generic [ref=f15e163]: Insurance Order Entry Demo
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