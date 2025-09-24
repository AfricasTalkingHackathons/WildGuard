// Rangers Dashboard JavaScript
const API_BASE_URL = 'https://wildguard-api-gubr.onrender.com';
let currentReportId = null;
let eventSource = null;

document.addEventListener('DOMContentLoaded', function() {
    initRangersDashboard();
});

// Initialize Rangers Dashboard
async function initRangersDashboard() {
    console.log('🎯 Rangers Dashboard initializing...');
    
    let apiConnected = false;
    
    // Load dashboard data
    try {
        await loadDashboardOverview();
        apiConnected = true;
    } catch (error) {
        console.error('Dashboard overview failed:', error);
    }
    
    try {
        await loadRecentReports();
    } catch (error) {
        console.error('Reports loading failed:', error);
    }
    
    try {
        await loadThreatPredictions();
    } catch (error) {
        console.error('Threat predictions failed:', error);
    }
    
    try {
        await loadSensorStatus();
    } catch (error) {
        console.error('Sensor status failed:', error);
    }
    
    // Update connection status
    updateConnectionStatus(apiConnected, 'Some API endpoints unavailable');
    
    // Initialize real-time alerts
    initRealTimeAlerts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up auto-refresh
    setInterval(async () => {
        try {
            await loadDashboardOverview();
            await loadRecentReports();
            await loadThreatPredictions();
        } catch (error) {
            console.warn('Auto-refresh failed:', error);
        }
    }, 30000); // Refresh every 30 seconds
    
    console.log('✅ Rangers Dashboard initialized');
    showErrorMessage('Rangers Dashboard ready! Some features may use mock data if API is unavailable.', 'success');
}

// Load Dashboard Overview
async function loadDashboardOverview() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/rangers/dashboard`);
        
        if (response.ok) {
            const data = await response.json();
            
            // The API returns data directly without a success wrapper
            if (data.stats) {
                updateDashboardMetrics(data.stats);
                console.log('✅ Dashboard overview loaded successfully');
            } else {
                console.warn('Dashboard API returned unexpected format:', data);
                loadMockDashboardData();
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading dashboard overview:', error);
        console.log('📱 Loading mock dashboard data...');
        loadMockDashboardData();
    }
}

// Update Dashboard Metrics
function updateDashboardMetrics(stats) {
    document.getElementById('total-reports').textContent = stats.totalReports || 0;
    document.getElementById('pending-reports').textContent = stats.pendingVerifications || 0;
    document.getElementById('verified-today').textContent = stats.verifiedToday || 0;
    document.getElementById('active-threats').textContent = stats.urgentReports || 0;
    
    // Mock data for metrics not available in API
    document.getElementById('online-rangers').textContent = Math.floor(Math.random() * 15) + 5;
    document.getElementById('sensor-alerts').textContent = Math.floor(Math.random() * 5);
}

// Update Sensor Metrics
function updateSensorMetrics(sensorStatus) {
    if (sensorStatus) {
        document.getElementById('total-sensors').textContent = sensorStatus.total || 0;
        document.getElementById('sensors-online').textContent = sensorStatus.online || 0;
        document.getElementById('sensors-alerting').textContent = sensorStatus.alerting || 0;
        document.getElementById('sensors-low-battery').textContent = sensorStatus.lowBattery || 0;
    }
}

// Load Recent Reports
async function loadRecentReports() {
    try {
        const filters = getActiveFilters();
        const params = new URLSearchParams(filters);
        params.append('limit', '20');
        
        const response = await fetch(`${API_BASE_URL}/api/rangers/reports?${params}`);
        
        if (response.ok) {
            const data = await response.json();
            
            // The API returns data directly with reports array
            if (data.reports && Array.isArray(data.reports)) {
                displayReports(data.reports);
                console.log(`✅ Loaded ${data.reports.length} reports`);
            } else {
                throw new Error('Invalid response format');
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading reports:', error);
        console.log('📱 Loading mock reports data...');
        displayMockReports();
    }
}

// Display Reports in Table
function displayReports(reports) {
    const tbody = document.getElementById('reports-tbody');
    
    if (!reports || reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">No reports found</td></tr>';
        return;
    }
    
    tbody.innerHTML = reports.map(report => `
        <tr class="report-row" data-report-id="${report.id}">
            <td>${formatReportType(report.type)}</td>
            <td><span class="priority-${report.priority}">${report.priority}</span></td>
            <td class="location-cell">
                ${report.location ? 
                    `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}` : 
                    'N/A'
                }
            </td>
            <td class="description-cell" title="${report.description}">
                ${truncateText(report.description, 50)}
            </td>
            <td>${formatDateTime(report.reportedAt)}</td>
            <td>
                ${report.reporter ? 
                    `${report.reporter.phoneNumber}<br><small>Trust: ${report.reporter.trustScore}%</small>` : 
                    'Anonymous'
                }
            </td>
            <td>${report.reporter?.trustScore || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openVerificationModal('${report.id}')">
                    <i class="fas fa-eye"></i> Review
                </button>
            </td>
        </tr>
    `).join('');
}

// Load Threat Predictions
async function loadThreatPredictions() {
    try {
        // Get sample coordinates from recent reports or use default coordinates
        const defaultLat = '-2.1534560';
        const defaultLng = '34.6789010';
        
        // Use the dashboard endpoint which includes threat summary
        const response = await fetch(`${API_BASE_URL}/api/rangers/dashboard`);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.threatSummary && data.threatSummary.recommendations) {
                displayThreatPredictions(data.threatSummary.recommendations);
                console.log('✅ Threat predictions loaded successfully');
            } else {
                console.log('📱 No threat summary available, loading mock data...');
                displayMockThreats();
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading threat predictions:', error);
        console.log('📱 Loading mock threat data...');
        displayMockThreats();
    }
}

// Display Threat Predictions
function displayThreatPredictions(threats) {
    const tbody = document.getElementById('threats-tbody');
    
    if (!threats || threats.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No current threats detected</td></tr>';
        return;
    }
    
    tbody.innerHTML = threats.map(threat => {
        // Handle different response formats
        const riskScore = parseFloat(threat.riskScore) || Math.random() * 0.8 + 0.2;
        const location = threat.location ? threat.location.split(',') : ['-1.4200', '35.0800'];
        const lat = parseFloat(location[1]) || parseFloat(location[0]);
        const lng = parseFloat(location[0]) || parseFloat(location[1]);
        
        // Extract actions from API response
        let actions = [];
        if (threat.actions && Array.isArray(threat.actions)) {
            actions = threat.actions.map(action => ({
                action: action.action || action,
                priority: action.priority || 'medium'
            }));
        } else if (typeof threat.actions === 'string') {
            actions = [{ action: threat.actions, priority: 'medium' }];
        }
        
        return `
        <tr class="threat-row">
            <td>${formatThreatType(threat.type)}</td>
            <td>
                <div class="risk-score">
                    <span class="score-value">${(riskScore * 100).toFixed(0)}%</span>
                    <div class="risk-bar">
                        <div class="risk-fill" style="width: ${riskScore * 100}%"></div>
                    </div>
                </div>
            </td>
            <td>${lat.toFixed(4)}, ${lng.toFixed(4)}</td>
            <td>Active</td>
            <td>${Math.floor(riskScore * 100)}%</td>
            <td>
                ${actions.map(action => 
                    `<span class="action-tag priority-${action.priority}">${action.action}</span>`
                ).join(' ')}
            </td>
        </tr>
    `;
    }).join('');
}

// Load Sensor Status
async function loadSensorStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/sensors/network`);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success) {
                updateSensorMetrics(data.overview);
            }
        }
    } catch (error) {
        console.error('Error loading sensor status:', error);
        // Sensor metrics already have fallback values
    }
}

// Initialize Real-time Alerts
function initRealTimeAlerts() {
    try {
        eventSource = new EventSource(`${API_BASE_URL}/api/rangers/alerts/stream`);
        
        eventSource.onopen = () => {
            console.log('📡 Real-time alerts connected');
            updateAlertStatus('Connected to real-time alerts', 'success');
        };
        
        eventSource.onmessage = (event) => {
            const alertData = JSON.parse(event.data);
            handleRealTimeAlert(alertData);
        };
        
        eventSource.onerror = (error) => {
            console.error('Real-time alerts error:', error);
            updateAlertStatus('Alert stream disconnected', 'error');
            
            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                initRealTimeAlerts();
            }, 5000);
        };
    } catch (error) {
        console.error('Failed to initialize real-time alerts:', error);
        updateAlertStatus('Real-time alerts unavailable', 'warning');
    }
}

// Handle Real-time Alert
function handleRealTimeAlert(alertData) {
    const alertsContainer = document.getElementById('alerts-container');
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${alertData.type}`;
    
    alertElement.innerHTML = `
        <div class="alert-header">
            <span class="alert-type">${alertData.type}</span>
            <span class="alert-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="alert-content">
            ${formatAlertContent(alertData)}
        </div>
    `;
    
    // Add to top of alerts container
    alertsContainer.insertBefore(alertElement, alertsContainer.firstChild);
    
    // Remove old alerts (keep only last 10)
    const alerts = alertsContainer.querySelectorAll('.alert');
    if (alerts.length > 10) {
        alerts[alerts.length - 1].remove();
    }
    
    // Auto-refresh data on certain alert types
    if (alertData.type === 'new_report' || alertData.type === 'threat_alert') {
        setTimeout(() => {
            loadRecentReports();
            loadThreatPredictions();
        }, 1000);
    }
}

// Open Verification Modal
async function openVerificationModal(reportId) {
    currentReportId = reportId;
    
    try {
        // Fetch detailed report data
        const response = await fetch(`${API_BASE_URL}/api/rangers/reports?reportId=${reportId}`);
        const data = await response.json();
        
        if (data.success && data.reports.length > 0) {
            const report = data.reports[0];
            displayReportDetails(report);
        }
        
        document.getElementById('verification-modal').style.display = 'block';
    } catch (error) {
        console.error('Error loading report details:', error);
        alert('Failed to load report details');
    }
}

// Close Verification Modal
function closeVerificationModal() {
    document.getElementById('verification-modal').style.display = 'none';
    currentReportId = null;
}

// Verify Report
async function verifyReport(action) {
    if (!currentReportId) return;
    
    const notes = document.getElementById('verification-notes').value;
    const rewardAmount = document.getElementById('reward-amount').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/rangers/reports/${currentReportId}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action,
                notes,
                rewardAmount: parseFloat(rewardAmount),
                followUpRequired: action === 'investigate'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Report ${action}ed successfully!`);
            closeVerificationModal();
            await loadRecentReports();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error verifying report:', error);
        alert('Failed to verify report. Please try again.');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter changes
    document.getElementById('status-filter').addEventListener('change', loadRecentReports);
    document.getElementById('priority-filter').addEventListener('change', loadRecentReports);
    
    // Refresh button
    document.getElementById('refresh-reports').addEventListener('click', () => {
        loadRecentReports();
        loadThreatPredictions();
    });
    
    // Modal close on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('verification-modal');
        if (e.target === modal) {
            closeVerificationModal();
        }
    });
}

// Show error message to user
function showErrorMessage(message, type = 'warning') {
    const alertsContainer = document.getElementById('alerts-container') || 
                           document.querySelector('.real-time-alerts .alerts-container');
    
    if (alertsContainer) {
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-status ${type}`;
        alertElement.innerHTML = `
            <div class="alert-header">
                <span class="alert-type">System Notice</span>
                <span class="alert-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="alert-message">${message}</div>
        `;
        
        alertsContainer.insertBefore(alertElement, alertsContainer.firstChild);
        
        // Remove after 10 seconds
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 10000);
    } else {
        console.warn('Alert container not found, displaying console message:', message);
    }
}

// Show connection status
function updateConnectionStatus(isConnected, message) {
    const statusIndicator = document.getElementById('connection-status') || createConnectionStatusIndicator();
    
    if (isConnected) {
        statusIndicator.className = 'connection-status online';
        statusIndicator.innerHTML = '<i class="fas fa-wifi"></i> Connected to API';
    } else {
        statusIndicator.className = 'connection-status offline';
        statusIndicator.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline Mode';
        if (message) {
            showErrorMessage(`API Connection Failed: ${message}. Running in offline mode with mock data.`, 'error');
        }
    }
}

// Create connection status indicator if it doesn't exist
function createConnectionStatusIndicator() {
    const header = document.querySelector('.header');
    if (header) {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'connection-status';
        statusDiv.style.cssText = `
            position: absolute;
            top: 10px;
            right: 20px;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
        `;
        header.style.position = 'relative';
        header.appendChild(statusDiv);
        return statusDiv;
    }
    return null;
}

// Utility Functions
function getActiveFilters() {
    const filters = {};
    
    const status = document.getElementById('status-filter').value;
    const priority = document.getElementById('priority-filter').value;
    
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    
    return filters;
}

function formatReportType(type) {
    const typeMap = {
        'wildlife_sighting': 'Wildlife Sighting',
        'poaching': 'Poaching Alert',
        'suspicious_activity': 'Suspicious Activity',
        'injury': 'Injured Wildlife',
        'illegal_logging': 'Illegal Logging',
        'fire': 'Fire Incident',
        'fence_breach': 'Fence Breach'
    };
    return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatThreatType(type) {
    const typeMap = {
        'poaching_risk': 'Poaching Risk',
        'fire_risk': 'Fire Risk',
        'human_activity': 'Human Activity'
    };
    return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function formatTimeWindow(timeWindow) {
    const windowMap = {
        'next_6h': 'Next 6 hours',
        'next_12h': 'Next 12 hours',
        'next_24h': 'Next 24 hours'
    };
    return windowMap[timeWindow] || timeWindow;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatAlertContent(alertData) {
    switch (alertData.type) {
        case 'new_report':
            return `New ${alertData.data.type} report at ${alertData.data.location.lat}, ${alertData.data.location.lng}`;
        case 'threat_alert':
            return `High threat detected (${(alertData.data.riskScore * 100).toFixed(0)}% risk) at ${alertData.data.location.lat}, ${alertData.data.location.lng}`;
        case 'sensor_alert':
            return `Sensor alert: ${alertData.data.alertType} - Confidence: ${(alertData.data.confidence * 100).toFixed(0)}%`;
        default:
            return JSON.stringify(alertData.data);
    }
}

function updateAlertStatus(message, type) {
    const alertsContainer = document.getElementById('alerts-container');
    const statusElement = alertsContainer.querySelector('.alert-status');
    
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `alert-status ${type}`;
    }
}

function displayReportDetails(report) {
    const detailsContainer = document.getElementById('report-details');
    detailsContainer.innerHTML = `
        <div class="report-detail-card">
            <h4>${formatReportType(report.type)} - ${report.priority} Priority</h4>
            <p><strong>Location:</strong> ${report.location ? `${report.location.latitude}, ${report.location.longitude}` : 'Not specified'}</p>
            <p><strong>Description:</strong> ${report.description}</p>
            <p><strong>Reported:</strong> ${formatDateTime(report.reportedAt)}</p>
            <p><strong>Reporter:</strong> ${report.reporter ? `${report.reporter.phoneNumber} (Trust: ${report.reporter.trustScore}%)` : 'Anonymous'}</p>
            ${report.threatAnalysis ? `
                <div class="threat-analysis">
                    <p><strong>Threat Analysis:</strong></p>
                    <p>Risk Score: ${(report.threatAnalysis.riskScore * 100).toFixed(0)}%</p>
                    <p>Confidence: ${(report.threatAnalysis.confidence * 100).toFixed(0)}%</p>
                </div>
            ` : ''}
        </div>
    `;
}

// Mock data functions for fallback
function loadMockDashboardData() {
    updateDashboardMetrics({
        totalReports: 156,
        pendingReports: 12,
        verifiedToday: 8,
        activeThreats: 3,
        onlineRangers: 5,
        sensorAlerts: 2
    });
    
    updateSensorMetrics({
        total: 25,
        online: 23,
        alerting: 2,
        lowBattery: 1
    });
}

function displayMockReports() {
    const mockReports = [{
        id: 'mock-1',
        type: 'poaching',
        priority: 'urgent',
        location: { latitude: -2.153456, longitude: 34.678901 },
        description: 'Gunshots heard near River Camp',
        reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        reporter: {
            phoneNumber: '+254712345678',
            trustScore: 92
        }
    }];
    
    displayReports(mockReports);
}

function displayMockThreats() {
    const mockThreats = [{
        type: 'poaching_risk',
        riskScore: 0.87,
        location: { latitude: -2.150000, longitude: 34.680000 },
        timeWindow: 'next_6h',
        confidence: 0.91,
        recommendedActions: [{
            action: 'immediate_patrol',
            priority: 'urgent'
        }]
    }];
    
    displayThreatPredictions(mockThreats);
}

// Make functions globally available
window.openVerificationModal = openVerificationModal;
window.closeVerificationModal = closeVerificationModal;
window.verifyReport = verifyReport;
