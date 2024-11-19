import express from 'express';
/* import { createAddress, getAddressByType } from '../models/cartModels';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const address = req.body; 
    const newAddressId = await createAddress(address);
    res.status(201).send({ message: 'Address created', addressId: newAddressId });
  } catch (error) {
    res.status(500).send({
      message: 'Error creating address',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
  }
}); 

router.get('/get/:userId/:type', async (req, res) => {
  try {
    const { userId, type } = req.params;
    const address = await getAddressByType(Number(userId), type);
    if (address) {
      res.status(200).send(address);
    } else {
      res.status(404).send({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Error retrieving address',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
  }
});

export default router;
*/