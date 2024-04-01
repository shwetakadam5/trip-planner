//Selectors
const startDateEl = $("#start-date");
const endDateEl = $("#end-date");
const welcomeEl = $("#no-data");
const dashboardEl = $("#trip-inner");

//Load dayjs relative time plugin
dayjs.extend(window.dayjs_plugin_relativeTime);
const API_KEY = "6afdca3269d40e485ee98de1af3ed1db";


//Function to get users from local storage
const getLocalUsers = () => {
    const users = JSON.parse(localStorage.getItem("users"));
    return users;
};


//Function to save the users to the local storage.

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

const API_KEY_GEO = "6afdca3269d40e485ee98de1af3ed1db";
const API_KEY_MAPS = "AIzaSyB9ViKmP3YhPiC9Mqz6jdr9Rio9MrtItaE";
const userFirstNameEl = $("#first-name");
const userLastNameEl = $("#last-name");
const userDateOfBirthEl = $("#user-dob");
const userAddressEl = $("#user-address");
const userCityEl = $("#user-city");
const userCountryEl = $("#user-country");
const userZipCodeEl = $("#user-zipcode");

const allFields = $([]).add(userFirstNameEl).add(userLastNameEl).add(userDateOfBirthEl).add(userAddressEl).add(userCityEl).add(userCountryEl).add(userZipCodeEl);
const userErrMsgEl = $(".validateTips");
const userSuccessMsgEl = $(".successMsg");
const MINOR_AGE_LIMIT = 12;


//Function to update the error message and highlight the fields
function updateErrorMsg(errMsg) {

    userErrMsgEl
        .text(errMsg)
        .addClass("ui-state-highlight");
    setTimeout(function () {
        userErrMsgEl.removeClass("ui-state-highlight", 1500);
    }, 500);

}


//Function to validate the input fields of the user
function checkLength(textInput, fieldName) {

    if (textInput.val() == "") {

        textInput.addClass("ui-state-error");
        updateErrorMsg(fieldName + " is required.");
        return false;

    } else if (textInput.val() == " ") {

        textInput.addClass("ui-state-error");
        updateErrorMsg(fieldName + " must be valid");
        return false;

    } else {

        return true;

    }
}


//Function to add a user. This function validates the input fields and stores the validated details in local storage
// It also updates the coordinates for the city by invoking the weather api and provides a user age check parameter. 

function addUser() {

    // add code to validate and add user to local storage  

    let valid = true;
    let isMinorAge = false;
    const redirectUrl = './servererrorpage.html';
    allFields.removeClass("ui-state-error");
    valid = valid && checkLength(userFirstNameEl, "First Name");
    valid = valid && checkLength(userLastNameEl, "Last Name");
    valid = valid && checkLength(userDateOfBirthEl, "Date of birth");
    valid = valid && checkLength(userAddressEl, "Address");
    valid = valid && checkLength(userCityEl, "City");
    valid = valid && checkLength(userCountryEl, "Country");
    valid = valid && checkLength(userZipCodeEl, "Zip Code");


    if (valid) {
        console.log("All form validations successful");

        // Validate the age and update if user is a minor.
        const currentDate = dayjs();

        // Calculate the difference in years
        const ageInYears = currentDate.diff(userDateOfBirthEl.val(), 'year');

        if (ageInYears < MINOR_AGE_LIMIT) {
            isMinorAge = true;
        }

        console.log(`The person's age is approximately ${ageInYears} years and is minor check: ${isMinorAge}`);


        let newUserToCreate = {
            userid: crypto.randomUUID(),
            firstname: userFirstNameEl.val(),
            lastname: userLastNameEl.val(),
            dateofbirth: userDateOfBirthEl.val(),
            address: userAddressEl.val(),
            usercity: userCityEl.val(),
            usercountry: userCountryEl.val(),
            userzipcode: userZipCodeEl.val(),
            isminor: isMinorAge,
            userlocationcoordinates: {
                lat: "",
                lon: "",
            },
        };

        //start to get location coords
        if (userCityEl.val().trim() != "") {
            let cityName = userCityEl.val().toLowerCase();
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY_GEO}`;
            fetch(geoUrl)
                .then(function (response) {

                    if (!response.ok) {
                        alert(`Error Msg: ${response.statusText}. Redirecting to error page.`);
                        location.href = (redirectUrl);
                    } else {
                        return response.json();
                    }
                })
                .then(function (data) {
                    if (!Object.keys(data).length) {
                        console.log('No data found');
                        alert(`Error Msg: No data found :Invalid city. Redirecting to error page.`);
                        location.href = (redirectUrl);
                    } else {
                        console.log('Data received:', data);


                        let coordinates = {
                            lat: data[0].lat,
                            lon: data[0].lon
                        }
                        newUserToCreate.userlocationcoordinates.lat = coordinates.lat;
                        newUserToCreate.userlocationcoordinates.lon = coordinates.lon;

                        addUsers(newUserToCreate); // Stores data in local storage.
                        initMap(); // Invoked to create user location markers on the map.
                        dialog.dialog("close");
                    }
                });
        }
        //end to get location coords
    }
    return valid;
}

// Event listerner to open the create user modal dialog
$("#add-user").button().on("click", function () {

    dialog.dialog("open");
});


let dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 525,
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
        userform[0].reset();
        allFields.removeClass("ui-state-error");

        userErrMsgEl.text("All form fields are required."); //reset the user form
        userSuccessMsgEl.attr("display", "block");

    }
});

// Event to identify if the submit of user form was clicked.
let userform = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    addUser();
});


// When the page loads make the  date field a date picker and also initialize the map
$(document).ready(function () {

    initMap();
    //datepicker initialization (jQueryUI)
    $('#user-dob').datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+0",
        maxDate: '0',
    });

});


// Logic to display the map and map markers.

let map;
// initMap is now async
async function initMap() {

    console.log("INIT MAP INVOKED")

    let addedUsers = getLocalUsers(); //retrieve the users from localstorage

    // Request libraries when needed, not in the script tag.
    let { Map } = await google.maps.importLibrary("maps");
    let { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Short namespaces can be used.
    map = new Map(document.getElementById("map"), {
        center: new google.maps.LatLng(-37.81400000, 144.96332000),
        zoom: 6,
        mapId: "DEMO_MAP_ID",
    });

    if (addedUsers != null) {
        for (const user of addedUsers) {
            addMapMarkers({
                locationcoords: new google.maps.LatLng(user.userlocationcoordinates.lat, user.userlocationcoordinates.lon),
                //markerimg: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                // titleTxt: user.firstname,
                markerInfo: "Info ( User Name : " + user.firstname + " " + user.lastname + " & City : " + user.usercity + " )",
            });
        }

        //function to add markers 
        function addMapMarkers(markerDetails) {
            // A marker with a with a URL pointing to a PNG.
            let markerImage;
            let markerInformation = document.createElement("p")
            markerInformation.textContent = markerDetails.markerInfo;

            //if no custom marker image then default marker pin
            if (markerDetails.markerimg != null || markerDetails.markerimg != undefined) {
                markerImage = document.createElement("img");
                markerImage.src =
                    markerDetails.markerimg;
            }

            //create new marker and set the marker parameters.
            let marker = new AdvancedMarkerElement({
                map,
                position: markerDetails.locationcoords,
                content: markerImage,
                title: markerDetails.titleTxt,
            });

            //create new marker information window and set the marker info parameters.
            let markerInfo = new google.maps.InfoWindow({
                content: markerInformation,
            });

            // create an event listener for the info window to open
            marker.addListener('click', function () {
                markerInfo.open(map, marker);
            });


        }
    }

}

// Maps API invocation
(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
    key: API_KEY_MAPS,
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
});