import {sanitizeStringWithTableRows} from "../../utils.js";

const riderUrl = "http://localhost:8080/api/riders";
const racesUrl = "http://localhost:8080/api/races";


export function initTour() {
    displayTotalRaceTime();
}

async function getRaces(){
    try {
        const response = await fetch(racesUrl);
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}


async function getRiders() {
    try {
        const response = await fetch(riderUrl);
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function createMapRiderIdAndTotalTime(){
    const riderIdAndTotalTime = new Map();
    const races = await getRaces();

    for (let i = 0; i < races.length; i++) {

        const raceTimes = races[i].raceTimes;

        for (let j = 0; j < raceTimes.length; j++) {

            const riderId = raceTimes[j].riderId
            const riderTime = raceTimes[j].riderTime;

            if (riderIdAndTotalTime.has(riderId)) {

                //Converts the time to a map and adds the time to the map
                const previousTimeString = riderIdAndTotalTime.get(riderId);
                const previousTimeMap = convertTimeStringToMap(previousTimeString);

                //Converts the new time to a map
                let newTimeMap = addTimeToTimeMap(previousTimeMap, riderTime);

                //Checks if the time is higher than 60 and if it is it adds 1 to the next value
                newTimeMap = checkTimeMap(newTimeMap);

                //Checks timeMap for NaN and if it is it sets it to 0
                newTimeMap = checkTimeMapForNaN(newTimeMap);

                //if the time map has NaN as value change it to 0
                const newTimeString = convertTimeMapToTimeString(newTimeMap);

                //Adds the new time to the map with the riderId as key
                riderIdAndTotalTime.set(riderId, newTimeString);
            }
            else{

                //removes the date from the time and converts it to a map
                const time = splitTimeToMap(riderTime);

                //converts map to string
                const timeString = convertTimeMapToTimeString(time);

                //sets the time to the map with the riderId as key
                riderIdAndTotalTime.set(riderId, timeString);
            }
        }
    }
    return riderIdAndTotalTime;
}

async function displayTotalRaceTime(){
    let riderIdAndTotalTime = new Map();
    riderIdAndTotalTime = await createMapRiderIdAndTotalTime();

    let newRiders = [];

    let riders = getRiders().then(rider => {
        //adds the total time to the rider
        newRiders = rider.map(rider => addTimeToRider(rider, riderIdAndTotalTime.get(rider.id)));

        //sorts the riders by time
        newRiders = sortRidersByTime(newRiders);

        //adds placement to the riders
        newRiders = addPlacementToRiders(newRiders);

        //displays the riders
        displayRiders(newRiders);
    })
}


function splitTime(time) {
    return time.split("T")[1].split(".")[0];
}

//use split time and make a map with hour minute and second and return the map
function splitTimeToMap(time) {
    time = splitTime(time);
    const timeArray = time.split(":");
    const timeMap = new Map();
    timeMap.set("hour", timeArray[0]);
    timeMap.set("minute", timeArray[1]);
    timeMap.set("second", timeArray[2]);
    return timeMap;
}


//take the timeMap and add time to it and return the timeMap
function addTimeToTimeMap(timeMap, time) {
const timeToAdd = splitTimeToMap(time);
    const hour = Number(timeMap.get("hour")) + Number(timeToAdd.get("hour"));
    const minute = Number(timeMap.get("minute")) + Number(timeToAdd.get("minute"));
    const second = Number(timeMap.get("second")) + Number(timeToAdd.get("second"));
    timeMap.set("hour", hour);
    timeMap.set("minute", minute);
    timeMap.set("second", second);
    return timeMap;
}

//convert timeMap to timeString and return the timeString
function convertTimeMapToTimeString(timeMap) {
    const hour = timeMap.get("hour");
    const minute = timeMap.get("minute");
    const second = timeMap.get("second");
    return `${hour}:${minute}:${second}`;
}

//convertTimeToMapToTimeString reverse the process of splitTimeToMap
function convertTimeStringToMap(time) {
    const timeArray = time.split(":");
    const timeMap = new Map();
    timeMap.set("hour", timeArray[0]);
    timeMap.set("minute", timeArray[1]);
    timeMap.set("second", timeArray[2]);
    return timeMap;
}


//take timeMap and if the minutes or seconds are higher than 60
// take 60 from it and add 1 to the next value and return the timeMap with the new values
function checkTimeMap(timeMap) {
    let hour = Number(timeMap.get("hour"));
    let minute = Number(timeMap.get("minute"));
    let second = Number(timeMap.get("second"));
    if (second > 60) {
        second -= 60;
        minute += 1;
    }
    if (minute > 60) {
        minute -= 60;
        hour += 1;
    }
    timeMap.set("hour", hour);
    timeMap.set("minute", minute);
    timeMap.set("second", second);
    return timeMap;
}

// if the time is Nan change it to 0 and return the timeMap
function checkTimeMapForNaN(timeMap) {
    let hour = timeMap.get("hour");
    let minute = timeMap.get("minute");
    let second = timeMap.get("second");
    if (isNaN(hour)) {
        hour = 0;
    }
    if (isNaN(minute)) {
        minute = 0;
    }
    if (isNaN(second)) {
        second = 0;
    }
    timeMap.set("hour", hour);
    timeMap.set("minute", minute);
    timeMap.set("second", second);
    return timeMap;
}

//Sorts the riders by time
function sortRidersByTime(riders) {
    const sortedRiders = riders.sort((a, b) => {
        return a.time > b.time ? 1 : -1;
    })
    return sortedRiders;
}



//add time to rider object and return the rider object
function addTimeToRider(rider, time) {
    return {firstname: rider.firstname,
        lastname: rider.lastname,
        age: rider.age,
        time: time};
}

//give riders a placement based on their time to the array of riders and return the array of riders with placement added
function addPlacementToRiders(riders) {
    let placement = 1;
    riders.forEach(rider => {
        rider.placement = placement;
        placement++;
    })
    return riders;
}

//Display the riders in the table from the array of riders
function displayRiders(riders) {
    const rows = riders.map(
        (rider) => `
    <tr>
        <td>${rider.placement}</td>
        <td>${rider.firstname}</td>
        <td>${rider.lastname}</td>
        <td>${rider.age}</td>
        <td>${rider.time}</td>
    </tr>
    `)
    const tableString = rows.join("\n")
    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(tableString);
}

