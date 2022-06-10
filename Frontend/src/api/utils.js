import axios from "axios"

const host = "http://127.0.0.1:8000/"
var url;

export async function uploadFile(fileData){
  url = host + "uploadFile";

  try{
    const response = await axios.post(url, fileData, {
      // headers:{'Content-Type': 'multipart/form-data'}
    });
    return response
  } catch(error){
    console.log(error)
  }
}

export async function createNewUser(data){
  url = host + "users/";

  try{
    const response = await axios.post(url, JSON.stringify(data), {
      headers:{'Content-Type': 'application/json'}
    });
    return response
  } catch(error){
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
  } catch(error){
    console.log(error)
  }
}
