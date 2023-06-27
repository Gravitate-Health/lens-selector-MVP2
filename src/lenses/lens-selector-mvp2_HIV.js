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
        throw new Error('Annotation proccess failed: Returned empty or null response');
    } else {
        return response;
    }
};

let haveHIV = (ips) => {
    ipsEntries = ips.entry;

    ipsEntries.forEach((entry) => {
        if (entry.resource.resourceType == "Condition") {
            resourceCodings = entry.resource.code.coding;
            resourceCodings.forEach((coding) => {
                if (coding.code == "86406008") {
                    // This code is only valid if the system is SNOMED-CT
                    return true;
                }
            });
        }
    });

    return false;
};



let enhance = () => {
    // Check if the patient has HIV
    if (!haveHIV(ips)) {
        throw new Error('Bad IPS: no HIV related condition encontered')
    }

    let listOfCategoriesToSearch = ["B90"]; // This is the code for AIDS in ICPC-2

    let compositions = 0;
    let categories = [];

    epi.entry.forEach(entry => {
        if (entry.resource.resourceType == "Composition") {
            compositions++;
            //Iterated through the Condition element searching for conditions
            entry.resource.extension.forEach(element => {
                // Check if the position of the extension[1] is correct
                if (element.extension[1].url == "concept") {
                    // Search through the different terminologies that may be avaible to check in the condition
                    element.extension[1].valueCodeableReference.concept.coding.forEach(termilogySystem => {
                        // Adds the category to be hightlighted in the epi
                        if (listOfCategoriesToSearch.find((cat) => cat == termilogySystem.code)) {
                            categories.push(termilogySystem.display)
                        }
                    });
                }
            });
        }
    });
    if (compositions == 0) {
        throw new Error('Bad ePI: no category "Composition" found');
    }

    if (!categories.length) {
        console.log(categories);
        if (!categories.length) {
            return htmlData;
        }
        throw new Error('No categories found', categories);
    }

    //Focus (adds highlight class) the html applying every category found
    return annotateHTMLsection(categories, "highlight");
};
return {
    enhance: enhance,
    getSpecification: getSpecification,
};
