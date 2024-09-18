import { Response, Request } from "express";
import { Logger } from "../utils/Logger";

const fhirIpsURL = process.env.BASE_URL + "/epi/api/fhir"

const retrieveLensesNames = async () => {
  try {
    let response = []
    let lensPath = "/Library"
    let lenses = await fetch(`${fhirIpsURL}${lensPath}`)

    let lensesBundle = await lenses.json()
    if (lensesBundle.total === 0) {
      return []
    }
    for (let entry of lensesBundle.entry) {
      response.push(entry.resource.name)
    }
    return response
  } catch (error) {
    console.log(error);
    return null
  }
}

const retrieveLense = async (lenseId: string): Promise<Object | null> => {
  let lensPath = `/Library?name:exact=${lenseId}`
  try {
    let lenses = await fetch(`${fhirIpsURL}${lensPath}`)
    let lensesBundle = await lenses.json()
    if (lensesBundle.total === 0) {
      return `No lens found with ${lenseId} name`
    }
    return lensesBundle.entry[0].resource
  } catch (error) {
    console.log(error);
    return null 
  }
}

export const getLens = async (req: Request, res: Response) => {
  let reqlens = req.params.lensId as string
  if (!reqlens || reqlens === "undefined") {
    res.status(400).send({
      message: "Provide valid lensId value."
    })
    return
  }
  try {
    let lens = await retrieveLense(reqlens)
    
    if (lens === null) {
      console.log(`Lens ${reqlens} not found.`);
      res.status(404).send({
        message: `Lens ${reqlens} not found.`
      })
    }
    console.log(`Sending lens: ${JSON.stringify(lens)}`);
    res.status(200).send(lens)
    return
  } catch (error) {
    console.log(error);
  }
}

export const getLensesNames = async (_req: Request, res: Response) => {
  Logger.logInfo('focusing.ts', 'getLensesNames', `queried /lenses function`)
  let lensesNames = await retrieveLensesNames()
  if (!lensesNames) {
    res.status(500).send({
      message: "Error occurred while reading lenses directory."
    });
    return
  }
  res.status(200).send({
    lenses: lensesNames
  });
  return
};
