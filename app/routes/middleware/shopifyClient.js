import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-07';

export const createShopifyClient = (shop, accessToken) => {
  console.log(shop, accessToken , "inside create shopify client ")
  const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    isCustomStoreApp: true,
    scopes: ['read_products', 'read_orders', 'read_customers'], // Add necessary scopes
    hostName: shop,
    apiVersion: ApiVersion.July24,
    isEmbeddedApp: true,
    adminApiAccessToken: accessToken,
    restResources,
  });

  const session = shopify.session.customAppSession(shop);

  console.log(session , "session ")
  const client = new shopify.clients.Graphql({
    session,
    apiVersion: ApiVersion.July24,
  });
  console.log(client , "client bottom  the  generate  client ")
  return { session, client };
};
