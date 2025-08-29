// URL Monitor with Real-time Documentation Crawling
class URLMonitor {
    constructor() {
        this.monitoredUrls = [];
        this.crawlingStatus = {};
        this.crawlInterval = null;
        this.isMonitoring = false;
        
        this.init();
    }
    
    async init() {
        await this.loadMonitoredUrls();
        this.setupEventListeners();
        this.startMonitoring();
    }
    
    setupEventListeners() {
        const addUrlBtn = document.getElementById('add-url-btn');
        const urlInput = document.getElementById('url-input');
        
        if (addUrlBtn) {
            addUrlBtn.addEventListener('click', () => this.addURL());
        }
        
        if (urlInput) {
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addURL();
                }
            });
        }
    }
    
    async addURL() {
        const urlInput = document.getElementById('url-input');
        const url = urlInput.value.trim();
        
        if (!url) return;
        
        if (!this.isValidURL(url)) {
            alert('Please enter a valid URL (e.g., https://example.com)');
            return;
        }
        
        if (this.monitoredUrls.some(u => u.url === url)) {
            alert('This URL is already being monitored');
            return;
        }
        
        const urlData = {
            id: this.generateId(),
            url: url,
            name: this.extractDomainName(url),
            status: 'pending',
            lastCrawled: null,
            lastChanged: null,
            changeCount: 0,
            content: '',
            contentType: 'unknown',
            errorCount: 0,
            addedAt: new Date().toISOString()
        };
        
        this.monitoredUrls.push(urlData);
        this.displayURL(urlData);
        this.saveMonitoredUrls();
        
        urlInput.value = '';
        
        // Start crawling immediately
        await this.crawlURL(urlData);
    }
    
    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    extractDomainName(url) {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch {
            return url;
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    displayURL(urlData) {
        const monitoredUrlsContainer = document.getElementById('monitored-urls');
        if (!monitoredUrlsContainer) return;
        
        const urlElement = document.createElement('div');
        urlElement.className = 'monitored-url';
        urlElement.id = `url-${urlData.id}`;
        
        urlElement.innerHTML = `
            <div class="url-info">
                <div class="url-status ${urlData.status}"></div>
                <div class="url-details">
                    <div class="url-name">${urlData.name}</div>
                    <div class="url-url">${urlData.url}</div>
                    <div class="url-meta">
                        <span class="last-crawled">Last: ${urlData.lastCrawled ? new Date(urlData.lastCrawled).toLocaleString() : 'Never'}</span>
                        <span class="change-count">Changes: ${urlData.changeCount}</span>
                    </div>
                </div>
            </div>
            <div class="url-actions">
                <button class="url-action-btn crawl-btn" title="Crawl Now" data-url-id="${urlData.id}">🔄</button>
                <button class="url-action-btn view-btn" title="View Content" data-url-id="${urlData.id}">👁️</button>
                <button class="url-action-btn remove-btn" title="Remove" data-url-id="${urlData.id}">🗑️</button>
            </div>
        `;
        
        // Add event listeners
        urlElement.querySelector('.crawl-btn').addEventListener('click', () => this.crawlURL(urlData));
        urlElement.querySelector('.view-btn').addEventListener('click', () => this.viewContent(urlData));
        urlElement.querySelector('.remove-btn').addEventListener('click', () => this.removeURL(urlData.id));
        
        monitoredUrlsContainer.appendChild(urlElement);
    }
    
    async crawlURL(urlData) {
        if (this.crawlingStatus[urlData.id]) return; // Already crawling
        
        this.crawlingStatus[urlData.id] = true;
        this.updateURLStatus(urlData.id, 'crawling');
        
        try {
            // Use background script to avoid CORS issues
            const response = await chrome.runtime.sendMessage({
                action: 'crawlURL',
                url: urlData.url
            });
            
            if (response.success) {
                const newContent = response.content;
                const contentType = response.contentType;
                
                // Check if content has changed
                if (urlData.content !== newContent) {
                    urlData.changeCount++;
                    urlData.lastChanged = new Date().toISOString();
                    
                    // Analyze changes with AI if available
                    if (window.chatHandler && window.chatHandler.isConnected) {
                        await this.analyzeContentChanges(urlData, newContent, contentType);
                    }
                }
                
                urlData.content = newContent;
                urlData.contentType = contentType;
                urlData.status = 'online';
                urlData.errorCount = 0;
                
            } else {
                urlData.status = 'error';
                urlData.errorCount++;
                console.error('Crawl failed:', response.error);
            }
            
        } catch (error) {
            console.error('Crawl error:', error);
            urlData.status = 'error';
            urlData.errorCount++;
        }
        
        urlData.lastCrawled = new Date().toISOString();
        this.updateURLStatus(urlData.id, urlData.status);
        this.crawlingStatus[urlData.id] = false;
        
        // Save updated data
        this.saveMonitoredUrls();
    }
    
    async analyzeContentChanges(urlData, newContent, contentType) {
        try {
            const analysis = await window.chatHandler.analyzeTechnicalContent(
                `URL: ${urlData.url}\nContent Type: ${contentType}\nContent: ${newContent.substring(0, 2000)}...`,
                'documentation_change'
            );
            
            // Add analysis to chat
            window.chatHandler.addMessage('assistant', 
                `📄 **Documentation Update Detected**\n\n` +
                `**URL:** ${urlData.url}\n` +
                `**Content Type:** ${contentType}\n\n` +
                analysis
            );
            
        } catch (error) {
            console.error('Content analysis failed:', error);
        }
    }
    
    async analyzeContent(urlData) {
        if (!window.chatHandler) {
            alert('AI chat not available. Please try again.');
            return;
        }
        
        try {
            const analysis = await window.chatHandler.analyzeTechnicalContent(
                urlData.content,
                urlData.contentType
            );
            
            // Add analysis to chat
            window.chatHandler.addMessage('assistant', 
                `🔍 **Content Analysis: ${urlData.name}**\n\n` +
                `**URL:** ${urlData.url}\n\n` +
                analysis
            );
            
            // Close modal
            document.querySelector('.content-modal').remove();
            
        } catch (error) {
            console.error('Content analysis failed:', error);
            alert('Failed to analyze content. Please try again.');
        }
    }
    
    updateURLStatus(urlId, status) {
        const urlElement = document.getElementById(`url-${urlId}`);
        if (!urlElement) return;
        
        const statusIndicator = urlElement.querySelector('.url-status');
        if (statusIndicator) {
            statusIndicator.className = `url-status ${status}`;
        }
        
        // Update the URL data
        const urlData = this.monitoredUrls.find(u => u.id === urlId);
        if (urlData) {
            urlData.status = status;
        }
    }
    
    async viewContent(urlData) {
        if (!urlData.content) {
            alert('No content available. Try crawling the URL first.');
            return;
        }
        
        // Create a modal to display content
        const modal = document.createElement('div');
        modal.className = 'content-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${urlData.name} - Content</h3>
                    <button class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="content-info">
                        <p><strong>URL:</strong> ${urlData.url}</p>
                        <p><strong>Content Type:</strong> ${urlData.contentType}</p>
                        <p><strong>Last Crawled:</strong> ${new Date(urlData.lastCrawled).toLocaleString()}</p>
                        <p><strong>Changes Detected:</strong> ${urlData.changeCount}</p>
                    </div>
                    <div class="content-preview">
                        <h4>Content Preview:</h4>
                        <div class="content-text">${this.formatContent(urlData.content)}</div>
                    </div>
                    <div class="content-actions">
                        <button class="analyze-btn">Analyze with AI</button>
                        <button class="copy-btn">Copy Content</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.analyze-btn').addEventListener('click', () => this.analyzeContent(urlData));
        modal.querySelector('.copy-btn').addEventListener('click', () => this.copyContent(urlData.content));
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    formatContent(content) {
        if (content.length > 1000) {
            return content.substring(0, 1000) + '...\n\n[Content truncated - use "Analyze with AI" for full analysis]';
        }
        return content;
    }
    
    async analyzeContent(urlData) {
        if (!window.chatHandler || !window.chatHandler.isConnected) {
            alert('AI chat not available. Please configure your API key first.');
            return;
        }
        
        try {
            const analysis = await window.chatHandler.analyzeTechnicalContent(
                urlData.content,
                urlData.contentType
            );
            
            // Add analysis to chat
            window.chatHandler.addMessage('assistant', 
                `🔍 **Content Analysis: ${urlData.name}**\n\n` +
                `**URL:** ${urlData.url}\n\n` +
                analysis
            );
            
            // Close modal
            document.querySelector('.content-modal').remove();
            
        } catch (error) {
            console.error('Content analysis failed:', error);
            alert('Failed to analyze content. Please try again.');
        }
    }
    
    copyContent(content) {
        navigator.clipboard.writeText(content).then(() => {
            alert('Content copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy content. Please select and copy manually.');
        });
    }
    
    removeURL(urlId) {
        if (confirm('Are you sure you want to remove this URL from monitoring?')) {
            this.monitoredUrls = this.monitoredUrls.filter(u => u.id !== urlId);
            this.saveMonitoredUrls();
            
            const urlElement = document.getElementById(`url-${urlId}`);
            if (urlElement) {
                urlElement.remove();
            }
        }
    }
    
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // Crawl all URLs every 5 minutes
        this.crawlInterval = setInterval(() => {
            this.monitoredUrls.forEach(urlData => {
                this.crawlURL(urlData);
            });
        }, 5 * 60 * 1000); // 5 minutes
        
        console.log('URL monitoring started');
    }
    
    stopMonitoring() {
        if (this.crawlInterval) {
            clearInterval(this.crawlInterval);
            this.crawlInterval = null;
        }
        this.isMonitoring = false;
        console.log('URL monitoring stopped');
    }
    
    async loadMonitoredUrls() {
        try {
            const result = await chrome.storage.local.get(['monitoredUrls']);
            if (result.monitoredUrls) {
                this.monitoredUrls = result.monitoredUrls;
                this.monitoredUrls.forEach(urlData => this.displayURL(urlData));
            }
        } catch (error) {
            console.error('Failed to load monitored URLs:', error);
        }
    }
    
    async saveMonitoredUrls() {
        try {
            await chrome.storage.local.set({ monitoredUrls: this.monitoredUrls });
        } catch (error) {
            console.error('Failed to save monitored URLs:', error);
        }
    }
    
    // Method to get all monitored URLs for external use
    getMonitoredUrls() {
        return this.monitoredUrls;
    }
    
    // Method to check if a specific URL is being monitored
    isURLMonitored(url) {
        return this.monitoredUrls.some(u => u.url === url);
    }
    
    // Method to get crawling statistics
    getCrawlingStats() {
        const total = this.monitoredUrls.length;
        const online = this.monitoredUrls.filter(u => u.status === 'online').length;
        const error = this.monitoredUrls.filter(u => u.status === 'error').length;
        const pending = this.monitoredUrls.filter(u => u.status === 'pending').length;
        
        return { total, online, error, pending };
    }
}
