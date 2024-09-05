import { json } from "@remix-run/node";
import { createShopifyClient } from "./middleware";

export const action = async ({ request}) => {

    const {shop , accessToken} = await request.json();
    // console.log(data, 'data')
    // console.log(request, "Request")
    const url = new URL(request.url)
  const id = url.searchParams.get('id');
    console.log(id, "Body id")
    console.log(shop, "Body shop")
    console.log(accessToken, "Body AccessToken")
    
 

const { client } = createShopifyClient(shop, accessToken);

try {
const response = await client.request(
    ` query Customer($id: ID!) {
  customer(id: $id) {
    id
    email
    displayName
    createdAt
    phone
    state
    verifiedEmail
  }
}
`,
      {variables:{
        id:`gid://shopify/Customer/${id}`
      }
    }
    
)  

const { data } = response || {};
    if (!data || !data.customer) {
      throw new Error('No order data found');
    }

    console.log(data, "Data from query");

    // Return the product data in JSON response
    return json({ customer: data.customer }, { status: 200 });

            

}catch(error){
console.log(error)
}


    return json({status: 200});
    // const shop = url.searchParams.get('shop');
    // const accessToken = request.headers.get("X-Shopify-Access-Token");
    // console.log(shop , accessToken);

}