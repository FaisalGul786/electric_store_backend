import {uploadProductService, fetchProductService ,  fetchProductByIDService, updateProductService, deleteProductService, fetchProductCategoryByService, detailFetchService} from './product.service.js';
/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT UPLOAD LOGIC 
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const uploadProduct = async(req,res)=>{
    console.log('product data ... ', req.body);

    try {

        const result = await uploadProductService(req.body);
        console.log('product upload result ', result);

        if(result) return res.status(201).json(result);

    } catch(error) {
        console.log('UPLOAD ERROR ❌', error); // 👈 add this
        return res.status(500).json({message: "product not uploaded due to server side issue"})
    }
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCTS FETCH LOGIC 
 * 
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchProducts = async(req,res)=>{
    console.log('products get request hit . ');

    try {
        const result = await fetchProductService();
        console.log('fetched products . . .', result);
        return res.status(200).json(result);
    } catch(error) {
        console.log('Error while fetching prducts data', error.message);
    }
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT FETCH LOGIC 
 * 
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchProduct = async(req,res)=>{
    const productID = req.params.id;
    console.log('id to fetch product . . ', productID)
    try {
        const product = await fetchProductByIDService(productID)
        console.log('product by id ',  product)

        return res.status(200).json(product)
    }
    catch(error){
        
        console.log('Error while fetching prduct data', error.message);

    }
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT UPDATE LOGIC 
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const updateProduct = async(req,res)=>{
	const productId = req.params.productId;
	console.log('productId . . . ', productId);
	const updateData = req.body;
	console.log('updateData . . .', updateData);
	try {
	const updatedProduct = await updateProductService(productId, updateData);
	console.log('updated product . . . ', updatedProduct);
	return res.status(201).json(updatedProduct);
	}catch(error){
	console.log('Error while patching product data ', error.message)
	}
	
}



/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT DELETE LOGIC 
 * 🛡️ --------------------------------------------------- 🛡️
*/


export const productDelete = async(req,res)=>{
	const productId = req.params.productId;
	const product = await deleteProductService(productId);
	if(product) return res.status(200).json({message:'product deleted from database'})
}




/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCTS FETCH LOGIC ( customer prodects)
 * 
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchProductsByCategory = async(req,res)=>{
    const category = req.query.productCategory;
    console.log('category .', category);
    
    try{
        const data = await fetchProductCategoryByService(category);
        console.log('fetched DATA for customer ', data);

        if(data) {return res.status(200).json(data)}
    } catch(error) {
        console.log('Error while fetching prducts customer DATA', error.message);
    }
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT FETCH LOGIC for customer details
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchProductDetail = async(req,res)=> {
    const id = req.params.id;
    console.log('product details id ... ', id);

    try {
        const data = await detailFetchService(id);
        console.log('data ... ', data)
        if(data) return res.status(200).json(data);
    } catch(error){
        console.log('Error while request product ', error.message);
    }
}
