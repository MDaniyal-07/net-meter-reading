// Electricity Meter Tracker JavaScript
class ElectricityMeterTracker {
    constructor() {
        this.currentReadings = {
            peakImport: 0,
            peakExport: 0,
            offPeakImport: 0,
            offPeakExport: 0
        };
        
        this.previousReadings = {
            peakImport: 0,
            peakExport: 0,
            offPeakImport: 0,
            offPeakExport: 0
        };
        
        this.historicalData = [];
        this.isAuthenticated = false;
        this.password = 'daniyal4768';
        this.jsonDatabase = null;
        this.init();
    }
    
    init() {
        this.loadData();
        this.loadFromJSONDatabase(); // Load from JSON database first
        this.setupEventListeners();
        this.updateCurrentDate();
        this.updatePreviousReadingsDisplay();
        this.calculateUsage();
        this.updateAuthenticationUI();
        
        // Update date every minute
        setInterval(() => this.updateCurrentDate(), 60000);
    }
    
    setupEventListeners() {
        // Input field listeners for real-time calculation
        const inputFields = [
            'currentPeakImport',
            'currentPeakExport', 
            'currentOffPeakImport',
            'currentOffPeakExport'
        ];
        
        inputFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            element.addEventListener('input', () => {
                this.updateCurrentReadings();
                this.calculateUsage();
            });
        });
        
        // Button listeners
        document.getElementById('saveButton').addEventListener('click', () => this.saveReadings());
        document.getElementById('updatePreviousButton').addEventListener('click', () => this.updatePreviousReadings());
        document.getElementById('downloadButton').addEventListener('click', () => this.downloadJSONFile());
        document.getElementById('clearButton').addEventListener('click', () => this.clearAllData());
        document.getElementById('historyFilter').addEventListener('change', () => this.updateHistoryTable());
        
        // Authentication listeners
        document.getElementById('passwordSubmit').addEventListener('click', () => this.checkPassword());
        document.getElementById('passwordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkPassword();
        });
    }
    
    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    }
    
    updateCurrentReadings() {
        this.currentReadings.peakImport = parseFloat(document.getElementById('currentPeakImport').value) || 0;
        this.currentReadings.peakExport = parseFloat(document.getElementById('currentPeakExport').value) || 0;
        this.currentReadings.offPeakImport = parseFloat(document.getElementById('currentOffPeakImport').value) || 0;
        this.currentReadings.offPeakExport = parseFloat(document.getElementById('currentOffPeakExport').value) || 0;
    }
    
    calculateUsage() {
        // Calculate individual usage values (current - previous)
        const totalImportPeak = this.currentReadings.peakImport - this.previousReadings.peakImport;
        const totalImportOffPeak = this.currentReadings.offPeakImport - this.previousReadings.offPeakImport;
        const totalExportPeak = this.currentReadings.peakExport - this.previousReadings.peakExport;
        const totalExportOffPeak = this.currentReadings.offPeakExport - this.previousReadings.offPeakExport;
        
        // Update display - show actual difference (can be negative)
        document.getElementById('totalImportPeak').textContent = totalImportPeak.toFixed(2);
        document.getElementById('totalImportOffPeak').textContent = totalImportOffPeak.toFixed(2);
        document.getElementById('totalExportPeak').textContent = totalExportPeak.toFixed(2);
        document.getElementById('totalExportOffPeak').textContent = totalExportOffPeak.toFixed(2);
        
        // Color coding for all values
        const totalImportPeakElement = document.getElementById('totalImportPeak');
        const totalImportOffPeakElement = document.getElementById('totalImportOffPeak');
        const totalExportPeakElement = document.getElementById('totalExportPeak');
        const totalExportOffPeakElement = document.getElementById('totalExportOffPeak');
        
        // Color code import peak
        if (totalImportPeak > 0) {
            totalImportPeakElement.style.color = '#e74c3c'; // Red for positive usage
        } else if (totalImportPeak < 0) {
            totalImportPeakElement.style.color = '#27ae60'; // Green for negative
        } else {
            totalImportPeakElement.style.color = '#2c3e50'; // Default color
        }
        
        // Color code import off peak
        if (totalImportOffPeak > 0) {
            totalImportOffPeakElement.style.color = '#e74c3c'; // Red for positive usage
        } else if (totalImportOffPeak < 0) {
            totalImportOffPeakElement.style.color = '#27ae60'; // Green for negative
        } else {
            totalImportOffPeakElement.style.color = '#2c3e50'; // Default color
        }
        
        // Color code export peak
        if (totalExportPeak > 0) {
            totalExportPeakElement.style.color = '#27ae60'; // Green for positive export
        } else if (totalExportPeak < 0) {
            totalExportPeakElement.style.color = '#e74c3c'; // Red for negative export
        } else {
            totalExportPeakElement.style.color = '#2c3e50'; // Default color
        }
        
        // Color code export off peak
        if (totalExportOffPeak > 0) {
            totalExportOffPeakElement.style.color = '#27ae60'; // Green for positive export
        } else if (totalExportOffPeak < 0) {
            totalExportOffPeakElement.style.color = '#e74c3c'; // Red for negative export
        } else {
            totalExportOffPeakElement.style.color = '#2c3e50'; // Default color
        }
    }
    
    updatePreviousReadingsDisplay() {
        document.getElementById('previousPeakImport').textContent = 
            this.previousReadings.peakImport > 0 ? this.previousReadings.peakImport.toFixed(2) : '-';
        document.getElementById('previousPeakExport').textContent = 
            this.previousReadings.peakExport > 0 ? this.previousReadings.peakExport.toFixed(2) : '-';
        document.getElementById('previousOffPeakImport').textContent = 
            this.previousReadings.offPeakImport > 0 ? this.previousReadings.offPeakImport.toFixed(2) : '-';
        document.getElementById('previousOffPeakExport').textContent = 
            this.previousReadings.offPeakExport > 0 ? this.previousReadings.offPeakExport.toFixed(2) : '-';
    }
    
    saveReadings() {
        // Validate input
        if (!this.validateReadings()) {
            this.showMessage('Please enter valid readings for all fields.', 'error');
            return;
        }
        
        // Update current readings from inputs
        this.updateCurrentReadings();
        
        // Calculate individual usage values for this save (Daily Usage Summary values)
        const totalImportPeak = this.currentReadings.peakImport - this.previousReadings.peakImport;
        const totalImportOffPeak = this.currentReadings.offPeakImport - this.previousReadings.offPeakImport;
        const totalExportPeak = this.currentReadings.peakExport - this.previousReadings.peakExport;
        const totalExportOffPeak = this.currentReadings.offPeakExport - this.previousReadings.offPeakExport;
        const netUsage = (totalImportPeak + totalImportOffPeak) - (totalExportPeak + totalExportOffPeak);
        
        // Create historical record with Daily Usage Summary values
        const record = {
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            timestamp: new Date().toISOString(),
            currentReadings: { ...this.currentReadings }, // Store current readings for reference
            previousReadings: { ...this.previousReadings }, // Store previous readings for reference
            // Save the Daily Usage Summary values (the calculated differences)
            totalImportPeak: totalImportPeak,
            totalImportOffPeak: totalImportOffPeak,
            totalExportPeak: totalExportPeak,
            totalExportOffPeak: totalExportOffPeak,
            netUsage: netUsage
        };
        
        // Add to historical data
        this.historicalData.push(record);
        
        // Update history table
        this.updateHistoryTable();
        
        // Save to JSON database (in memory)
        this.saveToJSONDatabase();
        
        // DO NOT update previous readings - they stay the same
        // DO NOT clear current input fields - user can continue entering new readings
        
        // Save to localStorage
        this.saveData();
        
        this.showMessage('Daily usage data saved successfully to JSON database!', 'success');
    }
    
    updatePreviousReadings() {
        // Validate that we have current readings
        if (!this.validateReadings()) {
            this.showMessage('Please enter valid current readings first.', 'error');
            return;
        }
        
        if (confirm('This will update the previous reading values with current readings. This action affects all future calculations. Continue?')) {
            // Update current readings from inputs
            this.updateCurrentReadings();
            
            // Move current readings to previous readings
            this.previousReadings = { ...this.currentReadings };
            
            // Clear current input fields
            this.clearCurrentInputs();
            
            // Update displays
            this.updatePreviousReadingsDisplay();
            this.calculateUsage();
            
            // Save to JSON database (in memory)
            this.saveToJSONDatabase();
            
            // Save to localStorage
            this.saveData();
            
            this.showMessage('Previous reading values updated successfully in JSON database!', 'success');
        }
    }
    
    deleteRecord(index) {
        if (index < 0 || index >= this.historicalData.length) {
            this.showMessage('Invalid record index.', 'error');
            return;
        }
        
        const record = this.historicalData[index];
        const recordDate = new Date(record.timestamp).toLocaleDateString();
        
        if (confirm(`Are you sure you want to delete the record from ${recordDate}?\n\nThis action cannot be undone.`)) {
            // Remove the record from historical data
            this.historicalData.splice(index, 1);
            
            // Update the history table
            this.updateHistoryTable();
            
            // Save to JSON database (in memory)
            this.saveToJSONDatabase();
            
            // Save to localStorage
            this.saveData();
            
            this.showMessage(`Record from ${recordDate} deleted successfully from JSON database!`, 'success');
        }
    }
    
    validateReadings() {
        const fields = ['currentPeakImport', 'currentPeakExport', 'currentOffPeakImport', 'currentOffPeakExport'];
        return fields.every(fieldId => {
            const value = document.getElementById(fieldId).value;
            return value !== '' && !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
        });
    }
    
    clearCurrentInputs() {
        document.getElementById('currentPeakImport').value = '';
        document.getElementById('currentPeakExport').value = '';
        document.getElementById('currentOffPeakImport').value = '';
        document.getElementById('currentOffPeakExport').value = '';
        
        // Reset current readings object
        this.currentReadings = {
            peakImport: 0,
            peakExport: 0,
            offPeakImport: 0,
            offPeakExport: 0
        };
    }
    
    updateHistoryTable() {
        const tbody = document.getElementById('historyTableBody');
        const filter = document.getElementById('historyFilter').value;
        
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Filter data based on selection
        let filteredData = [...this.historicalData];
        
        if (filter !== 'all') {
            const daysToShow = parseInt(filter);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToShow);
            
            filteredData = this.historicalData.filter(record => {
                const recordDate = new Date(record.timestamp);
                return recordDate >= cutoffDate;
            });
        }
        
        // Sort by date (newest first)
        filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Populate table
        filteredData.forEach((record, index) => {
            const row = tbody.insertRow();
            const originalIndex = this.historicalData.indexOf(record);
            row.innerHTML = `
                <td>${new Date(record.timestamp).toLocaleDateString()}</td>
                <td style="color: ${record.totalImportPeak >= 0 ? '#e74c3c' : '#27ae60'};">${record.totalImportPeak.toFixed(2)}</td>
                <td style="color: ${record.totalImportOffPeak >= 0 ? '#e74c3c' : '#27ae60'};">${record.totalImportOffPeak.toFixed(2)}</td>
                <td style="color: ${record.totalExportPeak >= 0 ? '#27ae60' : '#e74c3c'};">${record.totalExportPeak.toFixed(2)}</td>
                <td style="color: ${record.totalExportOffPeak >= 0 ? '#27ae60' : '#e74c3c'};">${record.totalExportOffPeak.toFixed(2)}</td>
                <td style="color: ${record.netUsage >= 0 ? '#e74c3c' : '#27ae60'}; font-weight: 600;">
                    ${record.netUsage.toFixed(2)}
                </td>
                <td>
                    <button class="btn-remove" onclick="window.meterTracker.deleteRecord(${originalIndex})" title="Delete this record">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </td>
            `;
        });
        
        // Show message if no data
        if (filteredData.length === 0) {
            const row = tbody.insertRow();
            row.innerHTML = '<td colspan="7" style="text-align: center; color: #7f8c8d; font-style: italic;">No data available</td>';
        }
    }
    
    saveToJSONDatabase() {
        // This simulates saving to a JSON database
        // In a real database scenario, this would make an API call
        // For now, we just keep the data in memory and localStorage
        this.jsonDatabase = {
            lastUpdated: new Date().toISOString(),
            currentReadings: { ...this.currentReadings },
            previousReadings: { ...this.previousReadings },
            historicalData: [...this.historicalData]
        };
        
        // Also save to localStorage as backup
        localStorage.setItem('jsonDatabase', JSON.stringify(this.jsonDatabase));
    }
    
    loadFromJSONDatabase() {
        // Load data from JSON database (localStorage in this case)
        const savedDatabase = localStorage.getItem('jsonDatabase');
        if (savedDatabase) {
            try {
                this.jsonDatabase = JSON.parse(savedDatabase);
                
                // Update current application data with database data
                if (this.jsonDatabase.currentReadings) {
                    this.currentReadings = { ...this.jsonDatabase.currentReadings };
                }
                if (this.jsonDatabase.previousReadings) {
                    this.previousReadings = { ...this.jsonDatabase.previousReadings };
                }
                if (this.jsonDatabase.historicalData) {
                    this.historicalData = [...this.jsonDatabase.historicalData];
                }
                
                // Populate input fields
                this.populateInputFields();
                
                console.log('JSON Database loaded successfully');
                return this.jsonDatabase;
            } catch (error) {
                console.error('Error loading JSON database:', error);
                return null;
            }
        }
        return null;
    }
    
    downloadJSONFile() {
        // Only download when user explicitly clicks download button
        if (!this.jsonDatabase || this.historicalData.length === 0) {
            this.showMessage('No data available to download.', 'error');
            return;
        }
        
        // Create JSON content for download
        const jsonContent = JSON.stringify(this.jsonDatabase, null, 2);
        
        // Create and download the JSON file
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `electricity_meter_data_${new Date().toISOString().split('T')[0]}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showMessage('JSON database downloaded successfully!', 'success');
    }
    
    populateInputFields() {
        // Populate current input fields if they have values
        if (this.currentReadings.peakImport > 0) {
            document.getElementById('currentPeakImport').value = this.currentReadings.peakImport;
        }
        if (this.currentReadings.peakExport > 0) {
            document.getElementById('currentPeakExport').value = this.currentReadings.peakExport;
        }
        if (this.currentReadings.offPeakImport > 0) {
            document.getElementById('currentOffPeakImport').value = this.currentReadings.offPeakImport;
        }
        if (this.currentReadings.offPeakExport > 0) {
            document.getElementById('currentOffPeakExport').value = this.currentReadings.offPeakExport;
        }
    }
    
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            // Reset all data
            this.currentReadings = {
                peakImport: 0,
                peakExport: 0,
                offPeakImport: 0,
                offPeakExport: 0
            };
            
            this.previousReadings = {
                peakImport: 0,
                peakExport: 0,
                offPeakImport: 0,
                offPeakExport: 0
            };
            
            this.historicalData = [];
            
            // Clear inputs
            this.clearCurrentInputs();
            
            // Update displays
            this.updatePreviousReadingsDisplay();
            this.calculateUsage();
            this.updateHistoryTable();
            
            // Clear JSON database (in memory)
            this.saveToJSONDatabase();
            
            // Clear localStorage
            localStorage.removeItem('electricityMeterData');
            
            this.showMessage('All data cleared successfully from JSON database!', 'success');
        }
    }
    
    saveData() {
        const dataToSave = {
            currentReadings: this.currentReadings,
            previousReadings: this.previousReadings,
            historicalData: this.historicalData,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('electricityMeterData', JSON.stringify(dataToSave));
    }
    
    loadData() {
        const savedData = localStorage.getItem('electricityMeterData');
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.currentReadings = data.currentReadings || this.currentReadings;
                this.previousReadings = data.previousReadings || this.previousReadings;
                this.historicalData = data.historicalData || [];
                
                // Populate current input fields if they have values
                this.populateInputFields();
                
            } catch (error) {
                console.error('Error loading saved data:', error);
                this.showMessage('Error loading saved data. Starting fresh.', 'error');
            }
        } else {
            // Initialize with default static previous values for first time use
            this.previousReadings = {
                peakImport: 121,
                peakExport: 13,
                offPeakImport: 1295,
                offPeakExport: 5645
            };
        }
    }
    
    checkPassword() {
        const passwordInput = document.getElementById('passwordInput');
        const enteredPassword = passwordInput.value;
        
        if (enteredPassword === this.password) {
            this.isAuthenticated = true;
            this.updateAuthenticationUI();
            this.updateHistoryTable();
            this.showMessage('Access granted! All features are now available.', 'success');
            passwordInput.value = ''; // Clear password field
        } else {
            this.showMessage('Incorrect password. Please try again.', 'error');
            passwordInput.value = '';
        }
    }
    
    updateAuthenticationUI() {
        const protectedElements = document.querySelectorAll('.protected-element');
        const authSection = document.querySelector('.auth-section');
        
        if (this.isAuthenticated) {
            // Show protected elements
            protectedElements.forEach(element => {
                element.style.display = '';
            });
            // Hide authentication section
            if (authSection) {
                authSection.style.display = 'none';
            }
        } else {
            // Hide protected elements
            protectedElements.forEach(element => {
                element.style.display = 'none';
            });
            // Show authentication section
            if (authSection) {
                authSection.style.display = '';
            }
        }
    }
    
    showMessage(text, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Insert after header
        const header = document.querySelector('.header');
        header.insertAdjacentElement('afterend', message);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.meterTracker = new ElectricityMeterTracker();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        window.meterTracker.saveReadings();
    }
    
    // Ctrl+E to export
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault(); 
        window.meterTracker.exportData();
    }
});

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 