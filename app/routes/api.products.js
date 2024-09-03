import { json } from "@remix-run/node";
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";




export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const shop = url.searchParams.get('shop');
  const accessToken = request.headers.get("X-Shopify-Access-Token");
console.log(shop , accessToken);
  const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    isCustomStoreApp: true,
    scopes: ['read_products'],
    hostName: `${shop}`,
    apiVersion: ApiVersion.July24, // Use latest API version
    isEmbeddedApp: true,
    adminApiAccessToken: `${accessToken}`,
    restResources
    
  });
  
  
  const session = shopify.session.customAppSession(
    `${shop}`
  );
  // console.log(session  , "session");
  // Create GraphQL client
  const client = new shopify.clients.Graphql({
    session,
    apiVersion: ApiVersion.July24,
  });


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
`,
      {
        variables: {
          query:
            "query getProducts { products { edges { node { id variants(first: 1) { edges { node { sku }}}}}}}",
        },
      }
    );
    console.log(
      response.data.bulkOperationRunQuery.bulkOperation.id,
      "BULK MUTATION ID"
    );
// let result = ""
    const resultUrl = await retrieveUrl(response.data.bulkOperationRunQuery.bulkOperation.id , client)
    // console.log(result ,  "data  from retriveURL")
    const finalResultData = await fetchBulkData(resultUrl);
    console.log(finalResultData , typeof(finalResultData), Array.isArray(finalResultData) , "finalResultData");
    return json({finalResultData : finalResultData , length: finalResultData.length});

    // Debugging - log the response
   

  } catch (error) {
    // Debugging - log the error
    console.error("Error:", error);

    // Handle and return errors
    return json({ error: error.message }, { status: 500 });
  }
};


const retrieveUrl = async (admin_graphql_api_id , client) => {
  console.log(admin_graphql_api_id, "admin_graphql_api_id");

  const pollOperation = async (resolve, reject) => {
    try {
      const res = await client.request(`
        query {
          node(id: "${admin_graphql_api_id}") {
            ... on BulkOperation {
              id
              status
              errorCode
              createdAt
              completedAt
              objectCount
              fileSize
              url
              partialDataUrl
            }
          }
        }
      `);

      const status = res?.data?.node?.status;
      console.log(status, "res.data.node.status");

      if (status === "RUNNING") {
        console.log("Still running, waiting to recheck...");
        setTimeout(() => pollOperation(resolve, reject), 5000); // Poll every 5 seconds
      } else if (status === "COMPLETED") {
        console.log(res?.data?.node?.url, "Completed, URL fetched");
        resolve(res?.data?.node?.url); // Resolve with the URL
      } else {
        reject(new Error("Bulk operation failed or returned unexpected status"));
      }
    } catch (error) {
      reject(error);
    }
  };

  // Return a Promise that resolves when the bulk operation completes
  return new Promise(pollOperation);
};

const fetchBulkData  = async (url) =>{

  try {
    const response = await fetch(url);

    if(!response.ok){
      throw new Error ("faild  to fetchBulkData function ")
    }

    const data = await response.text();

    const jsonData = data.trim()
    .split("\n")
    .map((line)=>JSON.parse(line));

    console.log(jsonData , "jsonData")
    return (jsonData);

  } catch (error) {
    console.log(error)
  }
} 