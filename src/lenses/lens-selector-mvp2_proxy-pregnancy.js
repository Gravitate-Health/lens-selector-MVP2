let pvData = pv;
let htmlData = html;

let epiData = epi;
let ipsData = ips;

let getSpecification = () => {
    return "1.0.0";
};

let enhance = async () => {
    
    const host = process.env.PROXY_LENS_ENV == "dev" ? "https://gravitate-health.lst.tfo.upm.es" : "https://gravitate-health.lst.tfo.upm.es" //"https://fosps.gravitatehealth.eu/";
    const url = `${host}/external/pregnancy`
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            pvData: pv,
            htmlData: html,
            epiData: JSON.stringify(epi),
            ipsData: JSON.stringify(ips)
        })
    };

    let response = await fetch(url, options)
    .then((response) => {
        return response.json();
    }).catch((error) => {
        throw new Error(error);
    });

    return response.htmlString;
};

return {
    enhance: enhance,
    getSpecification: getSpecification,
};