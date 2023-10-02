let pvData = pv;
let htmlData = html;

let epiData = epi;
let ipsData = ips;

let getSpecification = () => {
    return "1.0.0";
};

let annotateHTMLsection = (listOfCategories, enhanceTag) => {
    let document;

    if (typeof window === "undefined") {
        import("jsdom").then((jsdom) => {
            let { JSDOM } = jsdom;
            let dom = new JSDOM(htmlData);
            document = dom.window.document;
        });
    } else {
        document = window.document;
    }

    let response = htmlData;

    listOfCategories.forEach((check) => {
        if(response.includes(check)) {
            let baseDom = document.createElement("div");
            baseDom.innerHTML = response;
            let elements = baseDom.getElementsByClassName(check);
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(enhanceTag);
            }
            response = baseDom.innerHTML;
        }
    });

    if (response == null || response == "") {
        throw new Error(
            "Annotation proccess failed: Returned empty or null response"
        );
        //return htmlData
    } else {
        console.log("Response: " + response);
        return response;
    }
};

let enhance = () => {
    //                  pregnancyCategory    breastfeedingCategory
    //                             SNOMED    SNOMED
    let listOfCategoriesToSearch = ["W78", "77386006", "69840006"]; //"contra-indication-pregancy"]

    // Get IPS gender and check if is female
    let gender;

    if (ips == "" || ips == null) {
        throw new Error("Failed to load IPS: the LEE is getting a empty IPS");
    }
    ips.entry.forEach((element) => {
        if (element.resource.resourceType == "Patient") {
            gender = element.resource.gender;
            if (gender != "female") {
                return htmlData;
            }
        }
    });

    // ePI traslation from terminology codes to their human redable translations in the sections
    let compositions = 0;
    let categories = [];
    epi.entry.forEach((entry) => {
        if (entry.resource.resourceType == "Composition") {
            compositions++;
            //Iterated through the Condition element searching for conditions
            entry.resource.extension.forEach((element) => {
                
                // Check if the position of the extension[1] is correct
                if (element.extension[1].url == "concept") {
                    // Search through the different terminologies that may be avaible to check in the condition
                    if (element.extension[1].valueCodeableReference.concept != undefined) {
                        element.extension[1].valueCodeableReference.concept.coding.forEach(
                            (coding) => {
                                console.log("Extension: " + element.extension[0].valueString + ":" + coding.code)
                                // Check if the code is in the list of categories to search
                                if (listOfCategoriesToSearch.includes(coding.code)) {
                                    // Check if the category is already in the list of categories
                                    categories.push(element.extension[0].valueString);
                                }
                            }
                        );
                    }
                }
            });
        }
    });

    if (compositions == 0) {
        throw new Error('Bad ePI: no category "Composition" found');
    }

    if (categories.length == 0) {
        throw new Error("No categories found", categories);
    }
    //Focus (adds highlight class) the html applying every category found
    return annotateHTMLsection(categories, "highlight");
};
return {
    enhance: enhance,
    getSpecification: getSpecification,
};
