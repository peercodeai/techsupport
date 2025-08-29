// Modern Chat Bubble Tech Support Assistant
class ChatBubbleAssistant {
    constructor() {
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.chatHandler = null;
        this.isGPTConnected = false;
        this.apiKey = null;
        this.docUrl = null;
        this.isDocConnected = false;
        this.isCrawling = false;
        this.messageHistory = []; // Store message history for up arrow
        this.historyIndex = -1; // Current position in history
        this.currentInput = ''; // Store current input when navigating history
        
        this.init();
    }
    
    async init() {
        try {
            await this.initializeComponents();
            this.setupEventListeners();
            this.setupDraggable();
            this.checkGPTConnection();
            this.clearOldMessages();
            console.log('Chat Bubble Assistant initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Chat Bubble Assistant:', error);
        }
    }
    
    async initializeComponents() {
        try {
            // Initialize chat functionality with AI
            this.chatHandler = new ChatHandler();
            
            // Make chatHandler globally available
            window.chatHandler = this.chatHandler;
            
            // Load existing API key and doc URL
            await this.loadStoredData();
            
        } catch (error) {
            console.error('Failed to initialize components:', error);
        }
    }
    
    async loadStoredData() {
        try {
            const result = await chrome.storage.local.get(['openai_api_key', 'doc_url']);
            if (result.openai_api_key) {
                this.apiKey = result.openai_api_key;
                this.chatHandler.apiKey = this.apiKey;
                await this.testGPTConnection();
            }
            if (result.doc_url) {
                this.docUrl = result.doc_url;
                this.isDocConnected = true;
                this.updateDocStatus();
            }
        } catch (error) {
            console.error('Failed to load stored data:', error);
        }
    }
    
    async testGPTConnection() {
        if (!this.apiKey) return false;
        
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            
            if (response.ok) {
                this.isGPTConnected = true;
                this.updateBrainIndicator();
                return true;
            } else {
                this.isGPTConnected = false;
                this.updateBrainIndicator();
                return false;
            }
        } catch (error) {
            this.isGPTConnected = false;
            this.updateBrainIndicator();
            return false;
        }
    }
    
    updateBrainIndicator() {
        const statusLight = document.getElementById('status-light');
        if (!statusLight) return;
        
        if (this.isGPTConnected) {
            statusLight.className = 'status-indicator brain-connected';
            statusLight.title = 'Connected to GPT - AI Ready!';
        } else {
            statusLight.className = 'status-indicator disconnected';
            statusLight.title = 'Not connected to GPT';
        }
    }
    
    updateDocStatus() {
        const docStatusLight = document.getElementById('doc-status-light');
        if (!docStatusLight) return;
        
        if (this.isCrawling) {
            docStatusLight.className = 'status-indicator doc-status crawling';
            docStatusLight.title = 'Crawling documentation...';
        } else if (this.isDocConnected) {
            docStatusLight.className = 'status-indicator doc-status connected';
            docStatusLight.title = `Connected to: ${this.docUrl}`;
        } else {
            docStatusLight.className = 'status-indicator doc-status';
            docStatusLight.title = 'No documentation connected';
        }
    }
    
    setupEventListeners() {
        // Chat input events
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
            
            // Add up/down arrow history navigation
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateHistoryUp();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateHistoryDown();
                }
            });
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        // Status update events
        document.addEventListener('statusUpdate', (e) => {
            this.updateStatusLight(e.detail);
        });
    }
    
    // Navigate up in message history (like VS Code)
    navigateHistoryUp() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;
        
        // If this is the first time pressing up, save current input
        if (this.historyIndex === -1) {
            this.currentInput = chatInput.value;
        }
        
        // Navigate to previous message
        if (this.historyIndex < this.messageHistory.length - 1) {
            this.historyIndex++;
            chatInput.value = this.messageHistory[this.messageHistory.length - 1 - this.historyIndex];
        }
        
        // Place cursor at end
        chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
    }
    
    // Navigate down in message history
    navigateHistoryDown() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;
        
        if (this.historyIndex > 0) {
            this.historyIndex--;
            chatInput.value = this.messageHistory[this.messageHistory.length - 1 - this.historyIndex];
        } else if (this.historyIndex === 0) {
            this.historyIndex = -1;
            chatInput.value = this.currentInput; // Restore original input
        }
        
        // Place cursor at end
        chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
    }
    
    // Add message to history for up arrow navigation
    addToHistory(message) {
        // Only add non-empty messages
        if (message && message.trim()) {
            this.messageHistory.push(message.trim());
            // Keep only last 50 messages
            if (this.messageHistory.length > 50) {
                this.messageHistory = this.messageHistory.slice(-50);
            }
        }
        // Reset history index
        this.historyIndex = -1;
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
        
        // Add visual feedback
        dragHandle.style.cursor = 'grab';
        dragHandle.title = 'Drag to move (Click and drag)';
    }
    
    startDragging(e, container) {
        this.isDragging = true;
        
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        this.dragOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
        
        container.style.transition = 'none';
        container.style.cursor = 'grabbing';
    }
    
    drag(e, container) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
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
            container.style.cursor = 'move';
        }
    }
    
    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput?.value?.trim();
        
        if (!message) return;
        
        // Clear input immediately after getting the message
        if (chatInput) {
            chatInput.value = '';
        }
        
        try {
            // Check if this is an API key input
            if (this.isAPIKeyInput(message)) {
                await this.handleAPIKeyInput(message);
                return;
            }
            
            // Check if this is a documentation URL
            if (this.isDocumentationURL(message)) {
                await this.handleDocumentationURL(message);
                return;
            }
            
            // Check if GPT is connected
            if (!this.isGPTConnected) {
                this.addMessageToChat('assistant', '🤖 I need your OpenAI API key to help you! Just paste it in the chat (it starts with "sk-") and I\'ll store it securely.');
                return;
            }
            
            // Add user message to chat
            this.addMessageToChat('user', message);
            
            // Add to history for up arrow navigation
            this.addToHistory(message);
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Send to AI via chat handler
            if (this.chatHandler && this.chatHandler.apiKey) {
                try {
                    // If we have documentation connected, include it in the context
                    let enhancedMessage = message;
                    if (this.isDocConnected && this.docUrl) {
                        enhancedMessage = `Context: You have access to documentation at ${this.docUrl}\n\nUser Question: ${message}\n\nPlease use the available documentation to provide the most accurate and up-to-date help.`;
                    }
                    
                    const response = await this.chatHandler.sendMessage(enhancedMessage);
                    this.addMessageToChat('assistant', response);
                } catch (error) {
                    console.error('Chat handler error:', error);
                    this.addMessageToChat('assistant', 'Sorry, I\'m having trouble processing your request. Please try again.');
                }
            } else {
                this.addMessageToChat('assistant', 'Sorry, I\'m having trouble connecting to the AI service.');
            }
            
        } catch (error) {
            console.error('Failed to send message:', error);
            this.addMessageToChat('assistant', 'Sorry, something went wrong. Please try again.');
        }
        
        // Hide typing indicator
        this.hideTypingIndicator();
    }
    
    isAPIKeyInput(message) {
        // Check if message looks like an OpenAI API key
        return message.startsWith('sk-') && message.length > 20;
    }
    
    isDocumentationURL(message) {
        // Check if message looks like a URL
        try {
            const url = new URL(message);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    }
    
    async handleAPIKeyInput(apiKey) {
        try {
            // Test the API key first
            const isValid = await this.testAPIKey(apiKey);
            
            if (isValid) {
                // Store the API key
                await chrome.storage.local.set({ openai_api_key: apiKey });
                this.apiKey = apiKey;
                this.chatHandler.apiKey = apiKey;
                
                // Update connection status
                this.isGPTConnected = true;
                this.updateBrainIndicator();
                
                // Add success message
                this.addMessageToChat('assistant', '✅ API key stored successfully! I\'m now connected to GPT and ready to help you with any technical questions.');
                
                // Show a helpful tip
                this.addMessageToChat('assistant', '💡 You can now ask me anything - troubleshooting, error help, setup guides, or any tech questions!');
                
            } else {
                this.addMessageToChat('assistant', '❌ Invalid API key. Please check your OpenAI API key and try again. It should start with "sk-" and be about 51 characters long.');
            }
            
        } catch (error) {
            console.error('Failed to handle API key:', error);
            this.addMessageToChat('assistant', '❌ Failed to validate API key. Please check your internet connection and try again.');
        }
    }
    
    async handleDocumentationURL(url) {
        try {
            this.addMessageToChat('assistant', '📚 Connecting to documentation... This may take a moment.');
            
            // Set crawling status
            this.isCrawling = true;
            this.updateDocStatus();
            
            // Store the URL
            await chrome.storage.local.set({ doc_url: url });
            this.docUrl = url;
            
            // Test the connection by crawling a small sample
            const isAccessible = await this.testDocumentationAccess(url);
            
            if (isAccessible) {
                this.isDocConnected = true;
                this.isCrawling = false;
                this.updateDocStatus();
                
                // Create clickable hyperlink
                const clickableUrl = `<a href="${url}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${url}</a>`;
                
                this.addMessageToChat('assistant', `✅ Documentation connected successfully! I can now access and search through: ${clickableUrl}`);
                this.addMessageToChat('assistant', '🔍 You can now ask me questions and I\'ll search the documentation for the most accurate and up-to-date help.');
                this.addMessageToChat('assistant', '💡 Click the link above to open the documentation in a new tab!');
            } else {
                this.isDocConnected = false;
                this.isCrawling = false;
                this.updateDocStatus();
                
                // Even if we can't fully connect, if we detected content, show a helpful message
                const clickableUrl = `<a href="${url}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${url}</a>`;
                
                this.addMessageToChat('assistant', `⚠️ Limited documentation access. I can see some content but may not be able to search it fully.`);
                this.addMessageToChat('assistant', `🔗 You can still access the documentation directly: ${clickableUrl}`);
                this.addMessageToChat('assistant', '💡 Try asking specific questions about what you see in the documentation!');
            }
            
        } catch (error) {
            console.error('Failed to handle documentation URL:', error);
            this.isCrawling = false;
            this.updateDocStatus();
            
            // Even on error, provide the clickable link
            const clickableUrl = `<a href="${url}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${url}</a>`;
            
            this.addMessageToChat('assistant', '❌ Failed to connect to documentation, but you can still access it directly.');
            this.addMessageToChat('assistant', `🔗 Documentation link: ${clickableUrl}`);
        }
    }
    
    async testDocumentationAccess(url) {
        try {
            console.log('Testing documentation access for URL:', url);
            
            // Send a message to the background script to test URL accessibility
            const response = await chrome.runtime.sendMessage({
                action: 'testDocumentationAccess',
                url: url
            });
            
            console.log('Background script response:', response);
            
            if (!response) {
                console.error('No response from background script');
                return false;
            }
            
            if (response.success && response.accessible) {
                console.log('Documentation access successful:', response);
                return true;
            } else {
                console.error('Documentation access failed:', response.error || 'Unknown error');
                return false;
            }
            
        } catch (error) {
            console.error('Documentation access test failed with error:', error);
            return false;
        }
    }
    
    async testAPIKey(apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    async checkGPTConnection() {
        if (this.apiKey) {
            await this.testGPTConnection();
        }
    }
    
    addMessageToChat(sender, content) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-timestamp">${timestamp}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    updateStatusLight(statusData) {
        const statusLight = document.getElementById('status-light');
        if (!statusLight) return;
        
        // Simple status logic
        if (statusData?.network?.status === 'online' && statusData?.errors?.count === 0) {
            statusLight.className = 'status-indicator connected';
        } else if (statusData?.network?.status === 'error' || statusData?.errors?.count > 0) {
            statusLight.className = 'status-indicator disconnected';
        } else {
            statusLight.className = 'status-indicator testing';
        }
    }
    
    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <strong>${title}</strong><br>
            ${message}
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    clearOldMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
    }
}

// Initialize the chat bubble when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatBubbleAssistant = new ChatBubbleAssistant();
});

// Add typing indicator styles
const style = document.createElement('style');
style.textContent = `
    .typing-indicator .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .typing-indicator .typing-dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #94a3b8;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-indicator .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);


