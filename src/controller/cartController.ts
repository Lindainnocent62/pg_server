/* // cartController.ts
import { Request, Response } from 'express';
import {Address, Cart } from '../models/cartModels';

// Adding cart item
export const addCartItem = async (cartItem: Cart): Promise<string> => {
  const newCartItem = await Cart.create({
    userId: cartItem.userId,
    items: cartItem.items,
    totalAmount: cartItem.totalAmount,
    createdAt: new Date(),
  });

  return `Cart added successfully: ${newCartItem}`;
};

// Create address
export const createAddress = async (address: Address): Promise<string> => {
  const newAddress = await Address.create(address);

  return `Address successfully created: ${newAddress}`;
};

// Getting an address by type
export const getAddressByType = async (userId: number, diliveryType: string): Promise<Address | null> => {
  const address = await Address.findOne({ where: { diliveryType } });

  return address;
};

// Function to get a cart by userId
export const getCartByUserId = async (userId: number) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    return {};
  }
  return cart;
};

// Create address with specific fields
export const createAddressWithFields = async (addressData: Address) => {
  const { userId, diliveryType, street_1, street_2, city, province, country, postalCode } = addressData;
  return await Address.create({
    userId,
    diliveryType,
    street_1,
    street_2,
    city,
    province,
    country,
    postalCode
  });
};

export const selectAddressByType = async (req: Request, res: Response) => {
  const { userId, type } = req.body;

  try {
    const address = await getAddressByType(userId, type);
    if (address) {
      res.json({ message: 'Address found', address });
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    console.error('Error retrieving address:', error);
    res.status(500).json({ message: 'Error retrieving address' });
  }
};

export const checkout = async (req: Request, res: Response) => {
  const { userId, items, addressType } = req.body;

  try {
    const address = await getAddressByType(userId, addressType);
    if (!address) {
      return res.status(400).json({ message: 'Invalid address type' });
    }

    // Simulate payment process
    // (Here, add the actual payment integration)

    res.status(200).json({ message: 'Checkout successful', address });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Checkout failed' });
  }
};

 */
import { Request, Response } from 'express';
import { Cart } from '../models/cartModels';
import { User } from '../models/userModels';

// Checkout Endpoint
export const checkout = async (req: Request, res: Response): Promise<void> => {
  const {
    userId,
    cartItems,
    totalAmount,
    deliveryFee,
    itemCount,
    deliveryAddress,
    deliveryNote,
    cardholderName,
    cardNumber,
    cvv,
    expiryDate,
  } = req.body;

  try {
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Simulate payment integration
    // (Replace this with actual Ozow integration logic)
    const paymentSuccessful = simulatePayment({ cardholderName, cardNumber, cvv, expiryDate });

    if (!paymentSuccessful) {
      res.status(400).json({ message: 'Payment failed' });
      return;
    }

    // Save cart to the database
    const cart = await Cart.create({
      userId,
      items: JSON.stringify(cartItems),
      totalAmount,
      deliveryFee,
      itemCount,
      deliveryAddress: JSON.stringify(deliveryAddress),
      deliveryNote,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'Checkout successful', cart });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Checkout failed' });
  }
};

// Simulated Payment Process (replace with actual integration)
const simulatePayment = ({ cardholderName, cardNumber, cvv, expiryDate }: any): boolean => {
  console.log('Processing payment for:', cardholderName);
  // Simulate payment logic
  return true; // Payment successful
};
