// @ts-nocheck
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */
/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */


export function run(input) {
  const getRef = input.cart.ref?.value;

  // Find the delivery option that contains the getRef value in its title
  let matchingOptionHandle;
  let otherOptionsHandles = [];

  input.cart.deliveryGroups.forEach(group => {
    group.deliveryOptions.forEach(option => {
      console.log(option.title);
      if (option.title.includes(getRef)) {
        matchingOptionHandle = option.handle;
      } else {
        otherOptionsHandles.push(option.handle);
      }
    });
  });

  console.log("Matching Option Handle:", matchingOptionHandle);
  console.log("Other Option Handles:", otherOptionsHandles);

  if (!matchingOptionHandle) return NO_CHANGES;

  return {
    operations: [      
      // Hide all other options
      ...otherOptionsHandles.map(handle => ({
        hide: {
          deliveryOptionHandle: handle,
        },
      })),
    ],
  };
}