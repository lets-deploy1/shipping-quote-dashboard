// ============================================
// CONFIGURATION - ADD YOUR API TOKEN HERE
// ============================================
const SMARTSHEET_API_TOKEN = 'PH2JCA2pi206Ba7XuKXmoeTSyGuomFyQnr25r'; // Replace with your Smartsheet API token
const SHEET_ID = '5638471382159236'; // Your Shipping Quotes Sheet ID

// CORS Proxy to bypass browser restrictions
const CORS_PROXY = 'https://corsproxy.io/?';

// ============================================
// FETCH DATA FROM SMARTSHEET
// ============================================
async function fetchSheetData() {
    try {
        const apiUrl = `https://api.smartsheet.com/2.0/sheets/${SHEET_ID}`;
        const response = await fetch(CORS_PROXY + encodeURIComponent(apiUrl), {
            headers: {
                'Authorization': `Bearer ${SMARTSHEET_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch data. Check your API token.');
        }
        
        const data = await response.json();
        return parseSheetData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        showError(error.message);
        return [];
    }
}

// ============================================
// PARSE SMARTSHEET DATA INTO EVENTS
// ============================================
function parseSheetData(sheetData) {
    const rows = sheetData.rows || [];
    const columns = sheetData.columns || [];
    
    // Create column ID to title mapping
    const columnMap = {};
    columns.forEach(col => {
        columnMap[col.id] = col.title;
    });
    
    // Parse each row into an event object
    const events = rows.map(row => {
        const event = {};
        row.cells.forEach(cell => {
            const columnName = columnMap[cell.columnId];
            event[columnName] = cell.value || '';
        });
        return event;
    });
    
    return events;
}

// ============================================
// RENDER EVENTS TO THE DASHBOARD
// ============================================
function renderEvents(events) {
    const container = document.getElementById('events-container');
    const eventCount = document.getElementById('event-count');
    
    container.innerHTML = '';
    eventCount.textContent = events.length + ' Event' + (events.length !== 1 ? 's' : '');
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <p>No shipping quotes found.</p>
                <p>Add quotes to your Smartsheet to see them here.</p>
            </div>
        `;
        return;
    }
    
    events.forEach(event => {
        const card = createEventCard(event);
        container.appendChild(card);
    });
}

// ============================================
// CREATE EVENT CARD HTML
// ============================================
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.kit = event['KIT NUMBER'] || '1';
    card.dataset.date = event['QUOTE DATE'] || '';
    
    const kitClass = event['KIT NUMBER'] === '2' ? 'kit-2' : 'kit-1';
    
    card.innerHTML = `
        <div class="event-header">
            <div class="event-id">EVENT ID: <strong>${event['EVENT ID'] || 'N/A'}</strong></div>
            <div class="kit-badge ${kitClass}">KIT #${event['KIT NUMBER'] || '1'}</div>
            <div class="event-date">${formatDate(event['QUOTE DATE'])}</div>
        </div>
        
        <div class="destinations">
            <div class="destination-box">
                <h3>Destination</h3>
                <p class="location-name">${event['DESTINATION NAME'] || 'N/A'}</p>
                <p class="location-address">${event['DESTINATION ADDRESS'] || ''}</p>
                <p class="location-city">${event['DESTINATION CITY'] || ''}, ${event['DESTINATION STATE'] || ''} ${event['DESTINATION ZIP'] || ''}</p>
            </div>
            <div class="arrow">→</div>
            <div class="destination-box">
                <h3>Return Destination</h3>
                <p class="location-name">${event['RETURN TO NAME'] || 'N/A'}</p>
                <p class="location-address">${event['RETURN TO ADDRESS'] || ''}</p>
                <p class="location-city">${event['RETURN TO CITY'] || ''}, ${event['RETURN TO STATE'] || ''} ${event['RETURN TO ZIP'] || ''}</p>
            </div>
        </div>

        <div class="package-info">
            <span><strong>Weight:</strong> ${event['WEIGHT'] || 'N/A'} lbs</span>
            <span><strong>Dimensions:</strong> ${event['DIMENSIONS'] || 'N/A'}</span>
        </div>

        <div class="rates-container">
            <div class="rates-column">
                <h4>Outbound Rates</h4>
                <table class="rates-table">
                    <tr><td>FedEx Ground</td><td>${formatRate(event['OUT FEDEX GROUND'])}</td></tr>
                    <tr><td>FedEx Express Saver</td><td>${formatRate(event['OUT FEDEX EXPRESS SAVER'])}</td></tr>
                    <tr><td>FedEx 2Day</td><td>${formatRate(event['OUT FEDEX 2DAY'])}</td></tr>
                    <tr><td>FedEx 2Day AM</td><td>${formatRate(event['OUT FEDEX 2DAY AM'])}</td></tr>
                    <tr><td>FedEx Standard Overnight</td><td>${formatRate(event['OUT FEDEX STANDARD O/N'])}</td></tr>
                    <tr><td>FedEx Priority Overnight</td><td>${formatRate(event['OUT FEDEX PRIORITY O/N'])}</td></tr>
                    <tr><td>FedEx First Overnight</td><td>${formatRate(event['OUT FEDEX FIRST O/N'])}</td></tr>
                </table>
            </div>
            <div class="rates-column">
                <h4>Return Rates</h4>
                <table class="rates-table">
                    <tr><td>FedEx Ground</td><td>${formatRate(event['RET FEDEX GROUND'])}</td></tr>
                    <tr><td>FedEx Express Saver</td><td>${formatRate(event['RET FEDEX EXPRESS SAVER'])}</td></tr>
                    <tr><td>FedEx 2Day</td><td>${formatRate(event['RET FEDEX 2DAY'])}</td></tr>
                    <tr><td>FedEx 2Day AM</td><td>${formatRate(event['RET FEDEX 2DAY AM'])}</td></tr>
                    <tr><td>FedEx Standard Overnight</td><td>${formatRate(event['RET FEDEX STANDARD O/N'])}</td></tr>
                    <tr><td>FedEx Priority Overnight</td><td>${formatRate(event['RET FEDEX PRIORITY O/N'])}</td></tr>
                    <tr><td>FedEx First Overnight</td><td>${formatRate(event['RET FEDEX FIRST O/N'])}</td></tr>
                </table>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch {
        return dateStr;
    }
}

function formatRate(value) {
    if (!value && value !== 0) return 'N/A';
    return '$' + parseFloat(value).toFixed(2);
}

function showError(message) {
    const container = document.getElementById('events-container');
    container.innerHTML = `
        <div class="error-message">
            <h3>Error Loading Data</h3>
            <p>${message}</p>
            <p>Make sure you've added your Smartsheet API token in the script.js file.</p>
        </div>
    `;
}

// ============================================
// FILTER FUNCTIONALITY
// ============================================
function filterEvents(events) {
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    const kitFilter = document.getElementById('kit-filter');
    const searchInput = document.getElementById('search');
    
    const fromDate = dateFrom.value ? new Date(dateFrom.value) : null;
    const toDate = dateTo.value ? new Date(dateTo.value) : null;
    const kitValue = kitFilter.value;
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    return events.filter(event => {
        // Kit filter - apply first (simpler)
        const eventKit = String(event['KIT NUMBER'] || '1');
        if (kitValue !== 'all' && eventKit !== kitValue) return false;
        
        // Search filter - only apply if search term exists
        if (searchTerm && searchTerm.length > 0) {
            const eventText = Object.values(event).join(' ').toLowerCase();
            if (!eventText.includes(searchTerm)) return false;
        }
        
        // Date filter - only apply if both date inputs have values
        const eventDateStr = event['QUOTE DATE'];
        if (!eventDateStr) return true; // Show events without dates
        
        const eventDate = new Date(eventDateStr);
        if (isNaN(eventDate)) return true; // Show events with invalid dates
        
        // Only apply date filtering if we have valid filter dates
        if (fromDate && !isNaN(fromDate.getTime())) {
            if (eventDate < fromDate) return false;
        }
        if (toDate && !isNaN(toDate.getTime())) {
            if (eventDate > toDate) return false;
        }
        
        return true;
    });
}

// ============================================
// INITIALIZE DASHBOARD (SINGLE LISTENER)
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    const kitFilter = document.getElementById('kit-filter');
    const searchInput = document.getElementById('search');
    
    // Set default date range (last 30 days to 90 days ahead)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const ninetyDaysAhead = new Date(today);
    ninetyDaysAhead.setDate(today.getDate() + 90);
    
    dateFrom.value = thirtyDaysAgo.toISOString().split('T')[0];
    dateTo.value = ninetyDaysAhead.toISOString().split('T')[0];
    
    // Fetch and render initial data
    const allEvents = await fetchSheetData();
    
    // Apply initial filter with default dates
    const filteredEvents = filterEvents(allEvents);
    renderEvents(filteredEvents);
    
    // Add filter event listeners
    dateFrom.addEventListener('change', () => renderEvents(filterEvents(allEvents)));
    dateTo.addEventListener('change', () => renderEvents(filterEvents(allEvents)));
    kitFilter.addEventListener('change', () => renderEvents(filterEvents(allEvents)));
    searchInput.addEventListener('input', () => renderEvents(filterEvents(allEvents)));
    
    // Update last updated timestamp
    document.getElementById('last-updated').textContent = 
        'Last Updated: ' + new Date().toLocaleString();
});
