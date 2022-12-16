import { paginator } from "../../lib/paginator/paginate-bootstrap.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const url = "http://localhost:8080/api/riders";
const deleteUrl = "http://localhost:8080/api/riders/delete/";

export function initRiders(){
    load;
    getRiders()
}

let riders = [];
const navigoRoute = "riders"

const SIZE = 3;
const TOTAL_RECORDS = 15;
const TOTAL = Math.ceil(TOTAL_RECORDS / SIZE);

let sortField;
let sortOrder = "desc";

let initialized = false;

function handleSort(pageNo, match) {
    sortOrder = sortOrder == "asc" ? "desc" : "asc";
    sortField = "age";
    load(pageNo, match);
}

async function getRiders(){
    try {
        const ridersList = await fetch(url).then(handleHttpErrors);
    } catch (e) {
        console.log(e);
    }
}

/* SE HVORFOR DET HER SKAL BRUGES
function displayRiders(list) {
    const tableData = list.map(
        (rider) =>
        `<tr>
        <td>${rider.id}</td>
        <td>${rider.firstname}</td>
        <td>${rider.lastname}</td>
        <td>${rider.age}</td>
        `
    ).join("");
    const tableString = tableData.join("\n")
    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(tableString);
}
 */

export async function load(pg, match) {
    //We dont wan't to setup a new handler each time load fires
    if (!initialized) {
        document.querySelector("#id-header").onclick = function (evt) {
            evt.preventDefault();
            handleSort(pageNo, match);
        };
        initialized = true;
    }
    const p = match?.params?.page || pg; //To support Navigo
    let pageNo = Number(p);

    let queryString = `?size=${SIZE}&page=` + (pageNo - 1);
    // let queryString = `?sort=${sortField}&order=${sortOrder}&limit=${SIZE}&page=` + (pageNo - 1);

    try {
        riders = await fetch(`${url}${queryString}`).then((res) => res.json());
    } catch (e) {
        console.error(e);
    }
    const rows = riders
        .map(
            (rider) => `
    <tr>
        <td>${rider.id}</td>
        <td>${rider.firstname}</td>
        <td>${rider.lastname}</td>
        <td>${rider.age}</td>
        <td><a href="#/editrider?id=${rider.id}" class="btn btn-primary">Edit</a></td>
        <td><a href="#/deleterider?id=${rider.id}" class="btn btn-danger">Delete</a></td>
    `).join("");

    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(rows);


    // (C1-2) REDRAW PAGINATION
    paginator({
        target: document.getElementById("riders-paginator"),
        total: TOTAL,
        current: pageNo,
        click: load,
    });
    //Update URL to allow for CUT AND PASTE when used with the Navigo Router
    //callHandler: false ensures the handler will not be called again (twice)
    window.router?.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true });
    //window.router?.navigate(`${queryString}`, { callHandler: false, updateBrowserURL: true });
}

