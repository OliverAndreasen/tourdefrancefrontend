import {handleHttpErrors, sanitizeStringWithTableRows} from "../../utils.js";

const riderUrl = "http://localhost:8080/api/riders";
const raceUrl = "http://localhost:8080/api/races/";

export function initRace() {
    displayRace();

}

//console.log(await getRace());

let race = [];
let riders = [];


async function getRace() {
    const id = window.location.href.split("=").splice(-1)[0];
    try {
        const response = await fetch(raceUrl + id);
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


async function displayRace() {
    const raceHeader = document.querySelector("#race-header");

    //create an key value pair of riderId and riderTime
    const riderIdAndTime = new Map();

    await getRace().then(race => {
        raceHeader.innerHTML = race.name
        const raceTimes = race.raceTimes;
        for (let i = 0; raceTimes.length > i; i++) {
            riderIdAndTime.set(raceTimes[i].riderId, raceTimes[i].riderTime);
        }
        const riderIds = Array.from(riderIdAndTime.keys());

        getRidersByIds(riderIds).then(riders => {
            riders = riders.map(rider => addTimeToRider(rider, riderIdAndTime.get(rider.id)));
            riders = sortRidersByTime(riders);
            riders = addPlacementToRiders(riders);
            displayRiders(riders);
        })
    })


}

//get rider with specific ids and return them in an array
async function getRidersByIds(riderIds) {
    const riders = await getRiders();
    const filteredRiders = riders.filter(rider => riderIds.includes(rider.id));
    return filteredRiders;
}


function splitTime(time) {
    return time.split("T")[1].split(".")[0];
}


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

function displayRiders(riders) {
    const rows = riders.map(
        (rider) => `
    <tr>
        <td>${rider.placement}</td>
        <td>${rider.firstname}</td>
        <td>${rider.lastname}</td>
        <td>${rider.age}</td>
        <td>${splitTime(rider.time)}</td>
    </tr>
    `)
    const tableString = rows.join("\n")
    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(tableString);
}

