// Simple Status Monitor
class StatusMonitor {
    constructor() {
        this.isMonitoring = false;
        this.errorCount = 0;
    }
    
    async start() {
        this.isMonitoring = true;
        await this.checkStatus();
    }
    
    stop() {
        this.isMonitoring = false;
    }
    
    async checkStatus() {
        if (!this.isMonitoring) return;
        
        try {
            // Simple network check
            const response = await fetch('https://httpstat.us/200', { 
                method: 'HEAD',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                this.errorCount = 0;
            } else {
                this.errorCount++;
            }
            
        } catch (error) {
            this.errorCount++;
            console.error('Status check failed:', error);
        }
    }
    
    async incrementErrorCount() {
        this.errorCount++;
    }
    
    getStatus() {
        return {
            errors: this.errorCount,
            performance: this.errorCount === 0 ? 'Good' : 'Warning'
        };
    }
}
