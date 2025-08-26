async function fetchArtistOfTheDay() {
    try {
        const today = new Date();
        const month = today.getMonth() + 1; // getMonth() returns 0-11, so we add 1
        const day = today.getDate();
        
        console.log('Date debugging:');
        console.log('Raw Date object:', today);
        console.log('getMonth():', today.getMonth());
        console.log('getDate():', today.getDate());
        console.log('Calculated month:', month);
        console.log('Calculated day:', day);
        console.log('Full date string:', today.toDateString());
        console.log('ISO string:', today.toISOString());
        console.log(`Fetching musicians born on: ${month}/${day}`);
        
        // Using a free API that gives us artists born on a specific date
        const response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        console.log(`Found ${data.births ? data.births.length : 0} people born on ${month}/${day}`);
        return data;
    } catch (error) {
        console.error('Error fetching artist data:', error);
        return null;
    }
}

// Global variable to store musicians and current index
let currentMusicians = [];
let currentMusicianIndex = 0;

function displayArtistOfTheDay(artistData) {
    const artistDisplay = document.getElementById('artist-display');
    
    if (!artistData || artistData.births.length === 0) {
        artistDisplay.innerHTML = '<p>No musicians found for today.</p>';
        return;
    }
    
    // Filter for musicians only
    currentMusicians = artistData.births.filter(person => 
        person.text.toLowerCase().includes('musician') || 
        person.text.toLowerCase().includes('rapper') ||
        person.text.toLowerCase().includes('singer') ||
        person.text.toLowerCase().includes('band')
    );
    
    // Additional data validation filter
    currentMusicians = currentMusicians.filter(person => {
        // Check if birth year exists and is reasonable
        if (!person.year || person.year < 1800 || person.year > 2010) {
            console.log(`Filtering out ${person.text} - Invalid birth year: ${person.year}`);
            return false;
        }
        
        // Check if text is complete
        if (!person.text || person.text.length < 10) {
            console.log(`Filtering out ${person.text} - Incomplete data`);
            return false;
        }
        
        return true;
    });
    
    console.log('Filtering results:');
    console.log('Total people:', artistData.births.length);
    console.log('Musicians found (before validation):', currentMusicians.length);
    console.log('Musicians found (after validation):', currentMusicians.length);
    console.log('First few musicians:', currentMusicians.slice(0, 3));
    console.log('Sample of all people:', artistData.births.slice(0, 5));
    
    if (currentMusicians.length === 0) {
        artistDisplay.innerHTML = '<p>No musicians found for today.</p>';
        return;
    }
    
    // Reset to first musician
    currentMusicianIndex = 0;
    
    // Display the first musician with navigation buttons
    displayCurrentMusician();
}

function displayCurrentMusician() {
    const artistDisplay = document.getElementById('artist-display');
    const musician = currentMusicians[currentMusicianIndex];
    
    // Split the artist text into name and description
    const artistParts = musician.text.split(', ');
    const artistName = artistParts[0];
    const artistDescription = artistParts.slice(1).join(', ');
    
    const html = `
        <div class="artist-card">
            <h2>🎵 Musician of the Day 🎵</h2>
            <h3 class="artist-name">${artistName}</h3>
            <p class="artist-description">${artistDescription}</p>
            <p class="birth-year">Born: ${getCurrentDateFormatted()}, ${musician.year}</p>
            <p class="discovery">Musician ${currentMusicianIndex + 1} of ${currentMusicians.length}</p>
            <div class="wiki-link">
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(artistName)}" target="_blank" class="discover-link">
                    🔍 Discover more about them
                </a>
            </div>
            <div class="navigation-buttons">
                <button onclick="previousMusician()" class="nav-btn" ${currentMusicianIndex === 0 ? 'disabled' : ''}>← Previous</button>
                <button onclick="nextMusician()" class="nav-btn" ${currentMusicianIndex === currentMusicians.length - 1 ? 'disabled' : ''}>Next →</button>
            </div>
        </div>
    `;
    
    artistDisplay.innerHTML = html;
}

function nextMusician() {
    if (currentMusicianIndex < currentMusicians.length - 1) {
        currentMusicianIndex++;
        displayCurrentMusician();
    }
}

function previousMusician() {
    if (currentMusicianIndex > 0) {
        currentMusicianIndex--;
        displayCurrentMusician();
    }
}

// Music notes animation for the main portfolio - Floating around title
function initMusicNotesAnimation() {
    // The music notes are now created directly in HTML and styled with CSS
    // This function is kept for any future enhancements but not needed for basic functionality
    console.log('🎵 Floating music notes animation initialized! 🎵');
}

// Helper function to format current date with month name and ordinal suffix
function getCurrentDateFormatted() {
    const today = new Date();
    const month = today.getMonth(); // 0-11
    const day = today.getDate();
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthName = monthNames[month];
    const dayWithSuffix = getDayWithSuffix(day);
    
    return `${monthName} ${dayWithSuffix}`;
}

// Helper function to add ordinal suffix to day numbers
function getDayWithSuffix(day) {
    if (day >= 11 && day <= 13) {
        return day + 'th';
    }
    
    switch (day % 10) {
        case 1: return day + 'st';
        case 2: return day + 'nd';
        case 3: return day + 'rd';
        default: return day + 'th';
    }
}



// Function to test a specific date manually
async function testSpecificDate(month, day) {
    try {
        console.log(`Testing date: ${month}/${day}`);
        const response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        console.log(`Date ${month}/${day} - Found ${data.births ? data.births.length : 0} people`);
        console.log('Sample people:', data.births ? data.births.slice(0, 3) : 'No data');
        return data;
    } catch (error) {
        console.error('Error testing date:', error);
        return null;
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Harrison Prim Portfolio loaded with musical inspiration! 🎵');
    
    // Force scroll to top on page load to prevent scrolling to bottom
    window.scrollTo(0, 0);
    
    // Only call the functions that exist
    initMusicNotesAnimation();
    
    // Initialize Artist of the Day page functionality
    initArtistOfTheDay();
});

// Initialize Artist of the Day page
function initArtistOfTheDay() {
    const findBtn = document.getElementById('find-musicians-btn');
    if (findBtn) {
        findBtn.addEventListener('click', function() {
            // Show loading state
            findBtn.textContent = '🔍 Searching...';
            findBtn.disabled = true;
            
                    // Fetch and display musicians
        fetchArtistOfTheDay().then(data => {
            if (data) {
                // Add date info to the display
                const today = new Date();
                const month = today.getMonth() + 1;
                const day = today.getDate();
                const year = today.getFullYear();
                
                const dateInfo = `<p class="date-info">📅 Searching for musicians born on ${month}/${day}/${year}</p>`;
                document.getElementById('artist-display').innerHTML = dateInfo;
                
                // Display the musicians
                displayArtistOfTheDay(data);
                findBtn.textContent = '🔄 Find Again';
                
                // Add debug info
                console.log('API Response:', data);
                console.log('First few people:', data.births ? data.births.slice(0, 3) : 'No births data');
            } else {
                document.getElementById('artist-display').innerHTML = 
                    '<p class="error-message">❌ Failed to fetch musicians. Please try again.</p>';
                findBtn.textContent = '🔍 Find Today\'s Musicians';
            }
            findBtn.disabled = false;
        });
        });
    }
}

