import {signupService, loginService } from "./auth.service.js";

/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              USER AUTHENTICATION LOGIC (signup)
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const signup = async(req,res)=>{
    const {name, email, shippingAddress, password, role} = req.body;
    console.log('data', req.body);

    try {
      const newUser = await signupService(name, email, shippingAddress, password, role);
      console.log("signup service returning ... ", newUser);
        if(newUser.message)
            return res.status(201).json({ 
                message: newUser.message
            });
  
    } catch(error) {
        // If the service 'threw' an error, we catch it here.
      console.error('Registration Error:', error.message);
  
      if (error.code === "DUPLICATE_EMAIL" || error.code === 11000) {
        return res.status(409).json({ message: "User already exists with this email" });
      }
  
      return res.status(500).json({ message: "Something went wrong at backend." });
    }

}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              USER AUTHENTICATION LOGIC ( login )
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const  login = async(req,res)=>{
  const {email, password } = req.body;
    console.log('login credentials ', email, password);

      try {

        const {signedJWT, role, name, userEmail, id} = await  loginService(email, password);
        console.log('returned values . . .', signedJWT, role, name, userEmail);
         
        res.cookie('accesstoken', signedJWT, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'strict',
           maxAge: 20 * 60 * 1000
   
       });
       return res.status(200).json({message: "User Authorized ...", role,name,email: userEmail,id});
      } catch(error) {
        console.log("Login Error ", error.message);
        console.error("Full Login Error Details:", error);
        // or specifically look for the underlying database error
        console.error("Database Cause:", error.cause || error.detail);
        if(error.code === "EMAIL_NOT_FOUND") return res.status(404).json({message: "User not found!"})
        if(error.code === "EMAIL_PASSWORD_WRONG") return res.status(401).json({message: error.message});
        return res.status(500).json({message: "Server error"})
      }
}
