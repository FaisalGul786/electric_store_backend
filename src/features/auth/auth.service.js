import { eq } from "drizzle-orm";
import { db } from "../../database/db.connection.js";
import { users } from "./auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              USER AUTHENTICATION LOGIC (signup service)
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const signupService = async(name, email, shippingAddress, password, role)=>{
  console.log("data at auth service ... ",name, email, shippingAddress, password, role)
    // 1. Check if user exists
   // instead of db.query.users.findFirst()
 const [existing] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1)
 console.log("First database query ");

  if (existing) {
    // We THROW here. This jumps straight to the catch block in the controller.
    const error = new Error("Email already exists");
    error.code = "DUPLICATE_EMAIL"; 
    throw error;
  }

  // 2. Hash and Insert
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      ship_address: shippingAddress,
      password: hashedPassword,
      role,
    })
    .returning();
    console.log("From signup service final user stored in db", user);

  // Return the data /message. The controller will receive this if no error was thrown.
  return {message: "User registered successfully.."};
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              USER AUTHENTICATION LOGIC ( login service )
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const loginService = async(email, password) => {
  console.log("request reached at service auth");

  const [ isEmail ] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1)
  console.log('fetched record', isEmail);

  if(!isEmail) {
    const error =  new Error('No such user exist, try register first');
    error.code = "EMAIL_NOT_FOUND";

    throw error
  }

  const convertHashToPlain = await bcrypt.compare(password, isEmail.password);
  console.log('password match ', convertHashToPlain);

  

  if(!convertHashToPlain) {
    const error = new Error("password or email is incorrect");
    error.code = "EMAIL_PASSWORD_WRONG";
    throw error;

  }

    // generate JWT
    const jwt_string = process.env.JWT_STRING;
    console.log("JWT STRING ...", jwt_string);


    if(!jwt_string) throw new Error("JWT_SECRET_KEY is not defined in environment variables");

    const signedJWT = jwt.sign({ id: isEmail.id, role: isEmail.role}, jwt_string, { expiresIn: "20m" });

    // Data to return at Frontend
    const id = isEmail.id;
    const role = isEmail.role;
    const name = isEmail.name;
    const userEmail = isEmail.email;

    return {signedJWT , role , name , userEmail, id}
}
