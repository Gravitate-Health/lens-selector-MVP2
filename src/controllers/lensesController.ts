import { Response, Request } from "express";
import { Logger } from "../utils/Logger";
import fs, { readFile, readdir } from "fs"

const fhirIpsURL = process.env.BASE_URL + "/ips/api/fhir"

const readLensesDir = async () => {
  try {
    let path = `${process.cwd()}/build/lenses/`
    console.log(`Looking for lenses in path: ${path}`);
    let discoveredLenses = await fs.promises.readdir(path);
    console.log(`Discovered the following files in dir: ${discoveredLenses || "None"}`);
    return discoveredLenses
  } catch (err) {
    console.error('Error occurred while reading directory!', err);
  }
}

const readLensFile = async (path: string) => {
  try {
    return await fs.promises.readFile(path, 'utf-8');
  } catch (err) {
    console.error('Error occurred while reading file!', err);
  }
}

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

const retrieveLense = async (lenseId: string): Promise<{lensResource: Object, lens: string} | null> => {
  let lensPath = `/Library?name:exact=${lenseId}`
  try {
    return await fetch(`${fhirIpsURL}${lensPath}`)
      .then(res => res.json())
      .then(bundle => {
        const dataBase64 = bundle.entry[0].resource.content[0].data
        const data = atob(dataBase64)
        return {
          lensResource: bundle.entry[0].resource,
          lens: data
        }
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
    let lensObject
    
    if (lens === null) {
      console.log(`Lens ${reqlens} not found.`);
      res.status(404).send({
        message: `Lens ${reqlens} not found.`
      })
    } else {
      lensObject = {
        lens: lens.lens,
        lensResource: lens.lensResource
      }
    }
    console.log(`Sending lens: ${JSON.stringify(lensObject)}`);
    res.status(200).send(lensObject)
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
