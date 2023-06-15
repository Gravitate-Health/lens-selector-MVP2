
let pvData = pv
let htmlData = html

let epiData = epi;
let ipsData = ips;

let getSpecification = () => {
    return "1.0.0"
}

let  enhance = () => {
    let listOfCategoriesToSearch = ["pregnancyCategory", "breastfeedingCategory", "contra-indication-pregancy"]

    // Get IPS gender and check if is female 
    let gender;
    ips.entry.forEach(element => {
        if (element.resource.resourceType == "Patient") {
            gender = element.resource.gender
            console.log("Gender: " + gender)
            if (gender != "female") {
                return htmlData
            }
        }
   });
   //Get condition categories for the ePI and filters by the condition we want to check
   let categories = []
   epi.entry.forEach(element => {
        if (element.resource.extension != undefined) {
            element.resource.extension.forEach(category => {
                console.log("Category found: "+ category.extension[0].valueString)
                if (listOfCategoriesToSearch.includes(category.extension[0].valueString)) {
                    categories.push(category.extension[0].valueString)
                }
            });
        }
   });
   console.log(categories)
   if (!categories.length) {
    return htmlData
   }
   //Focus (adds highlight class) the html applying every category found
   let response = htmlData
   categories.forEach(check => {
    const rgx = new RegExp('<span\\s+class\\s*=\\s*["\']' + check + '["\']\\s*>', 'g'); //Only checks one condition every time
    response = response.replace(rgx,`<span class=\"${check} highlight\">`)
   });
   //Never return empty section check
   if (response == null || response == "") {
    return htmlData
   }
   else {
    return response
   }
}
return {
    enhance: enhance,
    getSpecification: getSpecification
}