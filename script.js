
/* =========================
   JAVASCRIPT PART 1
   HABIT MANAGEMENT
   ========================= */

// Get HTML elements
const habitForm = document.getElementById("habit-form");
const habitInput = document.getElementById("habit-input");
const habitCategory = document.getElementById("habit-category");
const habitList = document.getElementById("habit-list");

// Load saved habits from LocalStorage
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Save habits in LocalStorage
function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

// Display habits on the website
function displayHabits() {

    habitList.innerHTML = "";

    habits.forEach(function(habit) {

        const habitItem = document.createElement("div");
        habitItem.className = "habit-item";

        if (habit.completed) {
            habitItem.classList.add("completed");
        }

        // Habit checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = wasCompletedOn(habit, getTodayDate());

        // Habit name and category
        const habitName = document.createElement("span");
        habitName.textContent =
            habit.name + " (" + habit.category + ")";

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
      checkbox.addEventListener("change", function() {

    const today = getTodayDate();

    habit.completedDates = habit.completedDates || [];

    habit.completed = checkbox.checked;

    if (checkbox.checked) {

        if (!habit.completedDates.includes(today)) {
            habit.completedDates.push(today);
        }

    } else {

        habit.completedDates =
            habit.completedDates.filter(date => date !== today);

    }

    saveHabits();
    displayHabits();

});

        // Delete habit
        deleteButton.addEventListener("click", function() {

            habits = habits.filter(function(item) {
                return item.id !== habit.id;
            });

            saveHabits();
            displayHabits();

        });

        // Add elements to habit card
        habitItem.appendChild(checkbox);
        habitItem.appendChild(habitName);
        habitItem.appendChild(deleteButton);

        habitList.appendChild(habitItem);

    });

    updateHabitStats();
}

// Add a new habit
habitForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const habitName = habitInput.value.trim();
    const category = habitCategory.value;

    if (habitName === "") {
        alert("Please enter a habit!");
        return;
    }

    const newHabit = {
        id: Date.now(),
        name: habitName,
        category: category,
        completed: false
    };

    habits.push(newHabit);

    saveHabits();

    displayHabits();

    habitInput.value = "";

});

// Update habit statistics
function updateHabitStats() {

    const total = habits.length;

    const completed = habits.filter(function(habit) {
        return habit.completed;
    }).length;

    const pending = total - completed;

    document.getElementById("total-habits").textContent = total;

    document.getElementById("completed-habits").textContent = completed;

    document.getElementById("pending-habits").textContent = pending;
}

// Display saved habits when website opens
displayHabits();

/* =========================
   JAVASCRIPT PART 2
   PROGRESS TRACKING
   ========================= */

// Get today's date
function getTodayDate() {

    return new Date().toLocaleDateString("en-CA");

}


// Check whether a habit was completed on a date
function wasCompletedOn(habit, date) {

    return (habit.completedDates || []).includes(date);

}


// Update habit statistics and progress
function updateHabitStats() {

    const today = getTodayDate();

    const total = habits.length;

    const completed = habits.filter(function(habit) {
        return wasCompletedOn(habit, today);
    }).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);


    // Update statistics
    document.getElementById("total-habits").textContent = total;

    document.getElementById("completed-habits").textContent = completed;

    document.getElementById("pending-habits").textContent = pending;


    // Update progress percentage
    document.getElementById("progress-percentage").textContent =
        percentage + "%";

    document.getElementById("progress-fill").style.width =
        percentage + "%";


    // Progress message
    const message = document.getElementById("progress-message");

    if (percentage === 100 && total > 0) {
        message.textContent = "Amazing! All habits completed today!";
    } else if (percentage >= 50) {
        message.textContent = "Great work! Keep going!";
    } else {
        message.textContent = "Keep working towards your goals!";
    }


    // Update other progress sections
    updateWeeklyProgress();
    updateCurrentStreak();
}


// Display weekly progress
function updateWeeklyProgress() {

    const weeklyContainer =
        document.getElementById("weekly-progress");

    weeklyContainer.innerHTML = "";

    const today = new Date();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Show the last 7 days
    for (let i = 6; i >= 0; i--) {

        const date = new Date(today);

        date.setDate(today.getDate() - i);

        const dateString = date.toLocaleDateString("en-CA");

        const completedCount = habits.filter(function(habit) {
            return wasCompletedOn(habit, dateString);
        }).length;

        const total = habits.length;

        const dayBox = document.createElement("div");

        dayBox.className = "weekly-day";

        dayBox.innerHTML = `
            <strong>${days[date.getDay()]}</strong>
            <p>${completedCount}/${total}</p>
            <small>Completed</small>
        `;

        weeklyContainer.appendChild(dayBox);

    }

}


// Calculate current streak
function updateCurrentStreak() {

    const streakElement =
        document.getElementById("current-streak");

    let streak = 0;

    const today = new Date();

    // Count consecutive days with at least one completed habit
    for (let i = 0; i < 365; i++) {

        const date = new Date(today);

        date.setDate(today.getDate() - i);

        const dateString = date.toLocaleDateString("en-CA");

        const hasCompleted = habits.some(function(habit) {
            return wasCompletedOn(habit, dateString);
        });

        if (hasCompleted) {
            streak++;
        } else {
            break;
        }

    }

    streakElement.textContent = streak;
updateCalendar();
updateAnalytics();
drawProgressChart();
}


// Run progress functions when website opens
updateHabitStats();

/* =========================
   JAVASCRIPT PART 3
   FINAL WEBSITE FEATURES
   ========================= */

// 1. DISPLAY CURRENT DATE

function displayCurrentDate() {

    const dateElement = document.getElementById("current-date");

    dateElement.textContent = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}


// 2. CALENDAR

let calendarDate = new Date();

function updateCalendar() {

    const calendarGrid = document.getElementById("calendar-grid");
    const monthElement = document.getElementById("calendar-month");

    if (!calendarGrid || !monthElement) return;

    calendarGrid.innerHTML = "";

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    monthElement.textContent = calendarDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    weekdays.forEach(function(day) {

        const heading = document.createElement("div");
        heading.className = "calendar-day";
        heading.textContent = day;

        calendarGrid.appendChild(heading);

    });

    // Empty spaces before the first date
    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("div");
        calendarGrid.appendChild(empty);

    }

    const today = getTodayDate();

    for (let day = 1; day <= totalDays; day++) {

        const date = new Date(year, month, day);
        const dateString = date.toLocaleDateString("en-CA");

        const completedCount = habits.filter(function(habit) {
            return wasCompletedOn(habit, dateString);
        }).length;

        const dayBox = document.createElement("div");

        dayBox.className = "calendar-day";

        if (dateString === today) {
            dayBox.classList.add("today");
        }

        if (completedCount > 0) {
            dayBox.classList.add("completed");
        }

        dayBox.innerHTML = `
            <strong>${day}</strong>
            <br>
            <small>${completedCount} done</small>
        `;

        calendarGrid.appendChild(dayBox);

    }

}


// Previous month button
document.getElementById("prev-month").addEventListener("click", function() {

    calendarDate.setMonth(calendarDate.getMonth() - 1);
    updateCalendar();

});


// Next month button
document.getElementById("next-month").addEventListener("click", function() {

    calendarDate.setMonth(calendarDate.getMonth() + 1);
    updateCalendar();

});


// 3. PROGRESS ANALYTICS

function updateAnalytics() {

    const today = new Date();

    let weeklyCompleted = 0;
    let weeklyPossible = 0;

    let monthlyCompleted = 0;
    let monthlyPossible = 0;

    // Weekly progress
    for (let i = 0; i < 7; i++) {

        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateString = date.toLocaleDateString("en-CA");

        habits.forEach(function(habit) {

            weeklyPossible++;

            if (wasCompletedOn(habit, dateString)) {
                weeklyCompleted++;
            }

        });

    }

    // Monthly progress (up to today)
    for (let day = 1; day <= today.getDate(); day++) {

        const date = new Date(
            today.getFullYear(),
            today.getMonth(),
            day
        );

        const dateString = date.toLocaleDateString("en-CA");

        habits.forEach(function(habit) {

            monthlyPossible++;

            if (wasCompletedOn(habit, dateString)) {
                monthlyCompleted++;
            }

        });

    }

    const weeklyPercentage = weeklyPossible === 0
        ? 0
        : Math.round((weeklyCompleted / weeklyPossible) * 100);

    const monthlyPercentage = monthlyPossible === 0
        ? 0
        : Math.round((monthlyCompleted / monthlyPossible) * 100);


    document.getElementById("weekly-percentage").textContent =
        weeklyPercentage + "%";

    document.getElementById("monthly-percentage").textContent =
        monthlyPercentage + "%";

    document.getElementById("best-streak").textContent =
        calculateBestStreak();

}


// 4. CALCULATE BEST STREAK

function calculateBestStreak() {

    let bestStreak = 0;
    let currentStreak = 0;

    const today = new Date();

    for (let i = 364; i >= 0; i--) {

        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateString = date.toLocaleDateString("en-CA");

        const completed = habits.some(function(habit) {
            return wasCompletedOn(habit, dateString);
        });

        if (completed) {

            currentStreak++;

            bestStreak = Math.max(bestStreak, currentStreak);

        } else {

            currentStreak = 0;

        }

    }

    return bestStreak;

}


// 5. WEEKLY PROGRESS CHART

function drawProgressChart() {

    const canvas = document.getElementById("progress-chart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const width = canvas.clientWidth;
    const height = 250;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const today = new Date();

    const values = [];
    const labels = [];

    for (let i = 6; i >= 0; i--) {

        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateString = date.toLocaleDateString("en-CA");

        const count = habits.filter(function(habit) {
            return wasCompletedOn(habit, dateString);
        }).length;

        values.push(count);

        labels.push(
            date.toLocaleDateString("en-IN", { weekday: "short" })
        );

    }

    const maxValue = Math.max(...values, 1);
    const barWidth = width / 10;

    values.forEach(function(value, index) {

        const barHeight = (value / maxValue) * 150;

        const x = (index + 1) * (width / 8) - barWidth / 2;
        const y = 185 - barHeight;

        ctx.fillStyle = "#9B78D1";

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 6);
        ctx.fill();

        ctx.fillStyle = "#49366B";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        ctx.fillText(value, x + barWidth / 2, y - 8);

        ctx.fillText(labels[index], x + barWidth / 2, 215);

    });

}


// 6. PROFILE MANAGEMENT

const profileForm = document.getElementById("profile-form");

function loadProfile() {

    const savedProfile = JSON.parse(
        localStorage.getItem("studentProfile")
    ) || {};

    document.getElementById("student-name").value =
        savedProfile.name || "";

    document.getElementById("student-email").value =
        savedProfile.email || "";

    document.getElementById("student-course").value =
        savedProfile.course || "";

}


profileForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const profile = {

        name: document.getElementById("student-name").value,

        email: document.getElementById("student-email").value,

        course: document.getElementById("student-course").value

    };

    localStorage.setItem("studentProfile", JSON.stringify(profile));

    alert("Profile saved successfully!");

});


// 7. DARK MODE

const darkModeCheckbox = document.getElementById("dark-mode");

const darkModeStyle = document.createElement("style");

darkModeStyle.textContent = `
    body.dark-mode {
        background: #171522;
        color: #EEEEF5;
    }

    body.dark-mode .sidebar,
    body.dark-mode .header,
    body.dark-mode .stat-card,
    body.dark-mode .progress-card,
    body.dark-mode .habit-section,
    body.dark-mode .weekly-section,
    body.dark-mode .calendar-section,
    body.dark-mode .progress-section,
    body.dark-mode .profile-section,
    body.dark-mode .settings-section {
        background: #252236;
        border-color: #39334D;
    }

    body.dark-mode h1,
    body.dark-mode h2,
    body.dark-mode h3,
    body.dark-mode p,
    body.dark-mode span {
        color: #EEEEF5;
    }

    body.dark-mode input,
    body.dark-mode select {
        background: #302B43;
        color: white;
        border-color: #51476A;
    }

    body.dark-mode .habit-item,
    body.dark-mode .weekly-day,
    body.dark-mode .progress-box,
    body.dark-mode .calendar-day {
        background: #302B43;
        color: white;
    }
`;

document.head.appendChild(darkModeStyle);


function loadDarkMode() {

    const enabled = localStorage.getItem("darkMode") === "true";

    darkModeCheckbox.checked = enabled;

    document.body.classList.toggle("dark-mode", enabled);

}


darkModeCheckbox.addEventListener("change", function() {

    document.body.classList.toggle(
        "dark-mode",
        darkModeCheckbox.checked
    );

    localStorage.setItem(
        "darkMode",
        darkModeCheckbox.checked
    );

});


// 8. NOTIFICATION PREFERENCE

const notificationCheckbox = document.getElementById("notifications");

notificationCheckbox.checked =
    localStorage.getItem("notifications") === "true";

notificationCheckbox.addEventListener("change", function() {

    localStorage.setItem(
        "notifications",
        notificationCheckbox.checked
    );

});


// 9. START WEBSITE FEATURES

displayCurrentDate();
updateCalendar();
updateAnalytics();
drawProgressChart();
loadProfile();
loadDarkMode();
