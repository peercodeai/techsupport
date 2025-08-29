// Simple File Handler
class FileHandler {
    constructor() {
        this.uploadedFiles = [];
        this.init();
    }
    
    async init() {
        await this.loadUploadedFiles();
    }
    
    async loadUploadedFiles() {
        try {
            const result = await chrome.storage.local.get(['uploadedFiles']);
            if (result.uploadedFiles) {
                this.uploadedFiles = result.uploadedFiles;
            }
        } catch (error) {
            console.error('Failed to load uploaded files:', error);
        }
    }
    
    async saveUploadedFiles() {
        try {
            await chrome.storage.local.set({ uploadedFiles: this.uploadedFiles });
        } catch (error) {
            console.error('Failed to save uploaded files:', error);
        }
    }
    
    addFile(fileData) {
        this.uploadedFiles.push(fileData);
        this.saveUploadedFiles();
    }
    
    removeFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
        this.saveUploadedFiles();
    }
    
    getFiles() {
        return this.uploadedFiles;
    }
}
