
let pvData = pv
let htmlData = html

let epiData = epi;
let ipsData = ips;

let getSpecification = () => {
    return "1.0.0"
}

let  enhance = () => {
    let response = "";

    // Checks whether or not it's gender is female
    const gender = ips.entry[2].resource.gender;
    //console.log(gender);
    if (gender == "female") {

        //Check if the ePi provided has to do with the category "pregnancy"
        const categories = epi.entry[0].resource.extension;
        categories.forEach(category => {
            //console.log("Category found" + category);
            if (category.extension[0].valueString == "pregnancyCategory" || category.extension[0].valueString == "contra-indication-pregnancy") {
                
                //console.log("found pregnancyCategory or contra-indication-pregnancy")
                //For every <span class="pregnancyCategory"> it highlights the section
                var pregnancyCategoryRgx = /<span class="pregnancyCategory">/g;
                response = htmlData.replace(pregnancyCategoryRgx, "<span class=\"pregnancyCategory\" style=\"background-color: yellow;color: black;\">");
                
                //For every <span class="contra-indication-pregnancy"> it highlights the section
                var pregnancyContraindicationCategoryRgx = /<span class="contra-indication-pregnancy">/g;
                response = response.replace(pregnancyContraindicationCategoryRgx, "<span class=\"contra-indication-pregnancy\" style=\"background-color: yellow;color: black;\">");
            }
            
        });
   }
   return response
}
// Returns both enhance() & getSpecification functions (do not touch this functions parameters)
return {
    enhance: enhance,
    getSpecification: getSpecification
}