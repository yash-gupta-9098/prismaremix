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
    ` query Product($id : ID!) {
        product(id: $id) {
          description(truncateAt: 300)
          featuredImage {
            altText
            url
          }
          handle
          id
          productType
          title
          tags
          totalInventory
          status
          variants(first: 100) {
            nodes {
              availableForSale
              compareAtPrice
              displayName
              id
              image {
                url
              }
              inventoryItem {
                sku
              }
              price
              sku
            }
          }
        }
      }`,
      {variables:{
        id:`gid://shopify/Product/${id}`
      }
    }
    
)  

const { data } = response || {};
    if (!data || !data.product) {
      throw new Error('No product data found');
    }

    console.log(data, "Data from query");

    // Return the product data in JSON response
    return json({ product: data.product }, { status: 200 });

            

}catch(error){
console.log(error)
}


    return json({status: 200});
    // const shop = url.searchParams.get('shop');
    // const accessToken = request.headers.get("X-Shopify-Access-Token");
    // console.log(shop , accessToken);

}