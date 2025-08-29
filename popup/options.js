// Enhanced Tech Support Assistant - Options Page Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Options page loaded');
    
    // Initialize toggle switches
    initializeToggles();
    
    // Load saved settings
    loadSettings();
    
    // Add event listeners
    document.getElementById('saveOptions').addEventListener('click', saveSettings);
});

function initializeToggles() {
    const toggles = document.querySelectorAll('.toggle-switch');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

function loadSettings() {
    chrome.storage.local.get([
        'enabled',
        'showIndicator',
        'autoScan',
        'notifications',
        'soundAlerts',
        'highlightForms',
        'highlightErrors',
        'highlightWarnings'
    ], (result) => {
        // Set toggle states based on saved settings
        setToggleState('enableExtension', result.enabled !== false);
        setToggleState('showIndicator', result.showIndicator !== false);
        setToggleState('autoScan', result.autoScan || false);
        setToggleState('notifications', result.notifications !== false);
        setToggleState('soundAlerts', result.soundAlerts || false);
        setToggleState('highlightForms', result.highlightForms || false);
        setToggleState('highlightErrors', result.highlightErrors || false);
        setToggleState('highlightWarnings', result.highlightWarnings || false);
    });
}

function setToggleState(toggleId, isActive) {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
        if (isActive) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
    }
}

function getToggleState(toggleId) {
    const toggle = document.getElementById(toggleId);
    return toggle ? toggle.classList.contains('active') : false;
}

function saveSettings() {
    const settings = {
        enabled: getToggleState('enableExtension'),
        showIndicator: getToggleState('showIndicator'),
        autoScan: getToggleState('autoScan'),
        notifications: getToggleState('notifications'),
        soundAlerts: getToggleState('soundAlerts'),
        highlightForms: getToggleState('highlightForms'),
        highlightErrors: getToggleState('highlightErrors'),
        highlightWarnings: getToggleState('highlightWarnings')
    };
    
    chrome.storage.local.set(settings, () => {
        showStatusMessage('Settings saved successfully!', 'success');
        
        // Notify background script about settings change
        chrome.runtime.sendMessage({
            action: 'settingsUpdated',
            settings: settings
        });
        
        // Update content scripts if they're active
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'settingsUpdated',
                    settings: settings
                }).catch(() => {
                    // Tab might not have content script loaded yet
                });
            }
        });
    });
}

function showStatusMessage(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 3000);
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveSettings();
    }
});
