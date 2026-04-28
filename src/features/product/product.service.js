import { eq } from 'drizzle-orm';
import {db} from '../../database/db.connection.js';
import { products } from './product.schema.js';
/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT UPLOAD LOGIC 
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const uploadProductService = async(productData)=>{
    console.log('product data at service ... ', productData);

    const product = await db.insert(products).values({
    name: productData.name,
    category: productData.category,
    description: productData.description,
    price: productData.price, // Passed as a float/number
    inStock: productData.inStock,
    rating: productData.rating,
    reviews: productData.reviews,
    image: productData.image // URl from CLOUDINARY
  }).returning();
  
  console.log("Product saved successfully!");

  return product
    

}

/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT FETCH LOGIC 
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchProductService = async()=> {
 console.log('request hit fetch produt service . . . ');
  const productsData = await db.select().from(products);
  console.log('products records at service ', productsData);

  return productsData
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT FETCH LOGIC by ID
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const fetchProductByIDService = async(id)=>{
  const [productData] = await db.select().from(products).where(eq(products.id, id)).limit(1)
  return productData;
}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT UPDATE DATA LOGIC 
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const updateProductService = async(id,data)=>{
	const [result] = await db.update(products)
    .set(data) // Drizzle automatically maps the object keys to columns
    .where(eq(products.id, id))
    .returning(); // Returns the updated row
    
    return result

}


/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT DELETE LOGIC 
 * 🛡️ --------------------------------------------------- 🛡️
*/


export const deleteProductService = async(id)=>{
	console.log('get a delete request at service method . . . ')
	const deletedRows = await db.delete(products)
    .where(eq(products.id, id))
    .returning(); // Optional: returns the deleted record

  return deletedRows[0];
}




/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCTS FETCH LOGIC (customer )
 * 
 * 🛡️ --------------------------------------------------- 🛡️
*/


export const fetchProductCategoryByService = async(category)=>{
   console.log('category at service .', category)
   
   let data;

if(category !== "All") {
  data = await db.select().from(products).where(eq(products.category, category));} else {
  data = await db.select().from(products) }

  return data ;
}



/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              PRODUCT FETCH DATA LOGIC by Customer ~ details 
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const detailFetchService = async(id)=> {
  const response = await db.select().from(products).where(eq(products.id, id))

  return response
}
