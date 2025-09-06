// Enhanced Tech Support Assistant - Popup Script v2.1
console.log('Popup script loaded');

class PopupManager {
    constructor() {
        this.apiKey = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.messageHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }
    
    async init() {
        try {
            console.log('Initializing popup manager...');
            
            // Load stored data
            await this.loadStoredData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Update status indicators
            this.updateStatusIndicators();
            
            console.log('Popup manager initialized successfully');
            console.log('API Key status:', this.apiKey ? 'Loaded' : 'Not found');
        } catch (error) {
            console.error('Failed to initialize popup manager:', error);
        }
    }
    
    async loadStoredData() {
        try {
            const result = await chrome.storage.local.get([
                'openai_api_key', 
                'popup_message_history'
            ]);
            
            this.apiKey = result.openai_api_key || null;
            this.messageHistory = result.popup_message_history || [];
            
            console.log('Loaded API key:', this.apiKey ? 'Present' : 'Not found');
            console.log('Storage result:', result);
        } catch (error) {
            console.error('Failed to load stored data:', error);
        }
    }
    
    async saveData() {
        try {
            await chrome.storage.local.set({
                popup_message_history: this.messageHistory
            });
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    }
    
    setupEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const settingsBtn = document.getElementById('settings-btn');
        
        // Chat functionality
        if (chatInput) {
            console.log('Setting up chat input event listeners');
            
            chatInput.addEventListener('keypress', (e) => {
                console.log('Key pressed:', e.key);
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
            
            chatInput.addEventListener('input', (e) => {
                console.log('Input changed:', e.target.value);
            });
            
            chatInput.addEventListener('focus', () => {
                console.log('Input focused');
            });
        } else {
            console.error('Chat input element not found!');
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        // Settings button
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                chrome.runtime.openOptionsPage();
            });
        }
        
        // Add a refresh button for debugging
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '🔄';
        refreshBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
        `;
        refreshBtn.addEventListener('click', () => {
            console.log('Refreshing popup...');
            this.loadStoredData().then(() => {
                this.updateStatusIndicators();
                console.log('Popup refreshed');
            });
        });
        
        const header = document.querySelector('.chat-bubble-header');
        if (header) {
            header.appendChild(refreshBtn);
        }
        
        // Setup draggable functionality (limited in popup context)
        this.setupDraggable();
        
        // Listen for messages from background/content scripts
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            switch (message.type) {
                case 'UPDATE_API_KEY':
                    this.apiKey = message.apiKey;
                    this.updateStatusIndicators();
                    break;
            }
        });
    }
    
    setupDraggable() {
        const dragHandle = document.getElementById('drag-handle');
        const container = document.querySelector('.chat-bubble-container');
        
        if (!dragHandle || !container) {
            console.log('Drag elements not found, dragging disabled');
            return;
        }
        
        // Check if we're in a popup context (can't drag popups)
        if (window.chrome && chrome.extension && chrome.extension.getViews) {
            console.log('Popup context detected - dragging may be limited');
            // Add visual indicator that this is a popup
            dragHandle.title = 'Popup Mode - Dragging Limited';
            return;
        }
        
        console.log('Setting up draggable functionality');
        
        dragHandle.addEventListener('mousedown', (e) => {
            this.startDragging(e, container);
        });
        
        document.addEventListener('mousemove', (e) => {
            this.drag(e, container);
        });
        
        document.addEventListener('mouseup', () => {
            this.stopDragging();
        });
        
        // Touch events for mobile
        dragHandle.addEventListener('touchstart', (e) => {
            this.startDragging(e, container);
        });
        
        document.addEventListener('touchmove', (e) => {
            this.drag(e, container);
        });
        
        document.addEventListener('touchend', () => {
            this.stopDragging();
        });
    }
    
    startDragging(e, container) {
        this.isDragging = true;
        const rect = container.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        this.dragOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
        
        container.style.transition = 'none';
        e.preventDefault();
    }
    
    drag(e, container) {
        if (!this.isDragging) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const newX = clientX - this.dragOffset.x;
        const newY = clientY - this.dragOffset.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - container.offsetWidth;
        const maxY = window.innerHeight - container.offsetHeight;
        
        const boundedX = Math.max(0, Math.min(newX, maxX));
        const boundedY = Math.max(0, Math.min(newY, maxY));
        
        container.style.left = `${boundedX}px`;
        container.style.top = `${boundedY}px`;
    }
    
    stopDragging() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const container = document.querySelector('.chat-bubble-container');
        if (container) {
            container.style.transition = 'all 0.3s ease';
        }
    }
    
    updateStatusIndicators() {
        const statusLight = document.getElementById('status-light');
        const docStatusLight = document.getElementById('doc-status-light');
        
        if (statusLight) {
            if (this.apiKey) {
                statusLight.classList.add('connected');
                statusLight.classList.remove('error');
                statusLight.title = 'AI Connected';
            } else {
                statusLight.classList.remove('connected');
                statusLight.classList.add('error');
                statusLight.title = 'AI Not Connected - Set API Key';
            }
        }
        
        if (docStatusLight) {
            docStatusLight.classList.add('connected');
            docStatusLight.title = 'Documentation Access Ready';
        }
    }
    
    addMessage(type, content) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        // Remove welcome message if it exists
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add to history
        this.messageHistory.push({ type, content, timestamp: Date.now() });
        
        // Keep only last 50 messages
        if (this.messageHistory.length > 50) {
            this.messageHistory = this.messageHistory.slice(-50);
        }
        
        this.saveData();
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Clear input
        chatInput.value = '';
        
        // Add user message
        this.addMessage('user', message);
        
        // Check if API key is available
        if (!this.apiKey) {
            this.addMessage('assistant', '🤖 I need your OpenAI API key to help you! Please set it up in the extension options (right-click extension icon → Options).');
            return;
        }
        
        // Check if the message looks like an API key
        if (message.startsWith('sk-') && message.length > 20) {
            this.addMessage('assistant', '🔑 I see you\'ve provided an API key! Please set it up in the extension options (right-click extension icon → Options) rather than in the chat. This keeps your key secure.');
            return;
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send to OpenAI
            const response = await this.callOpenAI(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add assistant response
            this.addMessage('assistant', response);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('assistant', `❌ Error: ${error.message}`);
        }
    }
    
    async callOpenAI(message) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful tech support assistant. Help users troubleshoot technical issues, explain errors, and provide solutions.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PopupManager();
    });
} else {
    new PopupManager();
}