// Drag and Resize Utility for Chrome Extension Popup
class DragResizeManager {
    constructor() {
        this.container = document.getElementById('popup-container');
        this.header = document.getElementById('popup-header');
        this.resizeHandles = document.querySelectorAll('.resize-handle');
        
        this.isDragging = false;
        this.isResizing = false;
        this.currentResizeHandle = null;
        
        this.dragOffset = { x: 0, y: 0 };
        this.initialSize = { width: 0, height: 0 };
        this.initialPosition = { x: 0, y: 0 };
        
        this.minWidth = 350;
        this.minHeight = 400;
        this.maxWidth = 800;
        this.maxHeight = 900;
        
        this.init();
    }
    
    init() {
        this.setupDragging();
        this.setupResizing();
        this.setupWindowControls();
        this.loadSavedState();
    }
    
    setupDragging() {
        this.header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('control-btn')) return;
            
            this.isDragging = true;
            this.container.style.transition = 'none';
            
            const rect = this.container.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            document.addEventListener('mousemove', this.handleDrag);
            document.addEventListener('mouseup', this.stopDrag);
            
            e.preventDefault();
        });
    }
    
    handleDrag = (e) => {
        if (!this.isDragging) return;
        
        const newX = e.clientX - this.dragOffset.x;
        const newY = e.clientY - this.dragOffset.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - this.container.offsetWidth;
        const maxY = window.innerHeight - this.container.offsetHeight;
        
        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));
        
        this.container.style.left = constrainedX + 'px';
        this.container.style.top = constrainedY + 'px';
        this.container.style.position = 'fixed';
        
        // Snap to edges
        this.snapToEdges(constrainedX, constrainedY);
    }
    
    stopDrag = () => {
        this.isDragging = false;
        this.container.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.stopDrag);
        
        this.saveState();
    }
    
    snapToEdges(x, y) {
        const snapThreshold = 20;
        const containerRect = this.container.getBoundingClientRect();
        
        // Snap to left edge
        if (x < snapThreshold) {
            this.container.style.left = '0px';
        }
        
        // Snap to right edge
        if (x > window.innerWidth - containerRect.width - snapThreshold) {
            this.container.style.left = (window.innerWidth - containerRect.width) + 'px';
        }
        
        // Snap to top edge
        if (y < snapThreshold) {
            this.container.style.top = '0px';
        }
        
        // Snap to bottom edge
        if (y > window.innerHeight - containerRect.height - snapThreshold) {
            this.container.style.top = (window.innerHeight - containerRect.height) + 'px';
        }
    }
    
    setupResizing() {
        this.resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                this.isResizing = true;
                this.currentResizeHandle = handle.dataset.direction;
                this.container.style.transition = 'none';
                
                const rect = this.container.getBoundingClientRect();
                this.initialSize.width = rect.width;
                this.initialSize.height = rect.height;
                this.initialPosition.x = rect.left;
                this.initialPosition.y = rect.top;
                
                document.addEventListener('mousemove', this.handleResize);
                document.addEventListener('mouseup', this.stopResize);
                
                e.preventDefault();
                e.stopPropagation();
            });
        });
    }
    
    handleResize = (e) => {
        if (!this.isResizing) return;
        
        const direction = this.currentResizeHandle;
        const rect = this.container.getBoundingClientRect();
        
        let newWidth = this.initialSize.width;
        let newHeight = this.initialSize.height;
        let newX = this.initialPosition.x;
        let newY = this.initialPosition.y;
        
        // Calculate new dimensions based on resize direction
        if (direction.includes('e')) {
            newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, 
                e.clientX - this.initialPosition.x));
        }
        
        if (direction.includes('w')) {
            const deltaX = e.clientX - this.initialPosition.x;
            newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, 
                this.initialSize.width - deltaX));
            if (newWidth > this.minWidth) {
                newX = e.clientX;
            }
        }
        
        if (direction.includes('s')) {
            newHeight = Math.max(this.minHeight, Math.min(this.maxHeight, 
                e.clientY - this.initialPosition.y));
        }
        
        if (direction.includes('n')) {
            const deltaY = e.clientY - this.initialPosition.y;
            newHeight = Math.max(this.minHeight, Math.min(this.maxHeight, 
                this.initialSize.height - deltaY));
            if (newHeight > this.minHeight) {
                newY = e.clientY;
            }
        }
        
        // Apply new dimensions and position
        this.container.style.width = newWidth + 'px';
        this.container.style.height = newHeight + 'px';
        this.container.style.left = newX + 'px';
        this.container.style.top = newY + 'px';
        this.container.style.position = 'fixed';
    }
    
    stopResize = () => {
        this.isResizing = false;
        this.currentResizeHandle = null;
        this.container.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        document.removeEventListener('mousemove', this.handleResize);
        document.removeEventListener('mouseup', this.stopResize);
        
        this.saveState();
    }
    
    setupWindowControls() {
        const minimizeBtn = document.getElementById('minimize-btn');
        const maximizeBtn = document.getElementById('maximize-btn');
        const closeBtn = document.getElementById('close-btn');
        
        minimizeBtn?.addEventListener('click', () => {
            this.minimize();
        });
        
        maximizeBtn?.addEventListener('click', () => {
            this.toggleMaximize();
        });
        
        closeBtn?.addEventListener('click', () => {
            this.close();
        });
    }
    
    minimize() {
        this.container.style.transform = 'scale(0.1)';
        this.container.style.opacity = '0';
        
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 300);
    }
    
    toggleMaximize() {
        const isMaximized = this.container.classList.contains('maximized');
        
        if (isMaximized) {
            this.restore();
        } else {
            this.maximize();
        }
    }
    
    maximize() {
        // Save current state before maximizing
        this.saveState();
        
        this.container.classList.add('maximized');
        this.container.style.width = '100vw';
        this.container.style.height = '100vh';
        this.container.style.left = '0px';
        this.container.style.top = '0px';
        this.container.style.borderRadius = '0px';
    }
    
    restore() {
        this.container.classList.remove('maximized');
        this.loadSavedState();
        this.container.style.borderRadius = '20px';
    }
    
    close() {
        this.container.style.transform = 'scale(0.8)';
        this.container.style.opacity = '0';
        
        setTimeout(() => {
            window.close();
        }, 200);
    }
    
    saveState() {
        if (this.container.classList.contains('maximized')) return;
        
        const rect = this.container.getBoundingClientRect();
        const state = {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top
        };
        
        chrome.storage.local.set({ popupState: state });
    }
    
    loadSavedState() {
        chrome.storage.local.get(['popupState'], (result) => {
            if (result.popupState) {
                const state = result.popupState;
                
                // Ensure the saved position is still within viewport
                const maxX = window.innerWidth - state.width;
                const maxY = window.innerHeight - state.height;
                
                const constrainedX = Math.max(0, Math.min(state.left, maxX));
                const constrainedY = Math.max(0, Math.min(state.top, maxY));
                
                this.container.style.width = state.width + 'px';
                this.container.style.height = state.height + 'px';
                this.container.style.left = constrainedX + 'px';
                this.container.style.top = constrainedY + 'px';
                this.container.style.position = 'fixed';
            }
        });
    }
    
    // Handle window resize
    handleWindowResize() {
        if (this.container.classList.contains('maximized')) {
            this.container.style.width = '100vw';
            this.container.style.height = '100vh';
            return;
        }
        
        // Ensure popup stays within new viewport bounds
        const rect = this.container.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        if (rect.left > maxX) {
            this.container.style.left = Math.max(0, maxX) + 'px';
        }
        
        if (rect.top > maxY) {
            this.container.style.top = Math.max(0, maxY) + 'px';
        }
    }
}

// Initialize drag and resize functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dragResizeManager = new DragResizeManager();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        dragResizeManager.handleWindowResize();
    });
    
    // Add smooth animations on load
    setTimeout(() => {
        document.querySelector('.popup-container').classList.add('fade-in');
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DragResizeManager;
}

