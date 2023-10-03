
let pvData = pv
let htmlData = html

let epiData = epi;
let ipsData = ips;

let getSpecification = () => {
    return "1.0.0"
}

let getDocument = (htmlData) => {
    if (typeof window === "undefined") {
        let jsdom = require("jsdom");
        let { JSDOM } = jsdom;
        let dom = new JSDOM(htmlData);
        return dom.window.document;
    } else {
        return window.document;
    }
}

let annotateHTMLsection = (listOfCategories, enhanceTag) => {

    let response = htmlData;
    let document = getDocument(htmlData);

    console.log("Document pre delete: " + document.documentElement.innerHTML);
    listOfCategories.forEach((check) => {
        if (response.includes(check)) {
            console.log("Debería tener el check: " + check);
            let elements = document.getElementsByClassName(check);
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(enhanceTag);
            }
            console.log("Response: " + document.documentElement.innerHTML);
            response = document.documentElement.innerHTML;
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
}

let enhance = () => {
    let listOfCategoriesToSearch = ["contra-indication-diabetes-mellitus"]

    //IPS interaction not implemented yet

    //Get condition categories for the ePI and filters by the condition we want to check
    let categories = []
    epi.entry.forEach(element => {
        if (element.resource.extension != undefined) {
            element.resource.extension.forEach(category => {
                if (listOfCategoriesToSearch.includes(category.extension[0].valueString)) {
                    categories.push(category.extension[0].valueString)
                }
            });
        }
    });

    //Focus (adds highlight class) the html applying every category found

    if (categories.length == 0) {
        throw new Error("No categories found", categories);
    }
    //Focus (adds highlight class) the html applying every category found
    return annotateHTMLsection(categories, "highlight");
}
return {
    enhance: enhance,
    getSpecification: getSpecification
}