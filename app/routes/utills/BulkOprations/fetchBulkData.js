export  const fetchBulkData  = async (url) =>{

    try {
      const response = await fetch(url);
  
      if(!response.ok){
        throw new Error ("faild  to fetchBulkData function ")
      }
  
      const data = await response.text();
  
      const jsonData = data.trim()
      .split("\n")
      .map((line)=>JSON.parse(line));
  
      console.log(jsonData , "jsonData")
      return (jsonData);
  
    } catch (error) {
      console.log(error)
    }
  } 

  