document.addEventListener('DOMContentLoaded', function () {
  const divClassInput = document.getElementById('divClass');
  const runAnalysisBtn = document.getElementById('runAnalysis');
  const statusDiv = document.getElementById('status');

  // Flow controls
  const startFlowBtn = document.getElementById('startFlow');
  const addPageToFlowBtn = document.getElementById('addPageToFlow');
  const finishFlowBtn = document.getElementById('finishFlow');
  const flowStatusDiv = document.getElementById('flowStatus');

  // Advanced checks toggle
  const toggleAdvancedBtn = document.getElementById('toggleAdvanced');
  const advancedOptionsDiv = document.getElementById('advancedOptions');
  const toggleIcon = toggleAdvancedBtn.querySelector('.toggle-icon');

  let isFlowActive = false;
  let currentFlowName = '';

  const checkboxes = {
    fontSize: document.getElementById('checkFontSize'),
    iconSize: document.getElementById('checkIconSize'),
    contrast: document.getElementById('checkContrast'),
    borderContrast: document.getElementById('checkBorderContrast'),
    ariaLabel: document.getElementById('checkAriaLabel'),
    emptyElements: document.getElementById('checkEmptyElements'),
    // Advanced checks
    focusVisible: document.getElementById('checkFocusVisible'),
    tabOrder: document.getElementById('checkTabOrder'),
    altText: document.getElementById('checkAltText'),
    formLabels: document.getElementById('checkFormLabels'),
    headings: document.getElementById('checkHeadings'),
    keyboardTraps: document.getElementById('checkKeyboardTraps'),
    hiddenContent: document.getElementById('checkHiddenContent'),
    colorDependence: document.getElementById('checkColorDependence'),
    language: document.getElementById('checkLanguage'),
    linkText: document.getElementById('checkLinkText'),
  };

  // Toggle advanced options
  toggleAdvancedBtn.addEventListener('click', function () {
    const isExpanded = advancedOptionsDiv.style.display !== 'none';
    advancedOptionsDiv.style.display = isExpanded ? 'none' : 'block';
    toggleIcon.classList.toggle('expanded');
  });

  // Load saved state
  chrome.storage.local.get(['divClass', 'options'], function (result) {
    console.log('Loading saved state:', result);

    if (result.divClass) {
      divClassInput.value = result.divClass;
    }

    if (result.options) {
      checkboxes.fontSize.checked = result.options.fontSize !== false;
      checkboxes.iconSize.checked = result.options.iconSize !== false;
      checkboxes.contrast.checked = result.options.contrast !== false;
      checkboxes.borderContrast.checked =
        result.options.borderContrast !== false;
      checkboxes.ariaLabel.checked = result.options.ariaLabel !== false;
      checkboxes.emptyElements.checked = result.options.emptyElements === true; // Default false

      // Advanced checks - all default to false
      checkboxes.focusVisible.checked = result.options.focusVisible === true;
      checkboxes.tabOrder.checked = result.options.tabOrder === true;
      checkboxes.altText.checked = result.options.altText === true;
      checkboxes.formLabels.checked = result.options.formLabels === true;
      checkboxes.headings.checked = result.options.headings === true;
      checkboxes.keyboardTraps.checked = result.options.keyboardTraps === true;
      checkboxes.hiddenContent.checked = result.options.hiddenContent === true;
      checkboxes.colorDependence.checked =
        result.options.colorDependence === true;
      checkboxes.language.checked = result.options.language === true;
      checkboxes.linkText.checked = result.options.linkText === true;
    }
  });

  // Save state on change
  function saveState() {
    const options = {
      fontSize: checkboxes.fontSize.checked,
      iconSize: checkboxes.iconSize.checked,
      contrast: checkboxes.contrast.checked,
      borderContrast: checkboxes.borderContrast.checked,
      ariaLabel: checkboxes.ariaLabel.checked,
      emptyElements: checkboxes.emptyElements.checked,
      // Advanced checks
      focusVisible: checkboxes.focusVisible.checked,
      tabOrder: checkboxes.tabOrder.checked,
      altText: checkboxes.altText.checked,
      formLabels: checkboxes.formLabels.checked,
      headings: checkboxes.headings.checked,
      keyboardTraps: checkboxes.keyboardTraps.checked,
      hiddenContent: checkboxes.hiddenContent.checked,
      colorDependence: checkboxes.colorDependence.checked,
      language: checkboxes.language.checked,
      linkText: checkboxes.linkText.checked,
    };

    const dataToSave = {
      divClass: divClassInput.value,
      options: options,
    };

    chrome.storage.local.set(dataToSave, function () {
      if (chrome.runtime.lastError) {
        console.error('Error saving state:', chrome.runtime.lastError);
      } else {
        console.log('State saved:', dataToSave);
      }
    });
  }

  divClassInput.addEventListener('input', saveState);
  divClassInput.addEventListener('change', saveState); // Save on blur/change too
  Object.values(checkboxes).forEach((cb) =>
    cb.addEventListener('change', saveState)
  );

  // Save state before popup closes
  window.addEventListener('beforeunload', saveState);

  // Run analysis
  runAnalysisBtn.addEventListener('click', async function () {
    const divClass = divClassInput.value.trim();

    if (!divClass) {
      showStatus('Please enter a div class name', 'error');
      return;
    }

    const options = {
      fontSize: checkboxes.fontSize.checked,
      iconSize: checkboxes.iconSize.checked,
      contrast: checkboxes.contrast.checked,
      borderContrast: checkboxes.borderContrast.checked,
      ariaLabel: checkboxes.ariaLabel.checked,
      emptyElements: checkboxes.emptyElements.checked,
      // Advanced checks
      focusVisible: checkboxes.focusVisible.checked,
      tabOrder: checkboxes.tabOrder.checked,
      altText: checkboxes.altText.checked,
      formLabels: checkboxes.formLabels.checked,
      headings: checkboxes.headings.checked,
      keyboardTraps: checkboxes.keyboardTraps.checked,
      hiddenContent: checkboxes.hiddenContent.checked,
      colorDependence: checkboxes.colorDependence.checked,
      language: checkboxes.language.checked,
      linkText: checkboxes.linkText.checked,
    };

    // Check if at least one option is selected
    if (!Object.values(options).some((v) => v)) {
      showStatus('Please enable at least one audit option', 'error');
      return;
    }

    runAnalysisBtn.disabled = true;
    showStatus('Running analysis...', 'info');

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Inject scripts dynamically into the current tab
      try {
        // Inject CSS first
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['styles/content.css'],
        });

        // Inject JavaScript files
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['src/report.js', 'src/content.js'],
        });
      } catch (injectionError) {
        console.log(
          'Scripts may already be injected, continuing...',
          injectionError
        );
      }

      // Small delay to ensure scripts are loaded
      await new Promise((resolve) => setTimeout(resolve, 100));

      await chrome.tabs.sendMessage(
        tab.id,
        {
          action: 'runAudit',
          divClass: divClass,
          options: options,
        },
        function (response) {
          runAnalysisBtn.disabled = false;

          if (chrome.runtime.lastError) {
            showStatus('Error: Please refresh the page and try again', 'error');
            return;
          }

          if (response && response.success) {
            showStatus(
              `Analysis complete! Found ${response.errorCount} issue(s)`,
              'success'
            );
          } else if (response && response.error) {
            showStatus(response.error, 'error');
          }
        }
      );
    } catch (error) {
      runAnalysisBtn.disabled = false;
      showStatus('Error: ' + error.message, 'error');
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status-message ' + type;

    if (type === 'success' || type === 'error') {
      setTimeout(() => {
        statusDiv.className = 'status-message';
      }, 5000);
    }
  }

  // ===== FLOW MANAGEMENT =====

  // Function to analyze current page (reusable)
  async function analyzeCurrentPage() {
    if (!isFlowActive) {
      showStatus('No active flow. Start a flow first.', 'error');
      return;
    }

    const divClass = divClassInput.value.trim();

    if (!divClass) {
      showStatus('Please enter a div class name', 'error');
      return;
    }

    const options = {
      fontSize: checkboxes.fontSize.checked,
      iconSize: checkboxes.iconSize.checked,
      contrast: checkboxes.contrast.checked,
      borderContrast: checkboxes.borderContrast.checked,
      ariaLabel: checkboxes.ariaLabel.checked,
      emptyElements: checkboxes.emptyElements.checked,
      // Advanced checks
      focusVisible: checkboxes.focusVisible.checked,
      tabOrder: checkboxes.tabOrder.checked,
      altText: checkboxes.altText.checked,
      formLabels: checkboxes.formLabels.checked,
      headings: checkboxes.headings.checked,
      keyboardTraps: checkboxes.keyboardTraps.checked,
      hiddenContent: checkboxes.hiddenContent.checked,
      colorDependence: checkboxes.colorDependence.checked,
      language: checkboxes.language.checked,
      linkText: checkboxes.linkText.checked,
    };

    if (!Object.values(options).some((v) => v)) {
      showStatus('Please enable at least one audit option', 'error');
      return;
    }

    addPageToFlowBtn.disabled = true;
    showStatus('Analyzing page and adding to flow...', 'info');

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Inject scripts dynamically
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['styles/content.css'],
        });

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['src/report.js', 'src/content.js'],
        });
      } catch (injectionError) {
        console.log(
          'Scripts may already be injected, continuing...',
          injectionError
        );
      }

      // Small delay to ensure scripts are loaded
      await new Promise((resolve) => setTimeout(resolve, 100));

      await chrome.tabs.sendMessage(
        tab.id,
        {
          action: 'runAudit',
          divClass: divClass,
          options: options,
          flowName: currentFlowName,
        },
        function (response) {
          addPageToFlowBtn.disabled = false;

          if (chrome.runtime.lastError) {
            showStatus('Error: Please refresh the page and try again', 'error');
            return;
          }

          if (response && response.success) {
            showStatus(
              `Page analyzed! Found ${response.errorCount} issue(s)`,
              'success'
            );

            // Update flow status
            chrome.storage.local.get(['auditReport'], function (data) {
              const report = data.auditReport || {};
              const flowPages = report[currentFlowName] || {};
              const pageCount = Object.keys(flowPages).length;

              flowStatusDiv.textContent = `🎬 Flow: "${currentFlowName}" - ${pageCount} page(s) analyzed`;
            });
          } else if (response && response.error) {
            showStatus(response.error, 'error');
          }
        }
      );
    } catch (error) {
      addPageToFlowBtn.disabled = false;
      showStatus('Error: ' + error.message, 'error');
    }
  }

  // Start a new flow
  startFlowBtn.addEventListener('click', async function () {
    const flowName = prompt(
      'Enter a name for this flow:',
      'Flow ' + new Date().toLocaleString()
    );

    if (!flowName || !flowName.trim()) {
      showStatus('Flow name cannot be empty', 'error');
      return;
    }

    currentFlowName = flowName.trim();
    isFlowActive = true;

    // Get current config
    const divClass = divClassInput.value.trim();
    const options = {
      fontSize: checkboxes.fontSize.checked,
      iconSize: checkboxes.iconSize.checked,
      contrast: checkboxes.contrast.checked,
      borderContrast: checkboxes.borderContrast.checked,
      ariaLabel: checkboxes.ariaLabel.checked,
      emptyElements: checkboxes.emptyElements.checked,
      // Advanced checks
      focusVisible: checkboxes.focusVisible.checked,
      tabOrder: checkboxes.tabOrder.checked,
      altText: checkboxes.altText.checked,
      formLabels: checkboxes.formLabels.checked,
      headings: checkboxes.headings.checked,
      keyboardTraps: checkboxes.keyboardTraps.checked,
      hiddenContent: checkboxes.hiddenContent.checked,
      colorDependence: checkboxes.colorDependence.checked,
      language: checkboxes.language.checked,
      linkText: checkboxes.linkText.checked,
    };

    // Save flow state + config for background service worker
    chrome.storage.local.set({
      activeFlow: currentFlowName,
      isFlowActive: true,
      divClass: divClass,
      options: options,
    });

    // Notify background service worker
    chrome.runtime.sendMessage({
      action: 'flowStarted',
      flowName: currentFlowName,
    });

    // Update UI
    startFlowBtn.style.display = 'none';
    addPageToFlowBtn.style.display = 'block';
    finishFlowBtn.style.display = 'block';
    runAnalysisBtn.disabled = true;

    flowStatusDiv.style.display = 'block';
    flowStatusDiv.textContent = `🎬 Flow active: "${currentFlowName}" - Analyzing first page...`;

    showStatus(
      `Flow "${currentFlowName}" started! Analyzing current page...`,
      'info'
    );

    // Automatically analyze the first page
    await analyzeCurrentPage();
  });

  // Add current page to flow
  addPageToFlowBtn.addEventListener('click', async function () {
    await analyzeCurrentPage();
  });

  // Finish flow
  finishFlowBtn.addEventListener('click', function () {
    if (!isFlowActive) {
      return;
    }

    chrome.storage.local.get(['auditReport'], function (data) {
      const report = data.auditReport || {};
      const flowPages = report[currentFlowName] || {};
      const pageCount = Object.keys(flowPages).length;

      if (pageCount === 0) {
        if (
          !confirm(
            'This flow has no pages analyzed. Do you want to finish it anyway?'
          )
        ) {
          return;
        }
      }

      isFlowActive = false;
      currentFlowName = '';

      // Clear flow state
      chrome.storage.local.set({
        activeFlow: null,
        isFlowActive: false,
      });

      // Notify background service worker
      chrome.runtime.sendMessage({
        action: 'flowFinished',
      });

      // Update UI
      startFlowBtn.style.display = 'block';
      addPageToFlowBtn.style.display = 'none';
      finishFlowBtn.style.display = 'none';
      runAnalysisBtn.disabled = false;

      flowStatusDiv.style.display = 'none';

      showStatus(`Flow finished with ${pageCount} page(s)`, 'success');

      // Refresh report summary
      setTimeout(() => loadReportSummary(), 500);
    });
  });

  // Restore flow state on popup open
  chrome.storage.local.get(['activeFlow', 'isFlowActive'], function (result) {
    if (result.isFlowActive && result.activeFlow) {
      currentFlowName = result.activeFlow;
      isFlowActive = true;

      startFlowBtn.style.display = 'none';
      addPageToFlowBtn.style.display = 'block';
      finishFlowBtn.style.display = 'block';
      runAnalysisBtn.disabled = true;

      chrome.storage.local.get(['auditReport'], function (data) {
        const report = data.auditReport || {};
        const flowPages = report[currentFlowName] || {};
        const pageCount = Object.keys(flowPages).length;

        flowStatusDiv.style.display = 'block';
        flowStatusDiv.textContent = `🎬 Flow: "${currentFlowName}" - ${pageCount} page(s) analyzed`;
      });
    }
  });

  // ===== REPORT MANAGEMENT =====
  const reportSummary = document.getElementById('reportSummary');
  const reportTable = document.getElementById('reportTable');
  const reportTableBody = document.getElementById('reportTableBody');
  const viewReportBtn = document.getElementById('viewReport');
  const downloadReportBtn = document.getElementById('downloadReport');
  const clearReportBtn = document.getElementById('clearReport');

  // Load and display report summary on popup load
  loadReportSummary();

  // View report details
  viewReportBtn.addEventListener('click', function () {
    if (reportTable.style.display === 'none') {
      loadReportTable();
      reportTable.style.display = 'block';
      viewReportBtn.textContent = 'Hide Details';
    } else {
      reportTable.style.display = 'none';
      viewReportBtn.textContent = 'View Details';
    }
  });

  // Download report as CSV/Excel
  downloadReportBtn.addEventListener('click', async function () {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      chrome.tabs.sendMessage(
        tab.id,
        { action: 'getReport' },
        function (report) {
          if (
            chrome.runtime.lastError ||
            !report ||
            Object.keys(report).length === 0
          ) {
            showStatus('No report data to download', 'error');
            return;
          }

          generateExcelFile(report);
          showStatus('Report downloaded successfully!', 'success');
        }
      );
    } catch (error) {
      showStatus('Error downloading report: ' + error.message, 'error');
    }
  });

  // Clear report data
  clearReportBtn.addEventListener('click', async function () {
    if (
      !confirm(
        'Are you sure you want to clear all report data? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      chrome.tabs.sendMessage(
        tab.id,
        { action: 'clearReport' },
        function (response) {
          if (response && response.success) {
            loadReportSummary();
            reportTable.style.display = 'none';
            viewReportBtn.textContent = 'View Details';
            showStatus('Report data cleared', 'success');
          }
        }
      );
    } catch (error) {
      showStatus('Error clearing report: ' + error.message, 'error');
    }
  });

  function loadReportSummary() {
    chrome.storage.local.get(['auditReport'], function (data) {
      const report = data.auditReport || {};
      const flowCount = Object.keys(report).length;

      let totalErrors = 0;
      let totalPages = 0;

      Object.values(report).forEach((flow) => {
        totalPages += Object.keys(flow).length;
        Object.values(flow).forEach((pageData) => {
          // Handle both old format (array) and new format (object with errors array)
          const errors = Array.isArray(pageData)
            ? pageData
            : pageData.errors || [];
          totalErrors += errors.length;
        });
      });

      if (flowCount === 0) {
        reportSummary.innerHTML =
          '<p class="summary-text">No errors collected yet. Run analysis to start.</p>';
      } else {
        reportSummary.innerHTML = `
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">Flows:</span>
              <span class="stat-value">${flowCount}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pages:</span>
              <span class="stat-value">${totalPages}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Errors:</span>
              <span class="stat-value">${totalErrors}</span>
            </div>
          </div>
        `;
      }
    });
  }

  function loadReportTable() {
    chrome.storage.local.get(['auditReport'], function (data) {
      const report = data.auditReport || {};

      reportTableBody.innerHTML = '';

      Object.entries(report).forEach(([flowName, pages]) => {
        Object.entries(pages).forEach(([pageName, pageData]) => {
          // Handle both old format (array) and new format (object with errors array)
          const errors = Array.isArray(pageData)
            ? pageData
            : pageData.errors || [];

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${flowName}</td>
            <td>${pageName}</td>
            <td>${errors.length}</td>
          `;
          reportTableBody.appendChild(row);
        });
      });
    });
  }

  function generateExcelFile(report) {
    // Generate CSV content with multiple sections (one per flow)
    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility

    Object.entries(report).forEach(([flowName, pages]) => {
      // Add flow header
      csvContent += `\n=== FLOW: ${flowName} ===\n`;
      csvContent +=
        'FLOW NAME;PAGE NAME;ERROR CODE;ELEMENT TYPE;ID;TRACK ID;DATA-TEST-ID;CLASS;ERROR MESSAGE\n';

      // Sort pages by timestamp (chronological order)
      const sortedPages = Object.entries(pages).sort((a, b) => {
        const timestampA = a[1].pageTimestamp || ''; // Handle old format without pageTimestamp
        const timestampB = b[1].pageTimestamp || '';
        return timestampA.localeCompare(timestampB);
      });

      sortedPages.forEach(([pageName, pageData]) => {
        // Handle both old format (array) and new format (object with errors array)
        const errors = Array.isArray(pageData)
          ? pageData
          : pageData.errors || [];

        errors.forEach((error) => {
          const row = [
            flowName,
            pageName,
            error.errorCode,
            error.tagName,
            error.id,
            error.trackId,
            error.dataTestId,
            error.className || '',
            error.message,
          ]
            .map((cell) => `"${cell}"`)
            .join(';');

          csvContent += row + '\n';
        });
      });

      csvContent += '\n'; // Empty line between flows
    });

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5);
    link.setAttribute('href', url);
    link.setAttribute('download', `accessibility-report-${timestamp}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Refresh report summary after each analysis
  const originalShowStatus = showStatus;
  showStatus = function (message, type) {
    originalShowStatus(message, type);
    if (type === 'success' && message.includes('Analysis complete')) {
      setTimeout(() => loadReportSummary(), 500);
    }
  };
});
