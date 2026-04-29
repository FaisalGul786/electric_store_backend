import express from "express";
import cookieParser from "cookie-parser";

import cors from "cors";

import authenticationRoute from "./features/auth/auth.routes.js";
import uploadRoutes from "./features/upload/upload.routes.js";
import uploadProductRoutes from "./features/product/product.routes.js";
import fetchProductsRoutes from "./features/product/product.routes.js";
import fetchProductRoutes from "./features/product/product.routes.js";
import updateProductRoutes from "./features/product/product.routes.js";
import deleteProductRoutes from "./features/product/product.routes.js";
import fetchProductsRoutesByCategory from "./features/product/product.routes.js";
import fetchProductAllDetails from "./features/product/product.routes.js";
import createOrder   from "./features/order/order.routes.js";
import fetchOrderConfirmationRoutes from "./features/order/order.routes.js";
import fetchAllOrders from "./features/order/order.routes.js";
import fetchAdminOrders from "./features/order/order.routes.js";
import fetchAdminOrderDetails    from "./features/order/order.routes.js";
import updateOrderStatusByOwner from "./features/order/order.routes.js";

const app = express();
app.use(cors({origin: "https://electric-store-frontend.vercel.app", credentials: true}));

app.use(express.json());

app.use(cookieParser());



// routes
app.use('/auth', authenticationRoute);
app.use('/api/image', uploadRoutes);
app.use('/api/upload', uploadProductRoutes);
app.use('/api/fetch', fetchProductsRoutes); // all products
app.use('/api/fetch', fetchProductRoutes);
app.use('/api/update', updateProductRoutes);
app.use('/api/product', deleteProductRoutes);

// # customer
app.use('/api/fetch/products', fetchProductsRoutesByCategory) // customer products by category
app.use('/api/product/details', fetchProductAllDetails)
app.use('/api/v1/orders', createOrder)
app.use('/api/v1/order', fetchOrderConfirmationRoutes);

app.use('/api/v1/orders', fetchAllOrders); // customer

app.use('/api/v1/fetch', fetchAdminOrders); // admin getting orders
app.use('/api/v1/fetch/admin', fetchAdminOrderDetails); // admin check order detail

app.use('/api/v1/admin', updateOrderStatusByOwner);

export default app;
