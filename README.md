# Accessibility Checker - Browser Extension v1.8.5

* == cross-browser extension
  * allows
    * | specific page containers,
      * audit accessibility issues
    * multi-page flow analysis
    * FULL container screenshots (scrollable modal view)
  * follows
    * [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/)'s 16 checks

## requirements
* Firefox v109+

## 🚀how to install?

### Chrome / Edge / Brave

1. **Download or clone this repository**

   ```bash
   git clone https://github.com/soyjairocosta/accessibility-checker.git
   cd accessibility-checker
   ```

2. **Open Extensions page**

   - | 
     - Chrome,
       - chrome://extensions/
     - Edge,
       - edge://extensions/
   - Enable "Developer mode" (top right corner)

3. **Load the extension**
   - Click "Load unpacked" > Select the "accessibility-checker" folder

4. **Confirm installation**
   - | toolbar,
     - you see the extension icon

### Firefox

1. **Download or clone this repository**

   ```bash
   git clone https://github.com/soyjairocosta/accessibility-checker.git
   cd accessibility-checker
   ```

2. ways
   * **temporarily**
     * use cases
       * testing
     * | browser, 
       * about:debugging#/runtime/this-firefox
         * "Load Temporary Add-on" > [manifest.json](manifest.json)

   * **permanently**
     * | this repo,
       * `npm install` && `npm run firefox:build`
         * generate a .xpi file / ⚠️[zipped](https://wiki.mozilla.org/WebExtensions) ⚠️
     * | browser,
       * about:addons 
         * "Install addon from file" > [dist/accessibility_checker-1.8.5.zip](dist/accessibility_checker-1.8.5.zip)
           * Problems:
             * Problem1: require to be sing in [Firefox](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox?as=u&utm_source=inproduct)
               * Solution: TODO: 

## How to check that it works?

* | any browser,
  * https://example.com,
    * open up the extension
  * | extension, 
    * set selector: body
    * click run analysis

## 📖 How to Use

### Basic Analysis (Single Page)

1. click the extension icon
2. **Configure target container**
    - | "Target Div Class",
        - set the
            - container's class / you want to audit
                - Example: `main-content`, `app-container`, `content-wrapper`, OR
            - HTML tags
                - Example: `main`, `article`, `section`
3. **Select checks**

    - **Basic Checks**:

      | Check               | Description                           | Default |
      |---------------------|---------------------------------------|---------|
      | **Text Size**       | \>= 14px                              | ✅       |
      | **Clickable Icons** | \>= 24x24px                           | ✅       |
      | **Color Contrast**  | == Text-background contrast (WCAG AA) | ✅       |
      | **Border Contrast** | 3:1                                   | ✅       |
      | **ARIA Labels**     | == Accessibility labels               | ✅       |
      | **Empty Elements**  | == Empty clickable elements (0x0px)   | ⬜       |

    - **Advanced Checks**
        - ⚠️by default, disabled⚠️

          | Check                   | Description                               | Priority |
                 |-------------------------|-------------------------------------------|----------|
          | **Focus Visible**       | \| keyboard navigation, focus indicators  | 🔴       |
          | **Tab Order**           | Tabindex issues                           | 🔴       |
          | **Alt Text**            | == ALTERNATIVE text -- to -- images/icons | 🔴       |
          | **Form Labels**         | Form labels                               | 🟡       |
          | **Headings Structure**  | h1-h6 hierarchy                           | 🟡       |
          | **Keyboard Traps**      | Keyboard traps                            | 🟡       |
          | **Hidden Content**      | aria-hidden conflicts                     | 🟡       |
          | **Color Dependence**    | Color-only information                    | 🟢       |
          | **Language Attributes** | lang attributes                           | 🟢       |
          | **Link Text**           | Descriptive links                         | 🟢       |

4. **Run the analysis**

    - Click "Run Analysis"
    - Wait for completion (you'll see success/error message)
    - Errors will be highlighted with red dashed borders and floating labels

5. **Interact with errors**
    - **Floating labels**: Show error message
    - **X button**: Close individual label
    - **Hover**: Labels are semi-transparent (92% opacity)
    - **Auto-positioning**: Labels stack to avoid overlapping

### Multi-Page Flow Analysis

* use cases
    * complete user journeys
        * _Examples:_ checkout process, registration, onboarding

#### Step 1: Start a Flow

1. Click **"🎬 Start Flow"**
2. Enter a descriptive name
   * _Example:_ "Checkout Flow", "Registration Process"
   * -> UI will change showing:
    - **"➕ Analyze Page"** button
      - add pages MANUALLY
    - **"✅ Finish Flow"** button
    - Active flow status

#### Step 2: Analysis ways
##### AUTOMATIC

- ⚠️Close the panel⚠️ & navigate NORMALLY -- through -- your application
  - Reason:🧠the extension AUTOMATICALLY analyze EACH page | change URLs🧠
    - background service worker 
      - detects URL changes
      - AUTOMATICALLY analyzes the new page / saved configuration 
  - You receive **system notifications** confirming / EACH analysis

##### MANUAL

1. | side panel
   * click **"Analyze Page"**
     * -> CURRENT page is analyzed & added | flow

#### Step 3: Finish the Flow

1. open the side panel
   * Click **"Finish Flow"**
   * flow is saved & UI returns to normal mode

### NOT valid | ALL pages

* _Examples:_
  * | Firefox,
    * about:\*
    * addons.mozilla.org
* Reason: 🧠some pages are blocked -- by -- browsers🧠

## 📊 Report System

### Summary in Popup

The popup shows an automatic summary:

- **Flows**: Total number of registered flows
- **Pages**: Total number of analyzed pages
- **Total Errors**: Sum of all found errors

### View Details

1. Click **"View Details"**
2. A table will show:
   - Flow name
   - Page name
   - Error count per page

### Export to Excel

1. Click **"Download Excel"**
2. A CSV file will be downloaded with:
   - **Separator**: `;` (semicolon)
   - **Encoding**: UTF-8 with BOM (Excel compatible)
   - **Name**: `accessibility-report-YYYY-MM-DD-HHMMSS.csv`

#### Excel Structure

```csv
=== FLOW: Checkout Flow ===
FLOW NAME;PAGE NAME;ERROR CODE;ELEMENT TYPE;ID;TRACK ID;DATA-TEST-ID;CLASS;ERROR MESSAGE

Checkout Flow;Cart Page;FONT-SIZE;div;;product-item;;small-text;Font too small: 12px (min: 14px)
Checkout Flow;Cart Page;ICON-SIZE;button;btn-cart;;;btn-icon;Clickable element too small: 20x20px (min: 24x24px)
Checkout Flow;Payment Page;CONTRAST;span;;card-number;;text-gray;Poor color contrast: 2.5:1 (min: 4.5:1)
Checkout Flow;Payment Page;ARIA;input;cvv-input;;;form-input;Missing ARIA label: Input without accessible name
```

**Key features**:

- Flows are separated by headers `=== FLOW: ... ===`
- Pages appear in **chronological order** (by analysis timestamp)
- Each error includes code, element type, identifiers, and complete message
- **CLASS** column shows the first CSS class of the element
- Errors are grouped by flow and page

### Clear Reports

- Click **"Clear Report"** to delete all stored data
- **⚠️ Warning**: This action cannot be undone

---

## 🔍 Error Types and Codes

### Basic Checks

| Code        | Check           | Description                           | WCAG Criteria                 |
| ----------- | --------------- | ------------------------------------- | ----------------------------- |
| `FONT-SIZE` | Text Size       | Font smaller than 14px                | 1.4.4 Resize text (AA)        |
| `ICON-SIZE` | Clickable Icons | Clickable element < 24x24px           | 2.5.5 Target Size (AAA)       |
| `CONTRAST`  | Color Contrast  | Insufficient text-background contrast | 1.4.3 Contrast (AA)           |
| `CONTRAST`  | Border Contrast | Border-background contrast < 3:1      | 1.4.11 Non-text Contrast (AA) |
| `ARIA`      | ARIA Labels     | Missing aria-label/labelledby         | 4.1.2 Name, Role, Value (A)   |
| `EMPTY`     | Empty Elements  | Clickable element 0x0px               | -                             |

### Advanced Checks - High Priority 🔴

| Code       | Check         | Description                         | WCAG Criteria              |
| ---------- | ------------- | ----------------------------------- | -------------------------- |
| `FOCUS`    | Focus Visible | outline: none without alternative   | 2.4.7 Focus Visible (AA)   |
| `TABINDEX` | Tab Order     | Positive or misused tabindex        | 2.4.3 Focus Order (A)      |
| `ALT`      | Alt Text      | Images/SVG without alternative text | 1.1.1 Non-text Content (A) |

### Advanced Checks - Medium Priority 🟡

| Code      | Check              | Description                    | WCAG Criteria                    |
| --------- | ------------------ | ------------------------------ | -------------------------------- |
| `LABEL`   | Form Labels        | Input without associated label | 3.3.2 Labels or Instructions (A) |
| `HEADING` | Headings Structure | Incorrect h1-h6 hierarchy      | 1.3.1 Info and Relationships (A) |
| `TRAP`    | Keyboard Traps     | Hidden focusable element       | 2.1.2 No Keyboard Trap (A)       |
| `HIDDEN`  | Hidden Content     | aria-hidden/visual conflict    | 4.1.2 Name, Role, Value (A)      |

### Advanced Checks - Low Priority 🟢

| Code        | Check            | Description                       | WCAG Criteria              |
| ----------- | ---------------- | --------------------------------- | -------------------------- |
| `COLOR-DEP` | Color Dependence | Information depends only on color | 1.4.1 Use of Color (A)     |
| `LANG`      | Language         | Missing lang attribute            | 3.1.1 Language of Page (A) |
| `LINK`      | Link Text        | Non-descriptive text              | 2.4.4 Link Purpose (A)     |

---

## 🎯 Real Use Cases

### Example 1: Audit Product Page

```
1. Open product page in your e-commerce
2. Enter "product-details" as Target Div Class
3. Enable all Basic Checks
4. Enable Advanced Checks > Alt Text (for product images)
5. Run Analysis
6. Review errors in image gallery, purchase buttons, etc.
```

### Example 2: Complete Checkout Flow

```
1. Go to your home page
2. Enter "app" as Target Div Class
3. Enable all Basic Checks
4. Enable Advanced Checks > Form Labels (for forms)
5. Click "🎬 Start Flow" → Name: "Checkout Flow"
6. Close the popup
7. Navigate: Home → Product → Cart → Checkout → Payment → Confirmation
8. Each page is automatically analyzed (you'll see notifications)
9. Open popup and click "✅ Finish Flow"
10. Click "Download Excel" to get complete report
```

### Example 3: Registration Form Audit

```
1. Open your registration page
2. Enter "registration-form" as Target Div Class
3. Enable basic checks
4. Enable Advanced Checks:
   - Form Labels ✅
   - Focus Visible ✅
   - Tab Order ✅
   - Alt Text ✅
5. Run Analysis
6. Review all inputs, labels, buttons, captchas, etc.
```

---

## ⚙️ Advanced Configuration

### Customize Checks

Each check is independent:

- **Enable/Disable**: Click the toggle for each option
- **Save configuration**: Automatically saved on change
- **Persistence**: Your configuration persists between sessions

### Thresholds and Criteria

Thresholds are defined according to WCAG 2.1:

- **Font Size**: Minimum 14px
- **Icon Size**: Minimum 24x24px (Target Size AAA = 44x44px, we use 24px as compromise)
- **Color Contrast**:
  - Small text: 4.5:1 (AA)
  - Large text (>18px or >14px bold): 3:1 (AA)
- **Border Contrast**: 3:1 (AA)

### Smart Clickable Element Detection

The extension finds the **outermost clickable parent element** to avoid false positives:

**Example**:

```html
<div class="radio-card" style="cursor: pointer; width: 200px;">
  <input type="radio" />
  <label>
    <span class="radio-dot"></span>
    <!-- 8x8px -->
    <span class="label-text"></span>
    <!-- 12x12px -->
  </label>
</div>
```

**Without smart detection**:

- ❌ Error: radio-dot 8x8px too small
- ❌ Error: label-text 12x12px too small

**With smart detection (current)**:

- ✅ OK: radio-card 200xXpx (complete container)

---

## 🔧 Project Structure

```
accessibility-checker/
├── manifest.json              # Extension configuration (Chrome + Firefox)
├── popup.html                 # Side panel / sidebar interface
├── README.md                  # This documentation
│
├── src/
│   ├── background.js          # Service worker (auto-analysis + panel control)
│   ├── browser-polyfill.js    # Chrome/Firefox API compatibility layer
│   ├── content.js             # Audit logic (16 checks)
│   ├── popup.js               # Panel logic and flows
│   └── report.js              # Report system and storage
│
├── styles/
│   ├── popup.css              # Panel styles (responsive)
│   └── content.css            # Page highlight styles
│
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 📝 Technical Notes

### Storage

The extension uses `chrome.storage.local` to store:

- **divClass**: Last used container class
- **options**: State of the 16 checkboxes
- **auditReport**: Object with structure `flow → page → errors[]`
- **activeFlow**: Active flow name (if any)
- **isFlowActive**: Boolean indicating if flow is in progress

### Limits

- **Storage**: Up to 5MB in chrome.storage.local
- **Elements**: No practical limit of elements to analyze
- **Flows**: No limit on flows or pages per flow
- **Performance**: Analysis may take 1-3 seconds on complex pages

### Compatibility

- **Chrome**: Version 116+ (Manifest V3, Side Panel API)
- **Edge**: Version 116+ (Chromium-based)
- **Firefox**: Version 109+ (Manifest V3, Sidebar Action)
- **Brave**: Version 116+ (Chromium-based)
- **Other browsers**: Not supported

### Privacy

- ✅ **Does not collect user data**
- ✅ **All data stored locally**
- ✅ **No external server requests**
- ✅ **Open source and auditable code**

---

## 🐛 Troubleshooting

### "Please enter a div class name"

- **Cause**: No selector entered in Target Div Class
- **Solution**: Enter a CSS class (without dot) or HTML tag

### "Container not found"

- **Cause**: Selector doesn't match any element on page
- **Solution**:
  - Inspect the page (F12)
  - Find the class/tag of the container you want to audit
  - Try more general selectors: `main`, `body`, `app`

### "No errors collected yet"

- **Cause**: No analysis has been run or no errors found
- **Solution**: Run "Run Analysis" on any page

### Error labels overlap

- **Cause**: Many small elements close together
- **Solution**: Extension tries to auto-stack, but in extreme cases:
  - Close individual labels with X button
  - Zoom out on page for better visibility

### Automatic analysis not working

- **Cause**: Service worker disabled or extension reloaded
- **Solution**:
  - Go to `chrome://extensions/`
  - Find "Accessibility Checker"
  - Click "Reload"
  - Start a new flow

### Notifications not appearing

- **Cause**: Notification permissions disabled
- **Solution**:
  - Go to Chrome Settings → Privacy and security → Site settings
  - Notifications → Find the extension
  - Ensure it's set to "Allow"

---

## 🔗 References

- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM**: https://webaim.org/articles/
- **A11Y Project**: https://www.a11yproject.com/checklist/
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/

---

## ✨ Changelog

### v1.4.0 (Current)

- ➕ 10 new advanced checks (16 total)
- 🎨 Expandable UI with Advanced Checks section
- 📱 Responsive popup (350-450px width, up to 600px height)
- 📊 Organization by WCAG priority (High/Medium/Low)
- 📚 Coverage of 11 additional WCAG criteria

### v1.3.3

- ✨ Independent toggle for Border Contrast
- 🔧 Smart detection of clickable parent elements
- 📅 Chronological page ordering in reports

### v1.3.2

- ⚡ Service worker for automatic background analysis
- 🔔 System notifications
- 🎯 Works with popup closed

### v1.3.1

- 🧹 Auto-cleanup of popups on navigation
- 🚀 Auto-analysis when starting flow
- 📋 CLASS column in Excel

### v1.3.0

- 🎬 Multi-page flow system
- 📊 Reports organized by flow and page

---

**Developed by Jairo Costa with ❤️ to improve web accessibility**

Questions or suggestions? Open an issue on GitHub.
