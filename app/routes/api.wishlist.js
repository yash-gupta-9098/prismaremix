import  shopify, { apiVersion }  from "../shopify.server";




export const loader= async ({request}) => {  
  

  console.log("starting....") 
    const url = new URL(request.url)
const shop = url.searchParams.get('shop');
const accessToken = request.headers.get("X-Shopify-Access-Token");
console.log(shop);
const session = shopify.session.customAppSession(shop);  
const client = new shopify.clients.Graphql({
  session,
  apiVersion: apiVersion,
});
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
return ("Hello World!");
  }; 