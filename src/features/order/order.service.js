import {db} from "../../database/db.connection.js"; 
import {products} from "../product/product.schema.js";
import {orderItems} from "./order.schema.js";

import { eq, desc, inArray } from "drizzle-orm";
import { orders } from "./order.schema.js";


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT ORDER LOGIC (service)
 * 🛡️ --------------------------------------------------- 🛡️
*/

/**export const orderCreateService = async(id, data) => {
	// calculating price (one type product like Earbud not other product like laptop price)
	// Fetch that item first
	const [product] = await db.select().from(products).where(eq(products.id, data.cartItems[0].id));
	console.log('fetch result ... ',product);
	console.log('data type .' , typeof(product.price), data.cartItems[0].quantity);
	const totalPrice = product.price * data.cartItems[0].quantity;
	console.log('total price . . . ', totalPrice);
	
	// creating tables
	
	const orderData = await db.insert(orders).values({
	totalPrice,
	paymentMethod: 'COD',
	shippingAddress: data.shippingAddress,
	}).returning();
	console.log("order data placed", orderData)
	
	const orderItemsData = await db.insert(orderItems).values({
		
		userId: id,
		orderId: orderData[0].id,
		productId: product.id,
		quantity: data.cartItems[0].quantity,
		
		orderTimePrice: product.price
	}).returning()
	
	console.log("orderItems data place", orderItemsData);
	
	
	return orderData[0].id;
	
	
}**/

/** updated code to place all items in a order **/

export const orderCreateService = async (id, data) => {
  // 1. Get all product IDs from cart
  const productIds = data.cartItems.map(item => item.id);

  // 2. Fetch all products in one query
  const fetchedProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  // 3. Calculate total price across all items
  const totalPrice = data.cartItems.reduce((sum, cartItem) => {
    const product = fetchedProducts.find(p => p.id === cartItem.id);
    if (!product) throw new Error(`Product ${cartItem.id} not found`);
    return sum + product.price * cartItem.quantity;
  }, 0);

  console.log('total price . . . ', totalPrice);

  // 4. Create the order
  const orderData = await db.insert(orders).values({
    totalPrice,
    paymentMethod: 'COD',
    shippingAddress: data.shippingAddress,
  }).returning();

  console.log('order data placed', orderData);

  // 5. Insert ALL order items
  const orderItemsPayload = data.cartItems.map(cartItem => {
    const product = fetchedProducts.find(p => p.id === cartItem.id);
    return {
      userId: id,
      orderId: orderData[0].id,
      productId: product.id,
      quantity: cartItem.quantity,
      orderTimePrice: product.price,
    };
  });

  const orderItemsData = await db
    .insert(orderItems)
    .values(orderItemsPayload)
    .returning();

  console.log('orderItems data placed', orderItemsData);

  return orderData[0].id;
};

/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT ORDER CONFIRM LOGIC (service)
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const getOrderConfirmationDataService = async (orderId) => {
  const result = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      items: {
        with: {
          product: {
            columns: {
              name: true,
              imageUrl: true,   // ← your ERD says image_url not image
            },
          },
          user: {
            columns: {
              name: true,       // useful to confirm whose order this is
            },
          },
        },
      },
    },
  });
  
  console.log('data . ', result)

  if (!result) return null;

  // All items belong to same user — grab from first item
  const userName = result.items[0]?.user?.name ?? null;

  return {
    id: result.id,
    status: result.orderStatus,
    createdAt: result.orderDate,
    shippingAddress: result.shippingAddress,
    totalPrice: parseFloat(result.totalPrice),
    userName,
    items: result.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      name: item.product.name,
      image: item.product.imageUrl,
      price: parseFloat(item.orderTimePrice), // ← snapshot price, not live product price
    })),
  };
};





/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              FETCH ALL ORDERS LOGIC (service for customer)
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchAllOrderService = async(orderId) => {
	console.log('service .. ', orderId)

	const data = await db.select().from(orders).where(eq(orders.id, orderId))
	return data
}



/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              FETCH ALL ORDERS LOGIC (service for admin)
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchAdminOrderService = async () => {
  // 1. Fetch pending orders
  const pendingOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.orderStatus, 'pending'))
    .orderBy(desc(orders.orderDate))

  if (pendingOrders.length === 0) return []

  const orderIds = pendingOrders.map(o => o.id)

  // 2. Fetch all order items for those orders (with user + product)
  const allItems = await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      quantity: orderItems.quantity,
      orderTimePrice: orderItems.orderTimePrice,
      userName: users.name,
      productName: products.name,
    })
    .from(orderItems)
    .leftJoin(users, eq(orderItems.userId, users.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(inArray(orderItems.orderId, orderIds))

  // 3. Group items by orderId
  const itemsByOrderId = {}
  for (const item of allItems) {
    if (!itemsByOrderId[item.orderId]) {
      itemsByOrderId[item.orderId] = []
    }
    itemsByOrderId[item.orderId].push(item)
  }

  // 4. Shape the final response
  return pendingOrders.map(order => {
    const items = itemsByOrderId[order.id] ?? []
    return {
      id: order.id,
      status: order.orderStatus,
      totalPrice: parseFloat(order.totalPrice),
      orderDate: order.orderDate,
      shippingAddress: order.shippingAddress,
      customerName: items[0]?.userName ?? 'Unknown',
      itemCount: items.length,
      items: items.map(item => ({
        id: item.id,
        productName: item.productName ?? 'N/A',
        quantity: item.quantity,
        price: parseFloat(item.orderTimePrice),
      })),
    }
  })
}

/*
 * 🛡️ --------------------------------------------------- 🛡️
 *               PRODUCT     DETAIL  LOGIC (service for admin)
 * 🛡️ --------------------------------------------------- 🛡️
*/


export const getAdminOrderByIdService = async (orderId) => {
  const result = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      items: {
        with: {
          user: {
            columns: { name: true },
          },
          product: {
            columns: {
              name: true,
              imageUrl: true,
              price: true,
              productCategory: true,   // → item.category on frontend
            },
          },
        },
      },
    },
  });

  if (!result) return null;

  return {
    id: result.id,
    status: result.orderStatus,
    createdAt: result.orderDate,
    shippingAddress: result.shippingAddress,
    totalPrice: parseFloat(result.totalPrice),
    paymentMethod: result.paymentMethod,
    customerName: result.items[0]?.user?.name ?? "Unknown",
    // computed — remove when you have real delivery tracking
    estimatedDelivery: new Date(result.orderDate.getTime() + 7 * 24 * 60 * 60 * 1000),
    items: result.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: parseFloat(item.orderTimePrice),   // snapshot price
      name: item.product?.name ?? "N/A",
      image: item.product?.imageUrl ?? null,
      category: item.product?.productCategory ?? "N/A",
    })),
  };
};


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              ORDER STATUS UPDATE LOGIC (service)
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const updateOrderStatusMethodService = async(orderId, status) => {

	const updated = await db
  	.update(orders)
  	.set({ orderStatus: status })
  	.where(eq(orders.id, orderId))
  	.returning(); 
  	
  	return updated[0] ;
}
