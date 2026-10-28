# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: client-information\client.spec.js >> Client / insured information >> TC-CLI-001 | CLI-V01 | Verify that an agent is able to provide valid insured information
- Location: tests\client-information\client.spec.js:20:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Qauyekxp"
Received: undefined
```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - navigation [ref=f3e2]:
    - generic [ref=f3e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f3e4] [cursor=pointer]:
        - /url: http://35.200.146.53:8081/dashboard
        - generic [aria-hidden] [ref=f3e5]: IO
        - generic [ref=f3e6]:
          - generic [ref=f3e7]: Insurance Order Entry Demo Platform
          - generic [ref=f3e8]: QA Automation Training App
      - generic [ref=f3e9]:
        - list [ref=f3e10]:
          - listitem [ref=f3e11]:
            - link "Dashboard" [ref=f3e12] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/dashboard
          - listitem [ref=f3e13]:
            - link "Applications" [ref=f3e14] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/applications
          - listitem [ref=f3e15]:
            - link "Products" [ref=f3e16] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/products
          - listitem [ref=f3e17]:
            - link "Support" [ref=f3e18] [cursor=pointer]:
              - /url: http://35.200.146.53:8081/support
        - generic [ref=f3e19]:
          - link "Learner Agent 001" [ref=f3e20] [cursor=pointer]:
            - /url: http://35.200.146.53:8081/profile
          - button "Logout" [ref=f3e22] [cursor=pointer]
  - main [ref=f3e23]:
    - alert [ref=f3e24]: Client information saved.
    - generic [ref=f3e26]:
      - link "← Back to Client Information" [ref=f3e27] [cursor=pointer]:
        - /url: http://35.200.146.53:8081/applications/62/client
      - link "Application Summary" [ref=f3e28] [cursor=pointer]:
        - /url: http://35.200.146.53:8081/applications/62
    - generic [ref=f3e29]:
      - generic [ref=f3e30]:
        - heading "Address and Contact Information" [level=1] [ref=f3e31]
        - paragraph [ref=f3e32]: US address, ZIP, phone, and email details.
      - generic [ref=f3e33]:
        - generic [ref=f3e34]:
          - strong [ref=f3e36]: Residential Address
          - generic [ref=f3e38]:
            - generic [ref=f3e39]:
              - generic [ref=f3e40]: Street Address *
              - textbox "123 Main Street" [ref=f3e41]
            - generic [ref=f3e42]:
              - generic [ref=f3e43]: Apt / Suite
              - textbox "Apt 4B" [ref=f3e44]
            - generic [ref=f3e45]:
              - generic [ref=f3e46]: City *
              - textbox "Austin" [ref=f3e47]
            - generic [ref=f3e48]:
              - generic [ref=f3e49]: State *
              - combobox [ref=f3e50]:
                - option "Select state" [selected]
                - option "Alabama (AL)"
                - option "Alaska (AK)"
                - option "Arizona (AZ)"
                - option "Arkansas (AR)"
                - option "California (CA)"
                - option "Colorado (CO)"
                - option "Connecticut (CT)"
                - option "Delaware (DE)"
                - option "District of Columbia (DC)"
                - option "Florida (FL)"
                - option "Georgia (GA)"
                - option "Hawaii (HI)"
                - option "Idaho (ID)"
                - option "Illinois (IL)"
                - option "Indiana (IN)"
                - option "Iowa (IA)"
                - option "Kansas (KS)"
                - option "Kentucky (KY)"
                - option "Louisiana (LA)"
                - option "Maine (ME)"
                - option "Maryland (MD)"
                - option "Massachusetts (MA)"
                - option "Michigan (MI)"
                - option "Minnesota (MN)"
                - option "Mississippi (MS)"
                - option "Missouri (MO)"
                - option "Montana (MT)"
                - option "Nebraska (NE)"
                - option "Nevada (NV)"
                - option "New Hampshire (NH)"
                - option "New Jersey (NJ)"
                - option "New Mexico (NM)"
                - option "New York (NY)"
                - option "North Carolina (NC)"
                - option "North Dakota (ND)"
                - option "Ohio (OH)"
                - option "Oklahoma (OK)"
                - option "Oregon (OR)"
                - option "Pennsylvania (PA)"
                - option "Rhode Island (RI)"
                - option "South Carolina (SC)"
                - option "South Dakota (SD)"
                - option "Tennessee (TN)"
                - option "Texas (TX)"
                - option "Utah (UT)"
                - option "Vermont (VT)"
                - option "Virginia (VA)"
                - option "Washington (WA)"
                - option "West Virginia (WV)"
                - option "Wisconsin (WI)"
                - option "Wyoming (WY)"
            - generic [ref=f3e51]:
              - generic [ref=f3e52]: ZIP Code *
              - textbox "73301" [ref=f3e53]
              - generic [ref=f3e54]: Use 12345 or 12345-6789.
        - generic [ref=f3e55]:
          - generic [ref=f3e56]:
            - strong [ref=f3e57]: Mailing Address
            - generic [ref=f3e58]:
              - checkbox "Same as residential" [ref=f3e59]
              - generic [ref=f3e60]: Same as residential
          - generic [ref=f3e63]:
            - generic [ref=f3e64]:
              - generic [ref=f3e65]: Street Address
              - textbox "PO Box or street address" [ref=f3e66]
            - generic [ref=f3e67]:
              - generic [ref=f3e68]: Apt / Suite
              - textbox "Suite 200" [ref=f3e69]
            - generic [ref=f3e70]:
              - generic [ref=f3e71]: City
              - textbox "Dallas" [ref=f3e72]
            - generic [ref=f3e73]:
              - generic [ref=f3e74]: State
              - combobox [ref=f3e75]:
                - option "Select state" [selected]
                - option "Alabama (AL)"
                - option "Alaska (AK)"
                - option "Arizona (AZ)"
                - option "Arkansas (AR)"
                - option "California (CA)"
                - option "Colorado (CO)"
                - option "Connecticut (CT)"
                - option "Delaware (DE)"
                - option "District of Columbia (DC)"
                - option "Florida (FL)"
                - option "Georgia (GA)"
                - option "Hawaii (HI)"
                - option "Idaho (ID)"
                - option "Illinois (IL)"
                - option "Indiana (IN)"
                - option "Iowa (IA)"
                - option "Kansas (KS)"
                - option "Kentucky (KY)"
                - option "Louisiana (LA)"
                - option "Maine (ME)"
                - option "Maryland (MD)"
                - option "Massachusetts (MA)"
                - option "Michigan (MI)"
                - option "Minnesota (MN)"
                - option "Mississippi (MS)"
                - option "Missouri (MO)"
                - option "Montana (MT)"
                - option "Nebraska (NE)"
                - option "Nevada (NV)"
                - option "New Hampshire (NH)"
                - option "New Jersey (NJ)"
                - option "New Mexico (NM)"
                - option "New York (NY)"
                - option "North Carolina (NC)"
                - option "North Dakota (ND)"
                - option "Ohio (OH)"
                - option "Oklahoma (OK)"
                - option "Oregon (OR)"
                - option "Pennsylvania (PA)"
                - option "Rhode Island (RI)"
                - option "South Carolina (SC)"
                - option "South Dakota (SD)"
                - option "Tennessee (TN)"
                - option "Texas (TX)"
                - option "Utah (UT)"
                - option "Vermont (VT)"
                - option "Virginia (VA)"
                - option "Washington (WA)"
                - option "West Virginia (WV)"
                - option "Wisconsin (WI)"
                - option "Wyoming (WY)"
            - generic [ref=f3e76]:
              - generic [ref=f3e77]: ZIP Code
              - textbox "75201" [ref=f3e78]
        - generic [ref=f3e79]:
          - strong [ref=f3e81]: Contact Information
          - generic [ref=f3e83]:
            - generic [ref=f3e84]:
              - generic [ref=f3e85]: Primary Email *
              - textbox "name@example.com" [ref=f3e86]
            - generic [ref=f3e87]:
              - generic [ref=f3e88]: Mobile Phone *
              - textbox "(212) 555-1212" [ref=f3e89]
            - generic [ref=f3e90]:
              - generic [ref=f3e91]: Alternate Phone
              - textbox "312-555-1212" [ref=f3e92]
            - generic [ref=f3e93]:
              - generic [ref=f3e94]: Preferred Contact Mode *
              - combobox [ref=f3e95]:
                - option "Select mode" [selected]
                - option "Email"
                - option "Phone"
                - option "Postal Mail"
        - generic [ref=f3e96]:
          - link "Back" [ref=f3e97] [cursor=pointer]:
            - /url: http://35.200.146.53:8081/applications/62/client
          - button "Save and Continue" [ref=f3e98] [cursor=pointer]
  - contentinfo [ref=f3e99]:
    - generic [ref=f3e100]:
      - generic [ref=f3e101]: TalentFarm QA Automation Lab
      - generic [ref=f3e102]: Insurance Order Entry Demo
```

# Test source

```ts
  1  | "use strict";
  2  | Object.defineProperty(exports, "__esModule", { value: true });
  3  | const { test, asRole, expect } = require("../../fixtures/auth.fixture");
  4  | const { emailOf } = require("../../fixtures/users");
  5  | const { clientData } = require("../../fixtures/applicationData");
  6  | const { DashboardPage } = require("../../pages/DashboardPage");
  7  | const { ClientInformationPage } = require("../../pages/ClientInformationPage");
  8  | const { ReviewPage } = require("../../pages/ReviewPage");
  9  | const { buildApplication } = require("../../utils/applicationBuilder");
  10 | const { ageErrorSurface } = require("../../utils/flows");
  11 | const { MSG } = require("../../utils/messages");
  12 | const { dobForAge, futureDate, toIso } = require("../../utils/dataGenerator");
  13 | const { anyMatches } = require("../../utils/assertions");
  14 | test.use(asRole('learner'));
  15 | /** Fast set-up: an empty draft created through the API; the UI is then used for the behaviour under test. */
  16 | async function emptyDraft(api) {
  17 |     return (await buildApplication(api, { agentEmail: emailOf('learner'), upTo: 'draft' })).id;
  18 | }
  19 | test.describe('Client / insured information', () => {
  20 |     test("TC-CLI-001 | CLI-V01 | Verify that an agent is able to provide valid insured information", { "tag": ["@regression", "@smoke", "@client", "@P1"], "annotation": [{ "type": "validation-id", "description": "CLI-V01" }, { "type": "risk", "description": "R-CLI-03, R-CLI-05" }, { "type": "priority", "description": "P1" }] }, async ({ page, api }) => {
  21 |         const dashboard = new DashboardPage(page);
  22 |         await dashboard.goto();
  23 |         const id = await dashboard.startNewApplication(); // full UI flow: dashboard -> start -> create draft
  24 |         const client = new ClientInformationPage(page);
  25 |         const data = clientData();
  26 |         await client.fillAndSave(data);
  27 |         await client.expectNoErrors();
  28 |         await test.step('saved values equal the entered values (API read-back)', async () => {
  29 |             const res = await api.getClient(id, emailOf('learner'));
> 30 |             expect(res.body?.data?.first_name).toBe(data.firstName);
     |                                                ^ Error: expect(received).toBe(expected) // Object.is equality
  31 |             expect(res.body?.data?.last_name).toBe(data.lastName);
  32 |             expect(String(res.body?.data?.date_of_birth).slice(0, 10)).toBe(data.dob);
  33 |         });
  34 |     });
  35 |     test("TC-CLI-003 | CLI-V03 | Verify that dOB below 18 is blocked", { "tag": ["@regression", "@client", "@SDC-04", "@P1"], "annotation": [{ "type": "validation-id", "description": "CLI-V03" }, { "type": "risk", "description": "R-CLI-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-04" }] }, async ({ page, api }, testInfo) => {
  36 |         const id = await emptyDraft(api);
  37 |         const client = new ClientInformationPage(page);
  38 |         await client.goto(id);
  39 |         await client.fill(clientData({ dob: dobForAge(18, 1) })); // 17 years 364 days
  40 |         await client.save();
  41 |         const where = await ageErrorSurface(page, id);
  42 |         testInfo.annotations.push({ type: 'observation', description: `Age error shown on: ${where ?? 'NOWHERE'}` });
  43 |         expect(where, 'age 17y364d must produce the age-range error (form or review page)').not.toBeNull();
  44 |     });
  45 |     test("TC-CLI-004 | CLI-V04 | Verify that dOB above 65 is blocked", { "tag": ["@regression", "@client", "@SDC-04", "@P1"], "annotation": [{ "type": "validation-id", "description": "CLI-V04" }, { "type": "risk", "description": "R-CLI-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-04" }] }, async ({ page, api }, testInfo) => {
  46 |         const id = await emptyDraft(api);
  47 |         const client = new ClientInformationPage(page);
  48 |         await client.goto(id);
  49 |         await client.fill(clientData({ dob: dobForAge(66) }));
  50 |         await client.save();
  51 |         const where = await ageErrorSurface(page, id);
  52 |         testInfo.annotations.push({ type: 'observation', description: `Age error shown on: ${where ?? 'NOWHERE'}` });
  53 |         expect(where, 'age 66 must produce the age-range error (form or review page)').not.toBeNull();
  54 |     });
  55 |     test("TC-CLI-005 | CLI-V05 | Verify that future DOB is blocked", { "tag": ["@regression", "@client", "@SDC-05", "@P2"], "annotation": [{ "type": "validation-id", "description": "CLI-V05" }, { "type": "risk", "description": "R-CLI-02" }, { "type": "priority", "description": "P2" }, { "type": "seeded-defect-candidate", "description": "SDC-05" }] }, async ({ page, api }) => {
  56 |         const id = await emptyDraft(api);
  57 |         const client = new ClientInformationPage(page);
  58 |         for (const dob of [futureDate(1), futureDate(3650)]) {
  59 |             await test.step(`DOB ${dob}`, async () => {
  60 |                 await client.goto(id);
  61 |                 await client.fill(clientData({ dob }));
  62 |                 await client.save();
  63 |                 await expect(page).toHaveURL(/\/client/);
  64 |                 await client.expectErrorMatching(MSG.futureDob);
  65 |             });
  66 |         }
  67 |         await test.step('nothing in the future was stored', async () => {
  68 |             const res = await api.getClient(id, emailOf('learner'));
  69 |             const stored = res.body?.data?.date_of_birth;
  70 |             if (stored)
  71 |                 expect(String(stored).slice(0, 10) <= toIso(new Date())).toBe(true);
  72 |         });
  73 |     });
  74 |     test("TC-CLI-006 | CLI-P01 | Verify that age boundaries 18 and 65 are accepted", { "tag": ["@regression", "@client", "@SDC-04", "@P1"], "annotation": [{ "type": "validation-id", "description": "CLI-P01" }, { "type": "risk", "description": "R-CLI-01" }, { "type": "priority", "description": "P1" }, { "type": "seeded-defect-candidate", "description": "SDC-04" }] }, async ({ page, api }) => {
  75 |         const id = await emptyDraft(api);
  76 |         const client = new ClientInformationPage(page);
  77 |         const review = new ReviewPage(page);
  78 |         for (const age of [18, 65]) {
  79 |             await test.step(`age exactly ${age}`, async () => {
  80 |                 await client.goto(id);
  81 |                 await client.fill(clientData({ dob: dobForAge(age) }));
  82 |                 await client.save();
  83 |                 await expect(page, `age ${age} is accepted and the flow moves on`).toHaveURL(/address-contact/);
  84 |                 await review.goto(id);
  85 |                 expect(await review.calculatedAge(), 'calculated age on review page').toBe(age);
  86 |                 expect(anyMatches(await review.errors(), MSG.ageRange), `no age error at ${age}`).toBe(false);
  87 |             });
  88 |         }
  89 |     });
  90 | });
  91 | 
```