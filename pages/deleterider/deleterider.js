export const deleteRiderUrl = "http://localhost:8080/api/riders/delete/";

export function initDeleteRider(){
    window.onload = deleteRider();
}

function deleteRider(){
    //get id from url
    const id = window.location.href.split("=").splice(-1)[0];
    console.log(id);

     fetch(deleteRiderUrl + id, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then((response) => response.json());
     console.log("Rider deleted");
     window.location.href = "#/riders";
     window.location.reload();
}