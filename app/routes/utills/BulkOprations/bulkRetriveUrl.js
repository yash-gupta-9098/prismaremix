


 const retrieveUrl = async (admin_graphql_api_id , client) => {
    // console.log(admin_graphql_api_id, "admin_graphql_api_id");
  
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


  export default retrieveUrl