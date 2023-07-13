let pvData = pv;
let htmlData = html;

let epiData = epi;
let ipsData = ips;

let getSpecification = () => {
    return "1.0.0";
};

let annotateHTMLsection = (listOfCategories, enhanceTag) => {
    let response = htmlData;
    listOfCategories.forEach((check) => {
        const rgx = new RegExp(
            "<span\\s+class\\s*=\\s*[\"']" + check + "[\"']\\s*>",
            "g"
        ); //Only checks one condition every time
        response = response.replace(rgx, `<span class=\"${check} ${enhanceTag}\">`);
    });
    //Never return empty section check
    if (response == null || response == "") {
        throw new Error(
            "Annotation proccess failed: Returned empty or null response"
        );
        //return htmlData
    } else {
        return response;
    }
};

let enhance = () => {
    let listOfCategoriesToSearch = ["B90", "86406008"];

    if (ips == "" || ips == null) {
        throw new Error("Failed to load IPS: the LEE is getting a empty IPS");
    }

    //Search for the condition in the IPS
    let patientHasCondition = false;
    ips.entry.forEach((element) => {
        if (element.resource.resourceType == "Condition") {
            if (element.resource.code != undefined) {
                element.resource.code.coding.forEach((coding) => {
                    if (listOfCategoriesToSearch.includes(coding.code)) {
                        patientHasCondition = true;
                    }
                });
            }
        }
    });

    if (!patientHasCondition) {
        return htmlData;
    }

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

    console.log("Categories: " + categories);

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
