// Settings Page JavaScript
class SettingsManager {
    constructor() {
        this.settings = {};
        this.init();
    }
    
    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            window.close();
        });
        
        // API key input
        const apiKeyInput = document.getElementById('api-key-input');
        apiKeyInput.addEventListener('input', (e) => {
            this.settings.openai_api_key = e.target.value;
            this.updateAPIStatus();
        });
        
        // Test API button
        document.getElementById('test-api-btn').addEventListener('click', () => {
            this.testAPIKey();
        });
        
        // Clear API button
        document.getElementById('clear-api-btn').addEventListener('click', () => {
            this.clearAPIKey();
        });
        
        // Toggle switches
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                this.updateToggleSettings();
            });
        });
        
        // Interval selects
        document.getElementById('crawl-interval').addEventListener('change', (e) => {
            this.settings.crawlInterval = parseInt(e.target.value);
        });
        
        document.getElementById('status-interval').addEventListener('change', (e) => {
            this.settings.statusInterval = parseInt(e.target.value);
        });
        
        // Save button
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveSettings();
            }
        });
    }
    
    async loadSettings() {
        try {
            const result = await chrome.storage.local.get([
                'openai_api_key',
                'enabled',
                'showIndicator',
                'autoScan',
                'notifications',
                'soundAlerts',
                'crawlInterval',
                'statusInterval'
            ]);
            
            this.settings = {
                openai_api_key: result.openai_api_key || '',
                enabled: result.enabled !== false,
                showIndicator: result.showIndicator !== false,
                autoScan: result.autoScan || false,
                notifications: result.notifications !== false,
                soundAlerts: result.soundAlerts || false,
                crawlInterval: result.crawlInterval || 300000, // 5 minutes
                statusInterval: result.statusInterval || 30000 // 30 seconds
            };
            
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.showStatusMessage('Failed to load settings', 'error');
        }
    }
    
    updateDisplay() {
        // Update API key input
        const apiKeyInput = document.getElementById('api-key-input');
        apiKeyInput.value = this.settings.openai_api_key;
        
        // Update toggle switches
        this.updateToggleDisplay();
        
        // Update interval selects
        document.getElementById('crawl-interval').value = this.settings.crawlInterval;
        document.getElementById('status-interval').value = this.settings.statusInterval;
        
        // Update API status
        this.updateAPIStatus();
    }
    
    updateToggleDisplay() {
        const toggles = {
            'enable-extension': this.settings.enabled,
            'show-indicator': this.settings.showIndicator,
            'auto-scan': this.settings.autoScan,
            'notifications': this.settings.notifications,
            'sound-alerts': this.settings.soundAlerts
        };
        
        Object.entries(toggles).forEach(([id, isActive]) => {
            const toggle = document.getElementById(id);
            if (toggle) {
                if (isActive) {
                    toggle.classList.add('active');
                } else {
                    toggle.classList.remove('active');
                }
            }
        });
    }
    
    updateToggleSettings() {
        const toggles = {
            'enable-extension': 'enabled',
            'show-indicator': 'showIndicator',
            'auto-scan': 'autoScan',
            'notifications': 'notifications',
            'sound-alerts': 'soundAlerts'
        };
        
        Object.entries(toggles).forEach(([id, settingKey]) => {
            const toggle = document.getElementById(id);
            if (toggle) {
                this.settings[settingKey] = toggle.classList.contains('active');
            }
        });
    }
    
    updateAPIStatus() {
        const statusIndicator = document.getElementById('api-status-indicator');
        const statusText = document.getElementById('api-status-text');
        
        if (this.settings.openai_api_key && this.settings.openai_api_key.startsWith('sk-')) {
            statusIndicator.className = 'status-indicator connected';
            statusText.textContent = 'Configured';
        } else {
            statusIndicator.className = 'status-indicator disconnected';
            statusText.textContent = 'Not Configured';
        }
    }
    
    async testAPIKey() {
        const apiKey = this.settings.openai_api_key.trim();
        
        if (!apiKey || !apiKey.startsWith('sk-')) {
            this.showStatusMessage('Please enter a valid API key first', 'error');
            return;
        }
        
        try {
            this.showStatusMessage('Testing API connection...', 'success');
            
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            if (response.ok) {
                this.showStatusMessage('✅ API connection successful!', 'success');
                this.updateAPIStatus();
            } else {
                const error = await response.json();
                this.showStatusMessage(`❌ API test failed: ${error.error?.message || 'Unknown error'}`, 'error');
            }
            
        } catch (error) {
            console.error('API test failed:', error);
            this.showStatusMessage('❌ API test failed: Network error', 'error');
        }
    }
    
    clearAPIKey() {
        this.settings.openai_api_key = '';
        document.getElementById('api-key-input').value = '';
        this.updateAPIStatus();
        this.showStatusMessage('API key cleared', 'success');
    }
    
    async saveSettings() {
        try {
            // Update toggle settings before saving
            this.updateToggleSettings();
            
            // Save to Chrome storage
            await chrome.storage.local.set(this.settings);
            
            // Notify background script about settings change
            chrome.runtime.sendMessage({
                action: 'settingsUpdated',
                settings: this.settings
            });
            
            this.showStatusMessage('✅ Settings saved successfully!', 'success');
            
            // Update any active components
            this.updateActiveComponents();
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showStatusMessage('❌ Failed to save settings', 'error');
        }
    }
    
    async updateActiveComponents() {
        try {
            // Update content scripts if they're active
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'settingsUpdated',
                    settings: this.settings
                }).catch(() => {
                    // Tab might not have content script loaded yet
                });
            }
        } catch (error) {
            console.error('Failed to update active components:', error);
        }
    }
    
    showStatusMessage(message, type) {
        const statusElement = document.getElementById('status-message');
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        statusElement.style.display = 'block';
        
        // Hide message after 4 seconds
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 4000);
    }
    
    // Method to get current settings
    getSettings() {
        return this.settings;
    }
    
    // Method to update a specific setting
    async updateSetting(key, value) {
        this.settings[key] = value;
        await this.saveSettings();
    }
    
    // Method to reset all settings to defaults
    async resetToDefaults() {
        this.settings = {
            openai_api_key: '',
            enabled: true,
            showIndicator: true,
            autoScan: false,
            notifications: true,
            soundAlerts: false,
            crawlInterval: 300000,
            statusInterval: 30000
        };
        
        await this.saveSettings();
        this.updateDisplay();
        this.showStatusMessage('Settings reset to defaults', 'success');
    }
}

// Initialize settings manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});

// Handle window focus to refresh settings
window.addEventListener('focus', () => {
    if (window.settingsManager) {
        window.settingsManager.loadSettings().then(() => {
            window.settingsManager.updateDisplay();
        });
    }
});
