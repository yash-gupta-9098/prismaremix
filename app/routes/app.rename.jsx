import { Page, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";


const productsQuery =
`{
    products {
      edges {
        node {
      handle
      id
      descriptionHtml
      tags
      title
      status
      vendor
      updatedAt
      templateSuffix
      publishedAt
        }
      }
    }
  }`

export const loader= async ({request}) => {   
  console.log(request);
  console.log("starting....") 
  const { admin } = await authenticate.admin(request);
        // const { shop, accessToken } = await authenticate.admin(request);
        // console.log(shop, accessToken ,  "loader run");
    const url = new URL(request.url)
const shop = url.searchParams.get('shop');
const accessToken = request.headers.get("X-Shopify-Access-Token");
console.log(shop , accessToken );
console.log(typeof(accessToken));

const response = await admin.graphql(`
  #graphql
    mutation {
        bulkOperationRunQuery(
    query: """
     ${productsQuery}
 """
    ) {
    bulkOperation {
      id
      status
      query
      rootObjectCount
      type
      partialDataUrl
      objectCount
      fileSize
      createdAt
      url
    }
    userErrors {
      field
      message
    }
  }
} 
`);

  if (response.ok) {
    const data = await response.json();
    console.log(data.data.bulkOperationRunQuery.bulkOperation, "data");

    //pass values function

    return (shop);
  }

  return null;


// return {shop , accessToken};
    // try {
    //   const data = await runBulkOperation(shop , accessToken );
    //   console.log(data ,  "api retun ")
    //   return json(data);
    // } catch (error) {
    //   return json({ error: error.message }, { status: 500 });
    // }

//     const query = `
//     mutation {
//       bulkOperationRunQuery(
//         query: """
//           {
//             products {
//               edges {
//                 node {
//                   id
//                   title
//                 }
//               }
//             }
//           }
//         """
//       ) {
//         bulkOperation {
//           id
//           status
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   try {
//     const response = await fetch(`https://${shop}/admin/api/2024-07/graphql.json`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': accessToken,
//       },
//       body: JSON.stringify({ query }),
//     });
// console.log(response , "response");
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`Shopify API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error during Shopify API request:', error);
//     throw error;
//   }

  };


  export default function Bulk() {
    return ( 

<Page>
    <Text>yash</Text>
</Page>

    )
  }