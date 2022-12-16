import {handleHttpErrors, removeErrorMessage, errorMessage} from "../../utils.js";

//Input fields
let riderFirstnameInput;
let riderLastnameInput;
let riderAgeInput;
//error div
let errorDiv;

export function initAddRider(){
    riderFirstnameInput = document.querySelector("#rider-input-firstname");
    riderLastnameInput = document.querySelector("#rider-input-lastname");
    riderAgeInput = document.querySelector("#rider-input-age");
    errorDiv = document.querySelector(".error");

    document.getElementById("rider-add-btn").onclick = addRider;
}

function addRider(){

const rider = {};
    rider.firstname = riderFirstnameInput.value;
    rider.lastname = riderLastnameInput.value;
    rider.age = riderAgeInput.value;

    if(rider.firstname === "" || rider.lastname === "" || rider.age === ""){
        errorMessage("Venligst udfyld alle felter");
        return;
    }

    try {
        fetch('http://localhost:8080/api/riders', {
            method: 'POST',
            body: JSON.stringify(rider),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(handleHttpErrors)
        location.href = "#/riders";
        location.reload()
    } catch (error) {
        errorMessage("Rytteren kunne ikke tilføjes")
    }
}


