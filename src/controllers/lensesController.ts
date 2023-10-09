import { Response, Request } from "express";
import { Logger } from "../utils/Logger";
import fs, { readFile, readdir } from "fs"

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
    let lensesNames = await readLensesDir()
    console.log(`Found the following lenses: ${lensesNames || "None"}`);
    return await lensesNames
  } catch (error) {
    console.log(error);
    return null
  }
}

const retrieveLense = async (lenseId: string) => {
  let lensFilename: string = lenseId + ".js"
  let lensPath = `${process.cwd()}/build/lenses/${lensFilename}`

  let lensesNames = await retrieveLensesNames()
  console.log(`Looking for lens: ${lensFilename}`);
  if (lensesNames?.includes(lensFilename)) {
    try {
      return await readLensFile(lensPath)
    } catch (error) {
      console.log(error);
    }
  } else {
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
    let lensObject = {
      metadata: {},
      lens: lens
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
