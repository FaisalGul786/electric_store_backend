import {Router} from "express";
import { uploadProduct, fetchProducts,  fetchProduct, updateProduct, productDelete,fetchProductDetail, fetchProductsByCategory } from "./product.controller.js";
import { auth_check } from "../../middleware/middleware.auth.check.js";


const router = Router();

router.post('/product',  auth_check, uploadProduct);

router.get('/products', auth_check, fetchProducts);

router.get('/product/:id', auth_check, fetchProduct);

router.patch('/fetch/product/:productId', auth_check, updateProduct);

router.delete('/delete/:productId', auth_check, productDelete);

router.get('/customer', fetchProductsByCategory);

router.get('/:id', fetchProductDetail);


export default router;
