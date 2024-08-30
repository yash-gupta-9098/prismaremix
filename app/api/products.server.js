import { loader } from "../routes/app.products";
import { authenticate } from "../shopify.server";

export const loader = async ({request}) =>{

    const { shop, accessToken } = await authenticate.admin(request);

    const response = await fetch(`https://${shop}/admin/api/2024-07/products.json` , {
        method: "GET",
        headers:{
            "X-Shopify-Access-Token" : accessToken,
            "Content-Type": "application/json"
        }
    });

    if(!response.ok){
        return json({
            error:"Failed to fetch products",
            status: response.status
        })
    }

    const products = await response.json()

    return json(products);

}