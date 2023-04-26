import { Response, Request } from "express";
import { Logger } from "../utils/Logger";
import fs, { readFile, readdir } from "fs"

const readLensesDir = async () => {
  try {
    return await fs.promises.readdir(`${process.cwd()}/mockedLenses/`);
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

const retrieveLense = async (lenseId: string) => {
  let lensFilename: string = lenseId + ".js"
  let lensPath = `${process.cwd()}/mockedLenses/${lensFilename}`

  let lensesNames = await readLensesDir()
  console.log(`Found the following lenses: ${lensesNames}`);
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

const retrieveLensesNames = async () => {
  try {
    let lensesNames = await readLensesDir()
    console.log(lensesNames);
    return await lensesNames
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
    console.log("Sending lens...");
    res.status(200).send({
      metadata: {},
      lens: lens
    })
    return
  } catch (error) {
    console.log(error);
  }

}

export const getLensesNames = async (_req: Request, res: Response) => {
  Logger.logInfo('focusing.ts', 'getLensesNames', `queried /lenses function`)
  let lensesNames = await retrieveLensesNames()
  res.status(200).send({
    lenses: lensesNames
  });
  return
};
