import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.July24,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  hostName: "13.202.223.92",
  isCustomStoreApp:true,
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
    },
    PRODUCTS_UPDATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
      callback: async (topic, shop, body, webhookId) => {
        console.log("---- product update-----")
        const payload = JSON.parse(body)
        console.log(payload)
        console.log("---- product update-----")

      }
    },
    PRODUCTS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
      callback: async (topic, shop, body, webhookId) => {
        console.log("---- product update-----")
        const payload = JSON.parse(body)
        console.log(payload)
        console.log("---- product update-----")

      }
    },
    PRODUCTS_DELETE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
      callback: async (topic, shop, body, webhookId) => {
        console.log("---- product update-----")
        const payload = JSON.parse(body)
        console.log(payload)
        console.log("---- product update-----")

      }
    },
    ORDERS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
      callback: async (topic, shop, body, webhookId) => {
        console.log("---- product update-----")
        const payload = JSON.parse(body)
        console.log(payload)
        console.log("---- product update-----")

      }
    },
    ORDERS_DELETE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
      callback: async (topic, shop, body, webhookId) => {
        console.log("---- ORDERS_DELETE-----")
        const payload = JSON.parse(body)
        console.log(payload)
        console.log("---- ORDERS_DELETE-----")

      }
    },
     ORDERS_EDITED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
      callback: async (topic, shop, body, webhookId) => {
        console.log("---- product update-----")
        const payload = JSON.parse(body)
        console.log(payload)
        console.log("---- product update-----")

      }
    },
    ORDERS_UPDATED: {
     deliveryMethod: DeliveryMethod.Http,
     callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
     callback: async (topic, shop, body, webhookId) => {
       console.log("---- product update-----")
       const payload = JSON.parse(body)
       console.log(payload)
       console.log("---- product update-----")

     }
   },
    CUSTOMERS_UPDATE: {
     deliveryMethod: DeliveryMethod.Http,
     callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
     callback: async (topic, shop, body, webhookId) => {
       console.log("---- CUSTOMERS_UPDATE-----")
       const payload = JSON.parse(body)
       console.log(payload)
       console.log("---- CUSTOMERS_UPDATE-----")

     }
   },
    CUSTOMERS_CREATE: {
     deliveryMethod: DeliveryMethod.Http,
     callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
     callback: async (topic, shop, body, webhookId) => {
       console.log("---- CUSTOMERS_CREATE -----")
       const payload = JSON.parse(body)
       console.log(payload)
       console.log("---- CUSTOMERS_CREATE -----")

     }
   },
    CUSTOMERS_DELETE: {
     deliveryMethod: DeliveryMethod.Http,
     callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
     callback: async (topic, shop, body, webhookId) => {
       console.log("----CUSTOMERS_DELETE-----")
       const payload = JSON.parse(body)
       console.log(payload)
       console.log("---- CUSTOMERS_DELETE-----") 

     }
   },
   MARKETS_CREATE: {
     deliveryMethod: DeliveryMethod.Http,
     callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
     callback: async (topic, shop, body, webhookId) => {
       console.log("----MARKETS_CREATE-----")
       const payload = JSON.parse(body)
       console.log(payload)
       console.log("---- MARKETS_CREATE-----") 

     }
   },
   MARKETS_DELETE: {
     deliveryMethod: DeliveryMethod.Http,
     callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
     callback: async (topic, shop, body, webhookId) => {
       console.log("----MARKETS_DELETE-----")
       const payload = JSON.parse(body)
       console.log(payload)
       console.log("---- MARKETS_DELETE-----") 

     }
   },
   MARKETS_UPDATE: {
     deliveryMethod: DeliveryMethod.Http,
     callbackUrl: "https://webhook.site/b12ecd21-40d2-4549-9152-47eb2c93e3d3",
     callback: async (topic, shop, body, webhookId) => {
       console.log("----MARKETS_UPDATE-----")
       const payload = JSON.parse(body)
       console.log(payload)
       console.log("---- MARKETS_UPDATE-----") 

     }
   }
  },
  hooks: {
    afterAuth: async ({ session }) => {
      console.log("Registering webhooks...");
      await shopify.registerWebhooks({ session });
      console.log("Webhooks registered!");
    }
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.July24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
