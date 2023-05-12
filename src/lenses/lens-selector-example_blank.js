
let pvData = pv
let htmlData = html

let epiData = epi;
let ipsData = ips;

let getSpecification = () => {
    return "1.0.0"
}
//Lens code goes here, don't change function's name
let  enhance = () => {
   return htmlData
}

// Returns both enhance() & getSpecification functions (do not touch this functions parameters)
return {
    enhance: enhance,
    getSpecification: getSpecification

}
