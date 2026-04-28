import {orderCreateService, getOrderConfirmationDataService, fetchAllOrderService,  fetchAdminOrderService , getAdminOrderByIdService ,updateOrderStatusMethodService} from "./order.service.js";
/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT ORDER LOGIC
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const createOrder = async(req,res) => {
	const data = req.body;
    console.log('data ... ', req.body);
    const id = req.user.id;
    console.log('loggedIn user Id, ',id);
    
    try{
    	const orderData = await orderCreateService(id, data);
    	console.log('orderData ',orderData)
    	if(orderData) return res.status(201).json(orderData)
    }catch(error){
    	console.log('Error while place order, ',  error.message);
    }
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              ORDER CONFIRMATION LOGIC
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchOrderConfirmationData = async(req,res) => {
		try {
    const { id } = req.params;
    console.log('product id . . .  ', id);
    const orderDetails = await getOrderConfirmationDataService(parseInt(id));

    if (!orderDetails) {
      return res.status(404).json({ message: "Order not found" });
    }

    return  res.status(200).json(orderDetails)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              FETCH ALL ORDERS LOGIC
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchAllOrders = async(req,res) => {
	const orderId = req.params.orderId;
	console.log('request hit ', orderId);
	try {
		const orders = await fetchAllOrderService(orderId)
		
		if(orders) return res.status(200).json(orders)
	}catch(error) {
		console.log('Error while fetching orders for customer ', error.message)
	}
	
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              FETCH ALL ORDERS LOGIC ( admin )
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchAdminOrders = async(req,res) => {

  try {
  	console.log('orders admin req hit conyroller');
    const orderData =  await fetchAdminOrderService()
    console.log('admin orders', orderData)
    if(orderData) {
      return res.status(200).json(orderData)
    }
  } catch(error) {
    console.log('Error while fetching orders for admin', error.message)
  }
}

/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              ADMIN FETCH ORDEr DETAIL LOGIC
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchOrderDetail = async(req,res) => {
	try {
    const { orderId } = req.params;
    const order = await getAdminOrderByIdService(parseInt(orderId));

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
}



/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT ORDER UPDATE STATUS LOGIC
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const updateOrderStatus = async(req,res) => {
console.log(req.body)
	try{
		const {orderId, status} = req.body
		const order = await updateOrderStatusMethodService(Number(orderId), status);
		console.log("updated status . . .  ", order)
		return res.status(200).json(order);
	
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not order status UPDATED" });
  }
}
