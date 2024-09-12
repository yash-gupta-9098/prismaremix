import { json } from "@remix-run/node";
import {createShopifyClient} from "../routes/middleware/index";
import  retrieveUrl  from "./utills/BulkOprations/bulkRetriveUrl.js";
import  {fetchBulkData} from "./utills/BulkOprations/fetchBulkData.js";



export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const shop = url.searchParams.get('shop');
  const accessToken = request.headers.get("X-Shopify-Access-Token");
  console.log(shop , accessToken);
  
  if (!shop || !accessToken){
    return json({status:403 , message: "Please provide valid  shop URL and  access token"});
  }

  // check the middleWare  createShopifyClient
  const { client } = createShopifyClient(shop, accessToken);
  console.log(client , "client 11111");

  try {
    

    // Send the GraphQL query
    const response = await client.request(
      `mutation {
  bulkOperationRunQuery(
    query:"""
    {
      products{
        edges {
          node {
            id
            createdAt
            updatedAt
            title
            handle
            descriptionHtml
            productType
            options {
              name
              position
              values
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
    """
  ) {
    bulkOperation {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}
`
    );
    console.log(
      response.data.bulkOperationRunQuery.bulkOperation.id,
      "BULK MUTATION ID"
    );
    // check the  utills  bulkOpration Folder [ bulkRetriveUrl.js ] 
    const resultUrl = await retrieveUrl(response.data.bulkOperationRunQuery.bulkOperation.id , client)
    // check the  utills  bulkOpration Folder  [ fetchBulkData.js ]
    const finalResultData = await fetchBulkData(resultUrl);
        // Result Return  from  Api 
    return json({finalResultData : finalResultData , length: finalResultData.length}); 
   

  } catch (error) {   
    console.error("Error:", error);   
    return json({ error: error.message }, { status: 500 });
  }
};


