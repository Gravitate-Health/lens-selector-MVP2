//Varibles to get the epi and ips from the focusing manager
let epiData = JSON.stringify(epi); 
let ipsData = JSON.stringify(ips);

function getSpecification (){
    return "latest"
}

function enhance() {
    return null
}
// Returns both enhance() & getSpecification functions (do not touch this functions parameters)
return {
    enhance :enhance,
    getSpecification : getSpecification
}