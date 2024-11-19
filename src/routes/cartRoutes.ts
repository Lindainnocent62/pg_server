import { Router } from 'express';
import {  checkout } from '../controller/checkoutController';


const router: Router = Router();

/* router.post('/add/cart/address', addCartAddress);*/
router.post('/checkout', checkout);

export default router;
