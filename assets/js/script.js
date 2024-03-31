//Selectors
const startDateEl = $("#start-date");
const endDateEl = $("#end-date");
const welcomeEl = $("#no-data");
const dashboardEl = $("#trip-inner");

//Load dayjs relative time plugin
dayjs.extend(window.dayjs_plugin_relativeTime);
const API_KEY = "57693c20cc9de93006be32fd645ff9bb";


//Get users from local storage
const getLocalUsers = () => {
    const users = JSON.parse(localStorage.getItem("users"));
    return users;
};

const addUsers = (newUserDetails) => {
    let users = getLocalUsers();

    //check if anything saved in local
    if (users === null) {
        //New user object 
        users = localStorage.setItem("users", JSON.stringify([newUserDetails]));
    } else if (Array.isArray(users)) {
        let userArr = users;
        userArr.push(newUserDetails);
        localStorage.setItem("users", JSON.stringify(userArr));
    }
};

const addTrip = () => { };

//Find if any data in local storage
const data = localStorage.getItem("trips");
if (data === null) {
    $("#no-data").removeClass("hidden");
} else {
    $("#data").removeClass("hidden");
    $("#no-data").addClass("hidden");
}

//Calculate time from now until trip start date
const calculateCountdown = (start) => {
    const today = new Date;
    const startDate = dayjs(start);
    let countdown = dayjs(today).to(startDate, true)
    return countdown;
}

const getCoordinates = async (city) => {
    let cityName = city.toLowerCase();
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(geoUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let coordinates = {
                lat: data[0].lat,
                lon: data[0].lon
            }
            return coordinates;
        });
};

// //Get the weather data from API
// const getWeather = (lat, lon) => {
//   if (lat !== undefined && lon !== undefined) {
//     let icon;
//     const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
//      fetch(weatherUrl, {
//       mode: "cors",
//     })
//       .then(function (res) {
//         return res.json();
//       })
//       .then(function (data) {
//         citySearch = data.city.name;
//         icon = data.list[0].weather[0].icon;
//         return icon;
//       });

//   }
// };



//Dashboard - creating the cards
const getLocalTrips = () => {
    let savedTrips = JSON.parse(localStorage.getItem("trips"));
    let icons;

    if (savedTrips !== null) {
        savedTrips.map(async trip => {
            let countdownTime = calculateCountdown(trip.start)
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${trip.location}&limit=1&appid=${API_KEY}`;
            let getIcon = await fetch(geoUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    return Promise.all(data.map(item => {
                        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${item.lat}&lon=${item.lon}&units=metric&appid=${API_KEY}`)
                            .then(function (data) {
                                return data.json()
                            })
                    }));
                }).then(function (data) {
                    let icon = data[0].list[0].weather[0].icon;
                    icons = icon
                    return icon
                })

            console.log(getIcon)

            if (getIcon !== undefined) {
                const card = $("<div></div>").addClass("card");
                const header = $('<header></header>').addClass("card-header fixed-grid has-5-cols")
                const grid = $('<div></div>').addClass("grid");
                const name = $('<p></p>').addClass("cell card-header-title").text(trip.tripName);
                const location = $('<p></p>').addClass("cell card-header-title").text(trip.location);
                const countdown = $('<p></p>').addClass("cell card-header-title").text(countdownTime);
                const weather = $('<img />').addClass("cell card-header-title").attr("src", `https://openweathermap.org/img/w/${getIcon}.png`)
                const downButton = $('<button></button>').addClass("card-header-icon").attr("id", "accordion");
                const span = $('<span></span>').addClass("icons");
                const icon = $('<i></i>').addClass("fas fa-angle-down has-text-black").attr("id", "accordion-icon");
                span.append(icon)
                downButton.append(span)
                grid.append(name, location, countdown, weather, downButton)
                header.append(grid)
                card.append(header)
                dashboardEl.append(card)

            }
        })
    }
};

getLocalTrips();



//Dashboard - opening the accordion dropdown
$(".card-header-icon").on("click", (e) => {
    console.log(e);
});




//Add User Code Starts - Shweta


const userFirstNameEl = $("#first-name");
const userLastNameEl = $("#last-name");
const userDateOfBirthEl = $("#user-dob");
const userAddressEl = $("#user-address");
const allFields = $([]).add(userFirstNameEl).add(userLastNameEl).add(userDateOfBirthEl).add(userAddressEl);
const userErrMsgEl = $(".validateTips");
const userSuccessMsgEl = $(".successMsg");





function updateErrMsg(errMsg) {
    console.log(errMsg);
    userErrMsgEl
        .text(errMsg)
        .addClass("ui-state-highlight");
    setTimeout(function () {
        userErrMsgEl.removeClass("ui-state-highlight", 1500);
    }, 500);
}

function checkLength(textInput, fieldName) {

    if (textInput.val() == "") {
        console.log("hiiiiiii" + textInput.val());
        textInput.addClass("ui-state-error");
        updateErrMsg(fieldName + " is required.");
        return false;
    } else if (textInput.val() == " ") {
        textInput.addClass("ui-state-error");
        updateErrMsg(fieldName + " must be valid");
        return false;

    } else {
        return true;
    }
}

function addUser() {

    // add code to validate and add user to local storage
    console.log("In addUser function");

    var valid = true;
    var isMinorAge = false;
    allFields.removeClass("ui-state-error");
    console.log(userFirstNameEl.val());
    valid = valid && checkLength(userFirstNameEl, "First Name");
    valid = valid && checkLength(userLastNameEl, "Last Name");
    valid = valid && checkLength(userDateOfBirthEl, "Date of birth");
    valid = valid && checkLength(userAddressEl, "Address");

    if (valid) {
        console.log("All form validations successful");
        // age calc


        const currentDate = dayjs(); // Current date

        console.log(currentDate);
        console.log(userDateOfBirthEl.val());

        // Calculate the difference in years
        const ageInYears = currentDate.diff(userDateOfBirthEl.val(), 'year');

        if (ageInYears < 18) {
            isMinorAge = true;
        }

        console.log(`The person's age is approximately ${ageInYears} years.`);


        const newUserToCreate = {
            userid: crypto.randomUUID(),
            firstname: userFirstNameEl.val(),
            lastname: userLastNameEl.val(),
            dateofbirth: userDateOfBirthEl.val(),
            address: userAddressEl.val(),
            isminor: isMinorAge,
        };

        addUsers(newUserToCreate);

        dialog.dialog("close");
    }
    return valid;
}


$("#add-user").button().on("click", function () {
    console.log("In event listener to open create user dialog");
    dialog.dialog("open");
});


var dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 500,
    width: 500,
    modal: true,
    buttons: {
        Submit: addUser,
        Cancel: function () {
            console.log("In Cancel function");
            dialog.dialog("close");
        }
    },
    close: function () {
        //add code to reset the form fields
        console.log("In close function");
        console.log(userform[0]);
        userform[0].reset();
        allFields.removeClass("ui-state-error");

        userErrMsgEl.text("All form fields are required.");
        userSuccessMsgEl.attr("display", "block");


    }
});

var userform = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    addUser();
});


// When the page loads make the  date field a date picker
$(document).ready(function () {
    //datepicker initialization (jQueryUI)
    $('#user-dob').datepicker({
        changeMonth: true,
        changeYear: true,
    });
});





//Add User Code Ends 