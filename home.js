// Check if the user is logged in
if (!sessionStorage.getItem("loggedIn")) {
    window.location.href = "index.html"; // Redirect to login page if not logged in
}

// Get username from sessionStorage
const username = sessionStorage.getItem("username");

// Display the username
document.getElementById("username-display").textContent = username;
document.getElementById("current-date").textContent = getCurrentDate();

// Function to get the current date
function getCurrentDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

// Function to generate the calendar for the current month
function generateCalendar() {
    const calendarContainer = document.getElementById("calendar");
    const date = new Date();
    const month = date.getMonth(); // Current month
    const year = date.getFullYear(); // Current year

    // Get the first day of the month and the total number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0); // Last day of the month
    const totalDays = lastDay.getDate();
    const firstDayWeekday = firstDay.getDay(); // Day of the week for the 1st of the month

    // Display the month and year
    calendarContainer.innerHTML = `<h3>${date.toLocaleString('default', { month: 'long' })} ${year}</h3>`;

    // Create the table for the calendar
    let calendarHtml = "<table><tr>";

    // Add weekday headers
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(day => {
        calendarHtml += `<th>${day}</th>`;
    });
    calendarHtml += "</tr><tr>";

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayWeekday; i++) {
        calendarHtml += "<td></td>";
    }

    // Add the actual days of the month
    for (let i = 1; i <= totalDays; i++) {
        if ((firstDayWeekday + i - 1) % 7 === 0 && i !== 1) {
            calendarHtml += "</tr><tr>"; // Start a new row at the beginning of a new week
        }

        // Highlight the special days (e.g. weekends)
        let isSpecialDay = isSpecialDate(year, month + 1, i); // Check for special dates

        calendarHtml += `<td class="calendar-day ${isSpecialDay ? 'special-day' : ''}" onclick="openDiaryEntry(${i})">${i}</td>`;
    }
    calendarHtml += "</tr></table>";

    calendarContainer.innerHTML += calendarHtml;
}

// Function to check if a date is a special day (e.g. weekends, holidays)
function isSpecialDate(year, month, day) {
    const specialDays = [
        { month: 1, day: 1, name: 'New Year' }, // New Year's Day (Jan 1)
        { month: 12, day: 25, name: 'Christmas' } // Christmas Day (Dec 25)
        // Add other special days here
    ];

    return specialDays.some(d => d.month === month && d.day === day);
}

// Function to open the diary entry for the clicked day
function openDiaryEntry(day) {
    const selectedDate = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Show the selected date
    document.getElementById("selected-date-heading").textContent = `Diary for ${selectedDate}`;
    
    // Load existing entry for the selected day (if any)
    const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    const existingEntry = entries.find(entry => entry.date === selectedDate);

    // If an entry exists for this day, display it
    if (existingEntry) {
        document.getElementById("diary-entry").value = existingEntry.entry;

        // Display photo if available
        if (existingEntry.photo) {
            const photoElement = document.createElement('img');
            photoElement.src = existingEntry.photo;
            photoElement.classList.add('diary-photo');
            document.getElementById("diary-entry-section").appendChild(photoElement);
        }

        // Display video if available
        if (existingEntry.video) {
            const videoElement = document.createElement('video');
            videoElement.src = existingEntry.video;
            videoElement.controls = true;
            document.getElementById("diary-entry-section").appendChild(videoElement);
        }
    } else {
        document.getElementById("diary-entry").value = ''; // Clear the input if no entry exists
    }

    // Save the entry for this day
    document.getElementById("save-entry").onclick = function() {
        saveDiaryEntry(day, selectedDate);
    };
}

// Function to save the diary entry for the selected day
function saveDiaryEntry(day, selectedDate) {
    const entry = document.getElementById("diary-entry").value;
    const photoInput = document.getElementById("photo-upload");
    const videoInput = document.getElementById("video-upload");
    const photoFile = photoInput.files[0];
    const videoFile = videoInput.files[0];

    if (entry.trim() === "") {
        alert("Please write something in your diary.");
        return;
    }

    // Convert photo and video to base64 if files are uploaded
    let photoBase64 = null;
    let videoBase64 = null;

    if (photoFile) {
        const reader = new FileReader();
        reader.onloadend = function () {
            photoBase64 = reader.result;
            saveEntryToLocalStorage(selectedDate, entry, photoBase64, videoBase64);
        };
        reader.readAsDataURL(photoFile); // Convert photo to base64
    } else if (videoFile) {
        const reader = new FileReader();
        reader.onloadend = function () {
            videoBase64 = reader.result;
            saveEntryToLocalStorage(selectedDate, entry, photoBase64, videoBase64);
        };
        reader.readAsDataURL(videoFile); // Convert video to base64
    } else {
        saveEntryToLocalStorage(selectedDate, entry, null, null);
    }
}

// Function to save the diary entry to localStorage
function saveEntryToLocalStorage(date, entry, photo, video) {
    let entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    const existingIndex = entries.findIndex(e => e.date === date);

    if (existingIndex !== -1) {
        // Update the existing entry for this day
        entries[existingIndex] = { date, entry, photo, video };
    } else {
        // Add a new entry for this day
        entries.push({ date, entry, photo, video });
    }

    // Save updated entries to localStorage
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
    alert("Diary entry saved!");
}

// Logout functionality
document.getElementById("logout").addEventListener("click", function () {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("username");
    window.location.href = "index.html"; // Redirect to login page
});

// Initial call to generate the calendar when the page loads
generateCalendar();
