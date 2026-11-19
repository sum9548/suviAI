import exporess from "express"
import { googleAuth, logOut } from "../controllers/auth.controller.js"

const authRouter = exporess.Router()

authRouter.post("/google",googleAuth)

authRouter.get("/logout",logOut)

export default authRouter;