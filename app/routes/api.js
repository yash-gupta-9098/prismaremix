import {json} from "@remix-run/node"



export const action = async ()=>{
    console.log("it is in action")
    return json({success: true , error:"402"})
}

export const loader = async ()=>{

    return json({message:"this is  api loader"})
}