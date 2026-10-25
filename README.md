# Insurance Order Entry: Playwright + JavaScript automation

Automated UI and API tests for the **Insurance Order Entry Demo** (Whole Life, port 8081) from the Playwright QA Automation course project.
The suite contains **50 regression scenarios**, including **15 smoke scenarios**. Each case retains its validation ID and risk metadata in its
Playwright test declaration.

The project uses JavaScript throughout; it has **not yet been run against the real lab application**. Expect a first-run tuning pass (see
"First run" below).

## 1. Prerequisites

- Node.js 20 or newer, npm
- Access to your assigned lab VM (Insurance app on `http://136.83.129.92:8081`)
- The test credentials and API key from the **Lab Manual** (sections 3 and 4). They are never stored in this repository.

## 2. Setup

```bash
npm install
npx playwright install --with-deps chromium     # add firefox webkit if you want them
cp .env.example .env                            # Windows PowerShell: Copy-Item .env.example .env
# edit .env: your VM IP, API key, shared password, your learner account
npm run check:javascript
npm run traceability                            # confirms the 50 regression / 15 smoke tags
```

### Environment variables (`.env`)

| Variable | Required | Meaning |
|---|---|---|
| `INSURANCE_BASE_URL` | yes | `http://<your-vm-ip>:8081` (no trailing slash) |
| `INSURANCE_API_KEY` | yes | Insurance API key from Lab Manual section 4 (sent as `X-API-Key`) |
| `INSURANCE_PASSWORD` | yes | Shared test password from Lab Manual section 3.1 |
| `LEARNER_USER` | recommended | Your assigned learner account. **All write flows run as this user** so seeded users stay untouched. Default `learner001@insurance.test` |
| `DISPOSABLE_USER` | optional | A spare learner account for the destructive lockout test (it will be locked for about 30 minutes). Empty = test is skipped |
| `INSURANCE_API_BASE_URL` | optional | Defaults to `INSURANCE_BASE_URL/api` |
| `BROWSERS` | optional | `chromium` (default), or e.g. `chromium,firefox,webkit` |
| `WORKERS` | optional | Default `1`. Keep 1 on the shared lab VM |

## 3. Running

```bash
npm test                      # all 50 regression tests
npm run test:smoke            # 15 smoke tests
npm run test:p1               # priority-1 tests in the selected regression suite
npm run test:regression
npm run test:api
npm run test:e2e              # full submission journey, two data sets
npm run test:headed           # watch the browser
npx playwright test tests/beneficiaries                  # one module
npx playwright test --grep "TC-BEN-003"                   # one test case
npm run report                # open the HTML report
```

Every selected case is tagged `@regression`; the 15 smoke cases also carry `@smoke`. Relevant tests additionally include API, module, priority,
workflow and seeded-defect tags. Case titles include their test-case and validation IDs.

## 4. Project structure

```
tests/        auth/ dashboard/ client-information/ address-contact/ kyc-financial/ product-selection/
              riders/ beneficiaries/ documents/ workflow/ api/          (one spec file per module)
pages/        BasePage + LoginPage, DashboardPage, ClientInformationPage, AddressContactPage, KycFinancialPage,
              ProductCatalogPage, ProductConfigurationPage, RiderSelectionPage, BeneficiaryPage, DocumentUploadPage,
              ReviewPage, ConfirmationPage, ApplicationStatusPage, ChangePasswordPage
fixtures/     auth.fixture.js (api client, evidence capture, second-agent page), users.js, applicationData.js, referenceData.js
utils/        apiClient.js, applicationBuilder.js (fast API set-up), assertions.js, dataGenerator.js, fileUploadHelper.js,
              testHelpers.js, flows.js, messages.js, premium.js, env.js, global-setup.js
scripts/      check-javascript.js, check-traceability.js (validates syntax, unique case IDs and suite tag counts)
reports/      HTML report, JUnit, JSON, traces, screenshots, videos (git-ignored)
.github/workflows/playwright.yaml
```

## 5. How it works

- **Page Object Model.** Tests contain business assertions; page objects hold selectors and actions. Locators are the application's own
  `data-testid` values (the Lab Manual's sample ids `login-email` / `login-submit` are *not* what this build uses).
- **Fast set-up through the API.** `applicationBuilder.buildApplication()` creates and fills an application up to any step
  (`draft`, `client`, `address`, `kyc`, `product`, `riders`, `beneficiaries`, `documents`). UI tests then start at the step under test.
- **Saved logins.** Global setup logs in once per seeded role and stores the session under `.auth/`. Only the login tests perform a UI login.
- **API rules.** The API is protected by a static `X-API-Key`; the acting agent is chosen with `agent_email` (if omitted the API silently uses
  `learner001`). Every API call passes the agent explicitly. UI and API values are only compared for the **same agent**.
  API paths have no leading slash and the base URL ends with `/` (otherwise `/api` is dropped by URL resolution).
- **Browser dialogs.** Over-allocation uses `alert()` and the irrevocable designation uses `confirm()`; `withDialogs()` answers and records them.
- **Browser validation.** Forms use HTML `required`; `disableBrowserValidation()` is used to reach the server-side messages as well.
- **Evidence.** Screenshot and video on failure, trace on first retry (retain-on-failure in CI), console errors and failed requests attached to
  the report for failing tests, HTML + JUnit + JSON reports.
- **Tolerant messages.** Expected messages in `utils/messages.js` are regular expressions. Where the documents do not say *where* an error
  appears (form or review page), the helper checks both and records the observed location as a report annotation (`observation`).

## 6. Classifying a failure (before logging a defect)

Every failure is one of: **application defect**, **automation defect**, **test-data issue**, **environment issue**, or **unstable test**.

1. Re-run the single test (`--workers=1`, `--headed`). A failure that appears only under parallel load is an isolation observation, not a release blocker.
2. Open the trace (`npx playwright show-trace <trace.zip>`): locator/timing problem (automation) or unexpected response (application)?
3. Check the data: fresh application, correct agent, `agent_email` equal to the UI user.
4. For UI-versus-API mismatches confirm **both sides describe the same agent and scope** before calling it a defect.
5. Reproduce manually. Then log it with steps, evidence and business impact. A failing P1 test confirmed as an application defect is release-blocking.

Failing tests are **not automatically seeded defects**: the seeded defects are to be found by executing the tests and analysing the failures.
Report expected seeded defects and unexpected defects separately (Q-17).

## 7. First run (what to expect)

Run the smoke suite first (`npm run test:smoke`), then the remaining regression scenarios. The following were derived from the application's markup and rules but could not
be confirmed against the live app, so check them if a test fails:

- Rider rows are found by name text (`RIDERS[...].rowPattern` in `fixtures/referenceData.js`). Adjust a pattern if a rider name differs.
- Exact wording of error messages (`utils/messages.js`) and whether an error appears on the form or on the review page.
- `TC-AUTH-006` assumes `agent.locked` is still locked (its lock time must not have expired).
- Date-boundary tests (age 18/65) use the runner's clock; run them from a machine whose date matches the VM's, especially near midnight.
- The reduced suite omits lower-priority scenarios from the original test design; see each retained test's ID and validation annotation when
  comparing results with the full design sheet.

## 8. CI/CD (GitHub Actions)

`.github/workflows/playwright.yaml` has two jobs:

- **static-checks** (GitHub-hosted, on every push/PR): JavaScript syntax and suite-tag checks. Needs no application.
- **tests** (manual `workflow_dispatch` or nightly, **self-hosted runner on the lab VM**, label `lab-vm`): runs the chosen suite and uploads the
  HTML report, traces, screenshots and videos as artifacts.

**Limitation (agreed in Q-13):** the app runs on a lab VM that GitHub-hosted runners cannot reach, so the application tests are started manually
from the VM (or by a self-hosted runner installed there). Add the secrets `INSURANCE_BASE_URL`, `INSURANCE_API_KEY`, `INSURANCE_PASSWORD`,
`LEARNER_USER` (and optionally `DISPOSABLE_USER`) to the repository.

## 9. Test tags and metadata

Case IDs, validation IDs, risks, priority, seeded-defect annotations, and Playwright tags are declared directly in each test file. The suite
contains 50 uniquely identified regression tests, with 15 also tagged as smoke tests. `npm run traceability` checks for duplicate IDs and
confirms those suite counts.

## 10. Security

Credentials, the API key and session files (`.env`, `.auth/`) are git-ignored. Do not paste them, or traces/HAR files that contain them, into
documents, chats or screenshots that leave the course workspace.
