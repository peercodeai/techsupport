// AI Chat Handler with Real API Integration
class ChatHandler {
    constructor() {
        this.apiKey = null;
        this.isConnected = false;
        this.currentModel = 'gpt-4';
        this.maxTokens = 2000;
    }
    
    async sendMessage(message) {
        if (!this.apiKey) {
            throw new Error('No API key configured');
        }
        
        const systemPrompt = `You are an expert tech support AI assistant. Help users with technical issues, troubleshooting, and provide clear, actionable solutions. Be concise but thorough.`;
        
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ];
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.currentModel,
                    messages: messages,
                    max_tokens: this.maxTokens,
                    temperature: 0.7,
                    stream: false
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
            }
            
            const data = await response.json();
            const responseContent = data.choices[0]?.message?.content;
            
            if (!responseContent || responseContent.trim() === '') {
                throw new Error('Empty response from AI');
            }
            
            return responseContent;
            
        } catch (error) {
            console.error('AI API Error:', error);
            throw error;
        }
    }
}
