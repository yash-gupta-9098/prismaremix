import { json } from "@remix-run/node";
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';

export const loader = async ({ request }) => {
  try {
    // Define the GraphQL query for bulk operations
    const queryString = `mutation {
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
    }`;

    // Initialize Shopify API
    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      isCustomStoreApp: true,
      scopes: ['read_products'],
      hostName: 'new-remix-app.myshopify.com',
      apiVersion: ApiVersion.July24, // Use latest API version
      isEmbeddedApp: true,
      adminApiAccessToken: 'a3356f8c65d97da31485168409432274-1725297491',
      
    });

    console.log(shopify.clients)


    const session = shopify.session.customAppSession(
      "new-remix-app.myshopify.com"
    );
    // Create GraphQL client
    const client = new shopify.clients.Graphql({
      session,
      apiVersion: ApiVersion.July24,
    });

    // Send the GraphQL query
    const response = await client.request(
      `mutation bulkOperationRunQuery($query: String!) {
          bulkOperationRunQuery(query: $query) {
            bulkOperation {
              id
              partialDataUrl
              url
            }
            userErrors {
              field
              message
            }
          }
        }`,
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
    res.send("Hello World!");

    // Debugging - log the response
   

  } catch (error) {
    // Debugging - log the error
    console.error("Error:", error);

    // Handle and return errors
    return json({ error: error.message }, { status: 500 });
  }
};
