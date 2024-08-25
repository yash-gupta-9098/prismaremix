import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { BlockStack, Button, Card, Page, TextField } from "@shopify/polaris";
import { useState } from "react";
import { createDiscount } from "../api/prisma.server";


export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
  
    const dynamicTitle = formData.get('title');
    const startsAt = formData.get('startsAt');
    const endsAt = formData.get('endsAt');
    const minimumRequirementSubtotal = Number(formData.get('minimumRequirementSubtotal'));
    const discountAmount = Number(formData.get('discountAmount'));
  
    try {
      const response = await admin.graphql(
        `#graphql
          mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
            discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
              automaticDiscountNode {
                id
                automaticDiscount {
                  ... on DiscountAutomaticBasic {
                    startsAt
                    endsAt
                    minimumRequirement {
                      ... on DiscountMinimumSubtotal {
                        greaterThanOrEqualToSubtotal {
                          amount
                          currencyCode
                        }
                      }
                    }
                    customerGets {
                      value {
                        ... on DiscountAmount {
                          amount {
                            amount
                            currencyCode
                          }
                          appliesOnEachItem
                        }
                      }
                      items {
                        ... on AllDiscountItems {
                          allItems
                        }
                      }
                    }
                  }
                }
              }
              userErrors {
                field
                code
                message
              }
            }
          }`,
        {
          variables: {
            automaticBasicDiscount: {
              title: dynamicTitle,
              startsAt,
              endsAt,
              minimumRequirement: {
                subtotal: {
                  greaterThanOrEqualToSubtotal: minimumRequirementSubtotal,
                },
              },
              customerGets: {
                value: {
                  discountAmount: {
                    amount: discountAmount,
                    appliesOnEachItem: false,
                  },
                },
                items: {
                  all: true,
                },
              },
            },
          },
        }
      );
  
      if (response.ok) {
        const responseJson = await response.json();
        console.log('created discount');

          await createDiscount(
          {
            title:dynamicTitle,
            startsAt: startsAt,
            endsAt: endsAt,
            minimumRequirementSubtotal: minimumRequirementSubtotal,
            discountAmount:discountAmount,
          }
          )


        return json({
          discount: responseJson.data,
        });

      }
  
      return null;
    } catch (err) {
      console.log(err);
      return json({ error: err.message }, { status: 500 });
    }
  };


export default function Discounts(){
  const [title, setTitle] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [minimumRequirementSubtotal, setMinimumRequirementSubtotal] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');

  const submit = useSubmit();
  const actionData = useActionData();
  const generateDiscount = () => submit({}, { replace: true, method: 'POST' });

  return (
    <Page>
      <Card sectioned>
        <Form onSubmit={generateDiscount} method="post">

        <BlockStack gap={400}>
          <TextField
            id="title"
            name="title"
            label="Discount Title"
            autoComplete="off"
            value={title}
            onChange={(value) => setTitle(value)}
          />
          <TextField
            id="startsAt"
            name="startsAt"
            label="Start Date (2024-08-28T00:00:00Z)"
            autoComplete="off"
            value={startsAt}
            onChange={(value) => setStartsAt(value)}
          />
          <TextField
            id="endsAt"
            name="endsAt"
            label="End Date (2024-09-28T00:00:00Z)"
            autoComplete="off"
            value={endsAt}
            onChange={(value) => setEndsAt(value)}
          />
          <TextField
            id="minimumRequirementSubtotal"
            name="minimumRequirementSubtotal"
            label="Minimum Subtotal"
            type="number"
            autoComplete="off"
            value={minimumRequirementSubtotal}
            onChange={(value) => setMinimumRequirementSubtotal(value)}
          />
          <TextField
            id="discountAmount"
            name="discountAmount"
            label="Discount Amount"
            type="number"
            autoComplete="off"
            value={discountAmount}
            onChange={(value) => setDiscountAmount(value)}
          />
          <div>
          <Button submit variant="primary">Create Discount</Button>
          </div>
          </BlockStack>
        </Form>
      </Card>
    </Page>
  );
};


