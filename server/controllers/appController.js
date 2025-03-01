


import UserModel from '../model/User.model.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';
import { sendDynamicMail } from '../controllers/mailer.js';
import twilio from "twilio";

const client = twilio(ENV.TWILIO_ACCOUNT_SID,ENV.TWILIO_AUTH_TOKEN);

/**middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    // Extract the username from query for GET requests, or body for others
    const { username } = req.method === "GET" ? req.query : req.body;

    if (!username) {
      return res.status(400).send({ error: "Username is required" }); // 400 for bad input
    }

    // Check if the user exists in the database
    const exist = await UserModel.findOne({ username });

    if (!exist) {
      return res.status(404).send({ error: "User not found" }); 
    }

    next(); 
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).send({ error: "Server error during authentication" });
  }
}

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  if (!username || !userEmail || !text || !subject) {
    return res.status(400).json({ error: 'All fields are required: username, userEmail, text, subject' });
  }

  try {
    const response = await sendDynamicMail({ username, userEmail, text, subject });
    res.status(200).json({ message: 'Email sent successfully', response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};


export async function register(req, res) {
    try {
        const { username, password, profile, email,mobile } = req.body;

        // Check if username or email already exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ error: "Username already exists. Use a unique username." });
        }

        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ error: "Email already exists. Use a unique email." });
        }

        // Hash the password
        if (!password) {
            return res.status(400).send({ error: "Password is required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const newUser = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || '', 
            email,
            mobile
        });

        await newUser.save();
        return res.status(201).send({ msg: "User registered successfully!" });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).send({ error: "An error occurred during registration." });
    }
}

export async function sendOtp(req, res) {
  const { username } = req.body;
  console.log("Received request for sendOtp with username:", username); 

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });
    console.log("User found:", user); 
    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    // Validate user mobile number
    if (!user.mobile) {
      return res.status(400).send({ error: "User mobile number not registered." });
    }

    // Generate a 6-digit OTP (numeric only)
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Generated OTP:", otp); // Debug OTP value

    // Save OTP in req.app.locals
    req.app.locals.OTP = otp;
    console.log("Saved OTP in req.app.locals:", req.app.locals.OTP);

    // Send OTP using Twilio
    const message = await client.messages.create({
      body: `Your OTP for login is ${otp}`,
      from: ENV.TWILIO_PHONE_NUMBER,
      to: `+91${user.mobile}`, 
    });
    
    console.log("Twilio message sent:", message);

    res.status(200).send({ msg: "OTP sent to your registered phone number." });
  } catch (error) {
    console.error("Error occurred in sendOtp:", error); // Debug error
    res.status(500).send({ error: "An error occurred while sending OTP." });
  }
}


export async function login(req, res) {
  const { username, otp } = req.body;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    // Check if OTP matches the stored OTP in req.app.locals
    if (req.app.locals.OTP !== otp) {
      return res.status(400).send({ error: "Invalid OTP." });
    }

    // Clear the OTP after successful verification
    req.app.locals.OTP = null;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).send({
      msg: "Login successful",
      username: user.username,
      token: token,
    });
  } catch (error) {
    res.status(500).send({ error: "An error occurred during login." });
  }
}

// export async function login(req, res) {
//     const { username, password } = req.body;
  
//     try {
//       // Find the user by username
//       const user = await UserModel.findOne({ username });
//       if (!user) {
//         return res.status(404).send({ error: "Username not found" });
//       }
  
//       // Compare passwords
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(400).send({ error: "Invalid username or password" });
//       }
  
//       // Generate JWT token
//       const token = jwt.sign(
//         {
//           userId: user._id,
//           username: user.username,
//         },
//         ENV.JWT_SECRET, 
//         { expiresIn: "24h" }
//       );
  
//       return res.status(200).send({
//         msg: "Login successful",
//         username: user.username,
//         token: token,
//       });
//     } catch (error) {
//       return res.status(500).send({ error: "An error occurred during login." });
//     }
//   }
  

  export async function getUser(req, res) {
    const { username } = req.params;
  
    if (!username) {
      return res.status(400).send({ error: "Invalid username" }); 
    }
  
    try {
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).send({ error: "User not found" }); 
      }

      const {password,...rest}=Object.assign({},user.toJSON())
  
      return res.status(200).send(rest); 
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).send({ error: "Error fetching user" }); 
    }
  }
  

  export async function UpdateUser(req, res) {
    try {
 
      const {userId}=req.user;
  
      if (!userId) {
        return res.status(400).send({ error: "User ID is required" });
      }
  
      const updates = req.body; 
      const result = await UserModel.updateOne({ _id: userId }, updates);
  
      if (result.nModified === 0) {
        return res.status(404).send({ error: "No record found to update" });
      }
  
      return res.status(200).send({ msg: "Record updated successfully" });
    } catch (error) {
      return res.status(500).send({ error: "An error occurred during the update process", details: error.message });
    }
  }
  

export async function generateOTP(req,res){
     req.app.locals.OTP=await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
     res.status(201).send({code:req.app.locals.OTP});
}

export async function verifyOTP(req,res){
  const {code}=req.query;
  if(parseInt(req.app.locals.OTP)===parseInt(code)){
    req.app.locals.OTP=null;
    req.app.locals.resetSession=true;
    return res.status(201).send({msg:"verify successful"});
  }
  return res.status(400).send({error:"Invalid OTP"});
}

export async function createResetSession(req,res){
  if(req.app.locals.resetSession){
    req.app.locals.resetSession=false;
    return res.status(201).send({msg:"Reset session created successfully"});
  }
  return res.status(440).send({msg:"session expired"});
}

export async function resetPassword(req, res) {
  try {
    if(!req.app.locals.resetSession)   return res.status(440).send({msg:"session expired"});

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();
    req.app.locals.resetSession=false;
    return res.status(200).send({ message: "Password successfully reset" });

  } catch (error) {
    console.error(error);  
    return res.status(500).send({
      error: "An error occurred while resetting the password"
    });
  }
}