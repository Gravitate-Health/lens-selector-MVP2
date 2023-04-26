import { Router } from "express";
import * as focusingController from "../controllers/lensesController";
export const FocusingRouter: Router = Router();

FocusingRouter.get("/lenses", focusingController.getLensesNames);
FocusingRouter.get("/lenses/:lensId", focusingController.getLens);
