import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, admin , payload} = await authenticate.webhook(request);

  if (!admin && topic !== "SHOP_REDACT") {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    // The SHOP_REDACT webhook will be fired up to 48 hours after a shop uninstalls the app.
    // Because of this, no admin context is available.
    throw new Response();
  }

  // The topics handled here should be declared in the shopify.app.toml.
  // More info: https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration
  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;
    case "PRODUCTS_CREATE":
      console.log("PRODUCTS_CREATE" , payload)
      return new Response("PRODUCTS_CREATE handled", { status: 200 });
      break;
    case "PRODUCTS_DELETE":
      console.log("PRODUCTS_CREATE" , payload)
      return new Response("PRODUCTS_DELETE handled", { status: 200 });
      break;
      case "ORDER_CREATE":
      console.log("ORDER_CREATE" , payload )
      return new Response("ORDER_CREATE handled", { status: 200 });
      break;
    case "ORDER_EDITED":
        console.log("ORDER_EDITED: ", payload);
        return new Response("ORDER_EDITED handled", { status: 200 });
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }
  return new Response("Internal Server Error", { status: 500 });
  // throw new Response();
};
