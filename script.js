// Transition Progress Tracker - JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTracker();
});

function initializeTracker() {
    // Load saved state from localStorage
    loadState();
    
    // Initialize event listeners
    initializeCheckboxes();
    initializeButtons();
    
    // Update all counts and progress
    updateAllProgress();
}

// Initialize checkbox event listeners
function initializeCheckboxes() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(this);
        });
    });
}

// Initialize button event listeners
function initializeButtons() {
    const resetBtn = document.getElementById('resetBtn');
    const printBtn = document.getElementById('printBtn');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllTasks);
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', printChecklist);
    }
}

// Handle checkbox state change
function handleCheckboxChange(checkbox) {
    // Add visual feedback
    const taskItem = checkbox.closest('.task-item');
    if (taskItem) {
        taskItem.style.transform = 'scale(0.98)';
        setTimeout(() => {
            taskItem.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Update progress displays
    updateAllProgress();
    
    // Save state to localStorage
    saveState();
    
    // Celebrate if section is complete
    const section = checkbox.closest('.checklist-section');
    if (section && isSectionComplete(section)) {
        celebrateCompletion(section);
    }
}

// Update all progress indicators
function updateAllProgress() {
    updateOverallProgress();
    updateSectionProgress();
}

// Update overall progress cards
function updateOverallProgress() {
    const allCheckboxes = document.querySelectorAll('.task-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
    
    const total = allCheckboxes.length;
    const completed = checkedCheckboxes.length;
    const remaining = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Update DOM elements directly without animation
    const completedCount = document.getElementById('completedCount');
    const remainingCount = document.getElementById('remainingCount');
    const progressPercent = document.getElementById('progressPercent');
    
    if (completedCount) {
        completedCount.textContent = completed;
    }
    
    if (remainingCount) {
        remainingCount.textContent = remaining;
    }
    
    if (progressPercent) {
        progressPercent.textContent = percentage + '%';
    }
}

// Update individual section progress
function updateSectionProgress() {
    const sections = document.querySelectorAll('.checklist-section');
    
    sections.forEach(section => {
        const checkboxes = section.querySelectorAll('.task-checkbox');
        const checkedCheckboxes = section.querySelectorAll('.task-checkbox:checked');
        
        const total = checkboxes.length;
        const completed = checkedCheckboxes.length;
        
        const progressElement = section.querySelector('.section-progress');
        if (progressElement) {
            progressElement.textContent = `${completed}/${total}`;
            
            // Add complete class if all tasks are done
            if (completed === total && total > 0) {
                progressElement.classList.add('complete');
            } else {
                progressElement.classList.remove('complete');
            }
        }
    });
}

// Check if a section is complete
function isSectionComplete(section) {
    const checkboxes = section.querySelectorAll('.task-checkbox');
    const checkedCheckboxes = section.querySelectorAll('.task-checkbox:checked');
    
    return checkboxes.length > 0 && checkboxes.length === checkedCheckboxes.length;
}

// Celebrate section completion
function celebrateCompletion(section) {
    const sectionHeader = section.querySelector('.section-header');
    if (sectionHeader) {
        // Add celebration animation
        sectionHeader.style.animation = 'none';
        setTimeout(() => {
            sectionHeader.style.animation = 'pulse 0.5s ease';
        }, 10);
    }
}

// Save state to localStorage
function saveState() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const state = {};
    
    checkboxes.forEach((checkbox, index) => {
        state[`task-${index}`] = checkbox.checked;
    });
    
    try {
        localStorage.setItem('transitionTrackerState', JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

// Load state from localStorage
function loadState() {
    try {
        const savedState = localStorage.getItem('transitionTrackerState');
        if (savedState) {
            const state = JSON.parse(savedState);
            const checkboxes = document.querySelectorAll('.task-checkbox');
            
            checkboxes.forEach((checkbox, index) => {
                const key = `task-${index}`;
                if (state[key] !== undefined) {
                    checkbox.checked = state[key];
                }
            });
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
}

// Reset all tasks
function resetAllTasks() {
    // Confirm with user
    const confirmed = confirm('Are you sure you want to reset all tasks? This action cannot be undone.');
    
    if (!confirmed) {
        return;
    }
    
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Update all progress
    updateAllProgress();
    
    // Clear localStorage
    try {
        localStorage.removeItem('transitionTrackerState');
    } catch (e) {
        console.error('Failed to clear state:', e);
    }
    
    // Show feedback
    showNotification('All tasks have been reset');
}

// Print checklist
function printChecklist() {
    window.print();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #8B6F47;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add custom animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);