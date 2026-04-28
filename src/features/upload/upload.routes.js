import {Router} from "express";
import {upload} from "../../config/cloudinary.js";
import {  uploadImage } from "./upload.controller.js";
import {auth_check} from "../../middleware/middleware.auth.check.js"


const router = Router();

router.post('/upload',auth_check , upload.single('image') , uploadImage);

export default router;
