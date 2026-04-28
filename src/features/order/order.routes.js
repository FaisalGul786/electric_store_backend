
import {Router} from "express";
import {createOrder,  fetchOrderConfirmationData,fetchAdminOrders, fetchAllOrders, updateOrderStatus, fetchOrderDetail } from "./order.controller.js";
import {auth_check} from "../../middleware/middleware.auth.check.js";


const router = Router();



router.get('/:orderId', auth_check, fetchAllOrders);
router.get('/order/detail/:orderId', auth_check, fetchOrderDetail);
router.get('/admin/orders', auth_check, fetchAdminOrders);

router.post('/place',auth_check,  createOrder);
router.get('/confirmation/:id', auth_check, fetchOrderConfirmationData);
router.patch('/order-status', auth_check, updateOrderStatus)

export default router;
