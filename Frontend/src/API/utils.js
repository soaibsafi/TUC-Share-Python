import axios from "axios"

const host = "http://127.0.0.1:8000/"
var url;

export async function createNewUser(data){
  url = host + "users/";
  // debugger
  try{
    const response = await axios.post(url, JSON.stringify(data), {
         headers:{'Content-Type': 'application/json'}
    });
    return response
  }catch(error){
    console.log(error)
  }
}


export async function login(data){
  url = host + "login";
  // debugger
  try{
    const response = await axios.post(url, JSON.stringify(data), {
      headers:{'Content-Type': 'application/json'}
    });
    return response
  }catch(error){
    console.log(error)
  }
}
