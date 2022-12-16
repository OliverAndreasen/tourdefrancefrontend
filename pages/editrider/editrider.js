import { handleHttpErrors, sanitizeStringWithTableRows,errorMessage, removeErrorMessage} from "../../utils.js";
const getRiderUrl = 'http://localhost:8080/api/riders/';

//Input fields
let riderIdInput;
let riderFirstnameInput;
let riderLastnameInput;
let riderAgeInput;
//error div
let errorDiv;

export function initEditRider(){
    // Set the querySelector to the input fields
    riderIdInput = document.querySelector("#rider-input-id");
    riderFirstnameInput = document.querySelector("#rider-input-firstname");
    riderLastnameInput = document.querySelector("#rider-input-lastname");
    riderAgeInput = document.querySelector("#rider-input-age");

    // Button to submit the edited rider
    document.getElementById("rider-edit-btn").onclick = editRider;

    // Get the rider and display it
    getRider();
}


async function getRider(){
    removeErrorMessage()

    try {
        const id = window.location.href.split("=").splice(-1)[0];
        const rider = await fetch(getRiderUrl + id).then(handleHttpErrors);
        displayRider(rider);
    } catch (error) {
        // clear input fields
        clearInputs();
        // set error message
        errorMessage("Rytteren du prøver at redigere")
    }
}

function displayRider(rider){
    riderIdInput.value = rider.id;
    riderFirstnameInput.value = rider.firstname;
    riderLastnameInput.value = rider.lastname;
    riderAgeInput.value = rider.age;
}

function editRider(evt){
    evt.preventDefault();

    const rider = {};
    rider.id = riderIdInput.value;
    rider.firstname = riderFirstnameInput.value;
    rider.lastname = riderLastnameInput.value;
    rider.age = riderAgeInput.value;

    //If you try to edit a rider that doesn't exist the error message will be displayed
    if (rider.id === "" || rider.id === null){
        errorMessage("Rytteren du prøver at redigere, findes ikke");
        return;
    }
    else if(rider.fistname === "" || rider.lastname === "" || rider.age === ""){
        errorMessage("Udfyld venligst alle felter");
        return;
    }

    const options = {};
    options.method = "PATCH";
    options.headers = { "Content-type": "application/json" };
    options.body = JSON.stringify(rider);

    const patchRiderUrl = 'http://localhost:8080/api/riders/edit/';
    const editedRider = fetch(patchRiderUrl + rider.id, options).then(handleHttpErrors);
    location.replace("/#/riders");
    location.reload();
}

function clearInputs() {
    riderIdInput.value = "";
    riderFirstnameInput.value = "";
    riderLastnameInput.value = "";
    riderAgeInput.value = "";
}


