import { Request, Response } from 'express';
import argon2 from 'argon2';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize'; // Import Op from sequelize
import {getSecret, sendSMS, sendEmail } from '../utils/smsTwillio';
import User from '../models/userModels';
import { Address } from '../models/cartModels';


//fetching user details uncluding associated models
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
   try {
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
  
      let decoded: { userId: number }; 
      decoded = jwt.verify(token, getSecret()) as { userId: number };

      // Fetch user profile from the database
      const userId = decoded.userId;
      console.log('userId: ', userId);

      const user = await User.findByPk(userId);
      
      if (!user) {
         res.status(404).json({ message: 'User not found' });
      }
      console.log(user);
      // Return user profile
      res.status(201).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error retrieving user information' });
    }
};

export const updatePersonalInformation = async (req:Request, res:Response): Promise<void> =>{
    
    try{
        const {name_, lname_, phoneNumber_, email_} = req.body;
        console.log(req.body);

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
        // Fetch user profile from the database

        const user = await User.findByPk(userId)

        if(!user){
        res.status(404).json({ message: "User not found" });
        return;
        }
        let hasChanges = false;

        if(user.firstName != name_){
            user.firstName = name_;
            hasChanges = true;
        }

        if(user.lastName != lname_){
            user.lastName = lname_;
            hasChanges = true;
        }

        if(user.phone != phoneNumber_){
            user.phone = phoneNumber_;
            hasChanges = true;
        }
      
        if(user.username != email_){
            user.username = email_;
            hasChanges = true;
        }
        //updating user information
        if (hasChanges) {
            await user.save();
            res.status(200).json({ message: "Personal information updated successfully" });
        } else {
            res.status(200).json({ message: "No changes detected in personal information" });
        }

    }catch(error){
        console.error("Error completing profile:", error);
        res.status(500).json({ message: "Error completing profile" });
    }
} 

  //Update user information 
export const updateAddressInformation = async (req:Request, res:Response): Promise<void> =>{

    try{
        const {
            street_1,
            street_2,
            city,
            province,
            country,
            postal,
        } = req.body;
        console.log(req.body);

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
        // Fetch user profile from the database

        const user = await User.findByPk(userId)

        if(!user){
        res.status(404).json({ message: "User not found" });
        return;
        }

        let hasChanges = false;
        if(user.addressStreet_1 != street_1){
            user.addressStreet_1 = street_1;
            hasChanges=true;
        }

        if(user.addressStreet_2 != street_2){
            user.addressStreet_2 = street_2;
            hasChanges=true;
        }

        if(user.addressCity != city){
            user.addressCity = city;
            hasChanges=true;
        }
      
        if(user.addressProvince != province){
            user.addressProvince = province;
            hasChanges=true;
        }
      
        if(user.addressCountry != country){
            user.addressCountry = country;
            hasChanges=true;
        }

        if(user.addressPostalCode != postal){
            user.addressPostalCode = postal;
            hasChanges=true;
        }
        //updating user information
        if (hasChanges) {
            await user.save();
            res.status(200).json({ message: "Address information updated successfully" });
        } else {
            res.status(200).json({ message: "No changes detected in personal information" });
        }

    }catch(error){
        console.error("Error completing profile:", error);
        res.status(500).json({ message: "Error completing profile" });
    }
}

export const updatePassword = async(req:Request, res:Response):Promise<void>=>{
try{
    const {email, newPassword} = req.body;
    console.log("request body recieve", req.body);

    console.log(email, ": ", newPassword)

    if(email =='' || newPassword ==''){
        console.log('password field can not be empty');
        res.status(201).json({message: 'Password field can not be empty'});
        return;
    }
    const user = await User.findOne({where: {username: email}});
    if(!user){
        console.log(`Did not find a user with the email ${email}`)
        return;
    } 

    console.log('user retrieved from server: ', user);
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the password securely

    console.log("newPassword ", newPassword, "hashedPassword :", hashedPassword)
    user.password = newPassword;
    
    //save password
    user.save();
    res.status(201).json({message:'Password updated succesfully'})

    }catch(error){
        console.log('Failed to make request to server')
    }
}