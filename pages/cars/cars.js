import { paginator } from "../../lib/paginator/paginate-bootstrap.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const url = "http://localhost:8080/api/";

let cars = [];

let SIZE = 10;
const TOTAL_RECORDS = 40; //Should come from the backend
const TOTAL = Math.ceil(TOTAL_RECORDS / SIZE);

let sortField;
let sortOrder = "desc";

let initialized = false;

function handleSort(pageNo, match) {
    sortOrder = sortOrder == "asc" ? "desc" : "asc";
    sortField = "brand";
    load(pageNo, match);
}

export function initCars() {
    load;
    getCars();
}

async function getCars() {
    try {
        const carsList = await fetch(url).then(handleHttpErrors);
        displayCars(carsList);
    } catch (e) {
        console.log(e);
    }
}

function displayCars(list) {
    const tableData = list.map(
        (car) =>
            `<tr>
        <td>${car.id}</td>
        <td>${car.brand}</td>
        <td>${car.model}</td>
        <td>${car.kilometers}</td>
        </tr>`
    );

    const tableString = tableData.join("\n");
    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(tableString);
}

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
        cars = await fetch(`${url}cars${queryString}`).then((res) => res.json());
    } catch (e) {
        console.error(e);
    }
    const rows = cars
        .map(
            (car) => `
    <tr>
      <td>${car.id}</td>
      <td>${car.brand}</td>
      <td>${car.model}</td>
      <td>${car.color}</td>
      <td>${car.kilometers}</td>
    `
        )
        .join("");

    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(rows);

    // (C1-2) REDRAW PAGINATION
    paginator({
        target: document.getElementById("car-paginator"),
        total: TOTAL,
        current: pageNo,
        click: load,
    });
    //Update URL to allow for CUT AND PASTE when used with the Navigo Router
    //callHandler: false ensures the handler will not be called again (twice)
    // window.router?.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true });
    window.router?.navigate(`/cars${queryString}`, { callHandler: false, updateBrowserURL: true });
}
