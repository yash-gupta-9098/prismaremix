import { json } from "@remix-run/node";
import { GraphqlClient } from '@shopify/shopify-api';

export const loader = async ({ request }) => {
  console.log(request , "resuest")
  try {
    const fetchAllProducts = async () => {
      const queryString = `mutation {
         bulkOperationRunQuery(
          query: """
           {
             products {
               edges {
                 node {
                   id
                   title
                   variants {
                     edges {
                       node {
                         title
                         inventoryQuantity
                         id
                         sku
                         inventoryItem {
                           id
                         }
                         metafields {
                           edges {
                             node {
                               namespace
                               key
                               value
                             }
                           }
                         }
                       }
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
       }`;
       console.log(queryString , "queryString")
       const client = new GraphqlClient({
        domain:  "new-remix-app.myshopify.com", 
        accessToken:"shpua_be02274416e0693ad9ca6d311486487a"
    });
    console.log(client , "client")
      const res = await client.query({
        data: queryString,
      });
      console.log(res , "res")
      return res.body;
    };

    const data = await fetchAllProducts();
    console.log(data , "data")
    return json({ data });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
