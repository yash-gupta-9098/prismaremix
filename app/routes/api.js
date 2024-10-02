import {json} from "@remix-run/node"


export const action = async ()=>{
    console.log("it is in action")
    return json({success: true})
}

export const loader = async ()=>{

    return json({message:"this is  api loader"})
}