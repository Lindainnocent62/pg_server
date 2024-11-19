import { Request, Response } from 'express';
import argon2 from 'argon2';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize'; // Import Op from sequelize
import {getSecret, sendSMS, sendEmail } from '../utils/smsTwillio';
import { User } from '../models/userModels';
import { Address } from '../models/cartModels';

dotenv.config();

export const login = async (req: Request, res: Response): Promise<void> => {

  try {
    
    let { username, password } = req.body;
    // Convert inputs to strings to ensure consistent comparison
    username = String(username || '').trim();
    password = String(password || '').trim();

    // Ensure both fields are non-empty strings
    if (!username || !password) {
      res.status(401).json({ message: "Missing or invalid username or password." });
      return;
    }
    // Attempt to find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    // Compare the plaintext password with the hashed password in the database
   
    console.log('matching password testing', (await bcrypt.compare(password, user.password)));
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    if ((await bcrypt.compare(password, user.password))) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user?.id }, getSecret(), { expiresIn: "1h" });

      // Return success response
      res.status(200).json({
        message: "Login successful",
        token,
        requiresProfileCompletion: !user?.isProfileComplete, // Include this to signal profile status
    });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "An internal server error occurred. Please try again later." });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  let { username, password } = req.body;

  try {
    // Convert inputs to strings to ensure consistent handling
    username = String(username || '').trim();
    password = String(password || '').trim();

    if (!username || !password) {
      res.status(400).json({ message: "Missing or invalid username or password." });
      return;
    }

    //const hashedPassword = await bcrypt.hash(password, 10); // Hash the password securely
    //console.log('password', hashedPassword, typeof password)
    const user = await User.create({
      username,
      password: password,
      isOnboardingComplete:true
    });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
}; 

// Complete registration
export const completeRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const {userId} = req.params;
    const {
      name,
      lname,
      phoneNumber,
      street_1,
      street_2,
      city,
      country,
      province,
      postal,
      isOnboardingComplete,
      isProfileComplete
      } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.firstName = name;
    user.lastName = lname;
    user.phone = phoneNumber;
    user.addressStreet_1 = street_1;
    user.addressStreet_2 = street_2;
    user.addressCity = city;
    user.addressProvince = province;
    user.addressCountry = country;
    user.addressPostalCode = postal;
    user.isOnboardingComplete=isOnboardingComplete;
    user.isProfileComplete = isProfileComplete;

    await user.save();
    res.status(200).json({ message: "Profile completed successfully" });

  } catch (error) {
    console.error("Error completing profile:", error);
    res.status(500).json({ message: "Error completing profile" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  console.log('Incoming Request Body:', req.body); // Debugging log
  console.log(`Received email: ${email}\n\n`); // Debugging log

  //get the user Id, find user by Primary Key?

  try {
    const user = await User.findOne({ where: {username: email } });
    console.log('\n\n\n',user)
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, getSecret(), { expiresIn: '1h' });
    user.resetToken = token;
    user.resetTokenExpiration = new Date(Date.now() + 3600 * 1000); 
    await user.save();

    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    const resetLink =`
Hello Dahlink
                    
You requested to reset password on  your perfect gal account. 
                    
If you do not recognise this action you can ignore email. We advice you to change your password
more often to strengthen your application security.

Your verification code: ${verificationCode}`;

    await sendEmail(true, user.username, `${resetLink}`);
  

    res.status(201).json({ message: "Password reset link sent" , code: verificationCode});
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Error sending reset link" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  console.log(req.body)
  try {
    const decoded = jwt.verify(token, getSecret()) as { userId: number };
    const user = await User.findOne({
      where: {
        id: decoded.userId,
        resetToken: token,
        resetTokenExpiration: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    user.password = await argon2.hash(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, firstName, lastName, phone } = req.body;
    const hashedPassword = await argon2.hash(password); // Hash password before saving

    const user = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      isProfileComplete: false,
      isOnboardingComplete: false,
    });

    res.status(201).json({
      message: 'User created successfully!',
      user,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
};



//getting onboarderd status
export const getUserOnboarded = async(req: Request, res: Response)=>{
  
  try{
      // Extract the Authorization header
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
          res.status(401).json({ message: 'Authorization header missing' });
      }

    // Extract and verify the token
    const token = authHeader!.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token missing' });
    }

    let decoded = jwt.verify(token, getSecret()) as { userId: number };
    const userId = decoded.userId;
     const response = await User.findByPk(userId);

    if(response) res.status(200).json({isOnboardingComplete: response!.isOnboardingComplete})

  }catch(error){
    console.log('Failed to get onboarding status', error);
    res.status(404).json({message: 'Failed to get onboarding status'})
  }
}

export const setUserComplete = async(req:Request, res:Response)=>{
  /* const { token } = req.body; */
  const {userId} = req.params;
console
  try {
    /* const decoded = jwt.verify(token, getSecret()) as { userId: number }; */
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    user.isProfileComplete = true;
    await user.save();

    res.status(200).json({ message: "User profile succesfully" });
  }catch(error){
    console.log('Failed to get update status', error);
    res.status(404).json({message: 'Failed to update user'})
  }
}

//