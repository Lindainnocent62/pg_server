import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const OZOW_SITE_CODE = process.env.OZOW_SITE_CODE || 'YOUR_OZOW_SITE_CODE';
const OZOW_API_KEY = process.env.OZOW_API_KEY || 'YOUR_API_KEY';
const OZOW_SECRET_KEY = process.env.OZOW_SECRET_KEY || 'YOUR_SECRET_KEY';
const SUCCESS_URL = process.env.SUCCESS_URL || 'https://your-site.com/success';
const FAIL_URL = process.env.FAIL_URL || 'https://your-site.com/failure';

// Define the response type from OZOW
interface OzowResponse {
  paymentUrl: string;
  [key: string]: any; // To handle any other properties that might exist
}

export const checkout = async (req: Request, res: Response) => {
  const { userId, address, items, paymentDetails } = req.body;

  // Calculate total amount (example calculation)
  const totalAmount = items.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
  
  // Generate OZOW transaction reference
  const transactionRef = `TXN-${Date.now()}-${userId}`;

  // Prepare data to send to OZOW, with a type assertion to allow `Hash`
  const data = {
    SiteCode: OZOW_SITE_CODE,
    CountryCode: 'ZA',
    CurrencyCode: 'ZAR',
    Amount: totalAmount.toFixed(2),
    TransactionReference: transactionRef,
    BankReference: `ORDER-${transactionRef}`,
    Customer: {
      FirstName: paymentDetails.firstName,
      LastName: paymentDetails.lastName,
      EmailAddress: paymentDetails.email,
      CellPhoneNumber: paymentDetails.cellPhone,
    },
    SuccessUrl: SUCCESS_URL,
    ErrorUrl: FAIL_URL,
    CancelUrl: FAIL_URL,
    IsTest: true, // Set to `false` in production
  } as any; // <--- Type assertion to allow dynamic Hash property

  // Generate the secure hash for OZOW's API request (important for security)
  const hashString = [
    OZOW_SITE_CODE,
    data.CountryCode,
    data.CurrencyCode,
    data.Amount,
    data.TransactionReference,
    data.BankReference,
    data.Customer.FirstName,
    data.Customer.LastName,
    data.Customer.EmailAddress,
    data.Customer.CellPhoneNumber,
    SUCCESS_URL,
    FAIL_URL,
    FAIL_URL,
    OZOW_SECRET_KEY,
  ].join('');

  data.Hash = crypto.createHash('md5').update(hashString).digest('hex'); // Now `Hash` is added successfully

  try {
    // Make the request to OZOW's API
    const response = await axios.post<OzowResponse>('https://api.ozow.com/transaction/initiate', data, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Check if OZOW responded with the payment URL
    if (response.data?.paymentUrl) {
      res.status(200).json({ message: "Payment initiation successful", paymentUrl: response.data.paymentUrl });
    } else {
      res.status(500).json({ message: "Failed to initiate payment with OZOW" });
    }
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Checkout failed" });
  }
};
