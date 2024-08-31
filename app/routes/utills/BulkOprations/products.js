// app/utils/shopify.ts

import fetch from 'node-fetch';

export async function runBulkOperation(shop, accessToken) {
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
}
