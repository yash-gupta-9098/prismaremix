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
    ` query Order($id: ID!) {
  order(id: $id) {
    name
    id
    createdAt
    customer {
      firstName
      lastName
      email
    }
    currencyCode
    totalPriceSet {
      shopMoney {
        amount
        currencyCode
      }
    }
    lineItems(first: 100) {
      edges {
        node {
          title
          quantity
          discountedTotalSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          variant {
            id
            title
            price
            sku
            availableForSale
            image {
              url
            }
          }
        }
      }
    }
    tags    
  }
}
`,
      {variables:{
        id:`gid://shopify/Order/${id}`
      }
    }
    
)  

const { data } = response || {};
    if (!data || !data.order) {
      throw new Error('No order data found');
    }

    console.log(data, "Data from query");

    // Return the product data in JSON response
    return json({ order: data.order }, { status: 200 });

            

}catch(error){
console.log(error)
}


    return json({status: 200});
    // const shop = url.searchParams.get('shop');
    // const accessToken = request.headers.get("X-Shopify-Access-Token");
    // console.log(shop , accessToken);

}