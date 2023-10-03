
let pvData = pv
let htmlData = html

let epiData = epi;
let ipsData = ips;

let getSpecification = () => {
    return "1.0.0"
}

let annotateHTMLsection = (listOfCategories, enhanceTag) => {

    let document;
    if (typeof window === "undefined") {
        import("jsdom").then((jsdom) => {
            let { JSDOM } = jsdom;
            let dom = new JSDOM(htmlData);
            document = dom.window.document.documentElement;
            console.log("Document: " + document.innerHTML);
        });
    } else {
        document = window.document.documentElement;
    }

    let headElement = document.getElementsByTagName("head")[0];
    headElement.remove();


    console.log("Document post delete: " + document.innerHTML);

    let response = htmlData;

    listOfCategories.forEach((check) => {
        if (response.includes(check)) {
            console.log("Debería tener el check: " + check);
            let elements = document.getElementsByClassName(check);
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(enhanceTag);
            }
            console.log("Response: " + document.innerHTML);
            response = document.innerHTML;
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