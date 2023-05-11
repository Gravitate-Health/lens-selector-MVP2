//Varibles to get the epi and ips from the focusing manager
let pvData = pv
let htmlData = htmlDOM
let epiData = JSON.stringify(epi); 
let ipsData = JSON.stringify(ips);

let getSpecification = () => {
    return "1.0.0"
}

let  enhance = () => {
    return epiData
}
// Returns both enhance() & getSpecification functions (do not touch this functions parameters)
return {
    enhance: enhance,
    getSpecification: getSpecification
}