// =============================================
// ROOM DETAILS
// =============================================
const rooms = [
    { name: "Standard Double Room", price: 1500 },
    { name: "Executive AC Suite", price: 2500 },
    { name: "VIP Suite", price: 4000 }
];

const roomList = document.getElementById("room-list");
const roomSelect = document.getElementById("room-type");

// Populate the dropdown menu
rooms.forEach((room, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = room.name;
    roomSelect.appendChild(option);
});

// When a room card's Book link is clicked, select that room in the form
roomList.addEventListener("click", function(event) {
    const link = event.target.closest("[data-room]");
    if (link) {
        roomSelect.value = link.dataset.room;
        calculatePrice();
    }
});

const checkIn = document.getElementById("check-in");
const checkOut = document.getElementById("check-out");
const mealPlan = document.getElementById("meal-plan");

function calculatePrice() {
    const start = checkIn.value ? new Date(checkIn.value + "T00:00:00") : null;
    const end = checkOut.value ? new Date(checkOut.value + "T00:00:00") : null;

    let nights = 0;
    if (start && end && end > start) {
        nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
    }

    const selectedRoom = rooms[Number(roomSelect.value)];
    const roomCost = selectedRoom ? selectedRoom.price * nights : 0;
    
    let mealCost = 0;
    if (mealPlan.value === "one-time") {
        mealCost = nights > 0 ? 150 : 0;
    } else {
        mealCost = Number(mealPlan.value) * nights;
    }
    
    const total = roomCost + mealCost;

    document.getElementById("night-count").textContent = nights;
    document.getElementById("room-charge").textContent = "₹" + roomCost.toLocaleString("en-IN");
    document.getElementById("meal-charge").textContent = "₹" + mealCost.toLocaleString("en-IN");
    document.getElementById("total-charge").textContent = "₹" + total.toLocaleString("en-IN");
}

checkIn.addEventListener("change", function() {
    checkOut.min = checkIn.value;
    calculatePrice();
});
checkOut.addEventListener("change", calculatePrice);
roomSelect.addEventListener("change", calculatePrice);
mealPlan.addEventListener("change", calculatePrice);

// Set today's date as the earliest check-in date
const today = new Date();
const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");
checkIn.min = todayString;
checkOut.min = todayString;

// =============================================
// SIMPLE AVAILABILITY CALENDAR
// =============================================
const bookedDates = [
    "2026-11-10",
    "2026-11-11",
    "2026-11-18",
    "2026-11-22",
    "2026-12-05"
];

let calendarDate = new Date();

function drawCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    document.getElementById("month-year").textContent =
        calendarDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    const calendar = document.getElementById("calendar-days");
    calendar.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day empty";
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= numberOfDays; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const cell = document.createElement("div");
        cell.className = "day";
        cell.textContent = day;

        if (bookedDates.includes(dateKey)) {
            cell.classList.add("booked");
            cell.title = "Booked";
        } else {
            cell.title = "Available";
        }
        calendar.appendChild(cell);
    }
}

document.getElementById("prev-month").addEventListener("click", function() {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    drawCalendar();
});

document.getElementById("next-month").addEventListener("click", function() {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    drawCalendar();
});

drawCalendar();

// =============================================
// BOOKING FORM
// =============================================
document.getElementById("booking-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const parentName = document.getElementById("parent-name").value.trim();
    const rollNumber = document.getElementById("roll-number").value.trim();
    const idType = document.getElementById("id-type").value;
    const idDetails = document.getElementById("id-number").value.trim();

    if (!parentName || !rollNumber || !idType || !idDetails) {
        document.getElementById("booking-message").textContent =
            "Please complete all required fields.";
        return;
    }

    if (!checkIn.value || !checkOut.value || new Date(checkOut.value) <= new Date(checkIn.value)) {
        document.getElementById("booking-message").textContent =
            "Please select a valid check-in and check-out date.";
        return;
    }

    const message = `Thank you, ${parentName}! Your demo booking request has been recorded on this page. This is not a confirmed reservation.`;
    document.getElementById("booking-message").textContent = message;
});

// =============================================
// ASSISTANCE BUTTON
// =============================================
const assistanceButton = document.getElementById("assistance-button");
if (assistanceButton) {
    assistanceButton.addEventListener("click", function () {
        alert("The official guest-house phone number has not been added yet.");
    });
}

// =============================================
// LOGIN MODAL LOGIC
// =============================================
const loginNavBtn = document.getElementById("login-nav-btn");
const loginModal = document.getElementById("login-modal");
const closeLoginBtn = document.getElementById("close-login");

const role = document.getElementById("user-role");
const studentUidField = document.getElementById("student-uid-field");
const parentMobileField = document.getElementById("parent-mobile-field");
const studentUid = document.getElementById("student-uid");
const parentMobile = document.getElementById("parent-mobile");

loginNavBtn.addEventListener("click", function(e) {
    e.preventDefault();
    loginModal.classList.add("active");
});

closeLoginBtn.addEventListener("click", function() {
    loginModal.classList.remove("active");
});

window.addEventListener("click", function(event) {
    if (event.target === loginModal) {
        loginModal.classList.remove("active");
    }
});

role.addEventListener("change", function() {
    const isParent = role.value === "parent";
    parentMobileField.hidden = !isParent;
    parentMobile.required = isParent;
    studentUidField.querySelector("label").textContent =
        isParent ? "Student UID (whose parent is booking)" : "Student UID";
});

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const userType = role.value === "parent" ? "Parent" : "Student";
    document.getElementById("login-message").textContent =
        userType + " demo login successful! You can now return to the booking page.";
    
    setTimeout(() => {
        loginModal.classList.remove("active");
        document.getElementById("login-message").textContent = "";
        document.getElementById("login-form").reset();
        parentMobileField.hidden = true;
        parentMobile.required = false;
        studentUidField.querySelector("label").textContent = "Student UID";
    }, 2000);
});