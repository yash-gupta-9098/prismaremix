
import { json} from '@remix-run/node'; 
import { runBulkOperation } from './utills/BulkOprations/products';
import fetch from 'node-fetch';



export const loader= async ({request}) => {    
        // const { shop, accessToken } = await authenticate.admin(request);
        // console.log(shop, accessToken ,  "loader run");
    const url = new URL(request.url)
const shop = url.searchParams.get('shop');
const accessToken = request.headers.get("X-Shopify-Access-Token");
console.log(shop , accessToken );
    // try {
    //   const data = await runBulkOperation(shop , accessToken );
    //   console.log(data ,  "api retun ")
    //   return json(data);
    // } catch (error) {
    //   return json({ error: error.message }, { status: 500 });
    // }

    const query = `
    mutation {
      bulkOperationRunQuery(
        query: """
          {
            products {
              edges {
                node {
                  id
                  title
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
  `;

  try {
    const response = await fetch(`https://${shop}/admin/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query }),
    });
console.log(response , "response");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shopify API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during Shopify API request:', error);
    throw error;
  }

  };