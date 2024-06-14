import { Response, Request } from "express";
import { Logger } from "../utils/Logger";
import fs, { readFile, readdir } from "fs"

const fhirIpsURL = process.env.BASE_URL + "/ips/api/fhir"

const retrieveLensesNames = async () => {
  try {
    let response = []
    fetch(`${fhirIpsURL}/Library`)
      .then(res => res.json())
      .then(bundle => {
        for (let entry of bundle.entry) {
          response.push(entry.resource.name)
        }
      })
  } catch (error) {
    console.log(error);
    return null
  }
}

const retrieveLense = async (lenseId: string): Promise<Object | null> => {
  let lensPath = `/Library?name:exact=${lenseId}`
  try {
    return await fetch(`${fhirIpsURL}${lensPath}`)
      .then(res => res.json())
      .then(bundle => {
          return bundle
      })
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
