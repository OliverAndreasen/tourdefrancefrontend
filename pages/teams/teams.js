import {sanitizeStringWithTableRows } from "../../utils.js";

const teamUrl = "http://localhost:8080/api/teams";

export function initTeams(){
    loadTeams()
}
async function getTeams() {
    try {
        const response = await fetch(teamUrl);
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

function displayTeams(list) {
    const rows = list.map(
        (team) => `
    <tr>
        <td>${team.id}</td>
        <td>${team.name}</td>
        <td><a href="#/team?id=${team.id}" class="btn btn-primary">Se Hold</a></td>
        <td><a href="#/editteam?id=${team.id}" class="btn btn-primary">Edit</a></td>
        <td><a href="#/deleteteam?id=${team.id}" class="btn btn-danger">Delete</a></td>
    `)
    const tableString = rows.join("\n")
    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(tableString);
}

async function loadTeams() {
    try {
        let teams = [];
        teams = await getTeams();
        displayTeams(teams);
    } catch (e) {
        console.error(e);
    }
}
