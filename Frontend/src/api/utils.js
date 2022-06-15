import axios from "axios"

const host = "http://127.0.0.1:8000/"
var url;



export async function saveRequest( fileid, reason, reqType){
  url = host + "request"

  var data ={
    "req_id": 0,
    "reason": reason,
    "type" : reqType,
    "file_id": fileid
  }

  try{
    const response = await axios.post(url, data);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function downloadAvailablity(hash){
  url = host + "downloadAvailablity?file_url=" + hash
  try{
    const response = await axios.get(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function downloadInfo(hash, usertype, id){

  if(usertype === 'GEUST') url = host + "downloadInfo?download_url=" + hash;

  else{url = host + "downloadInfo?download_url=" + hash + "&user_id=" + id }

  try{
    const response = await axios.post(url, {
      // headers:{'Content-Type': 'multipart/form-data'}
    });
    return response
  } catch(error){
    console.log(error)
  }
}

export async function deleteFile(fileid){
  url = host + "file/" + fileid;
  try{
    const response = await axios.delete(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function clearCache(){
  url = host + "clearCache"
  try{
    const response = await axios.get(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function downloadFileAsUser(hash, fname){
  url = host + "download/" + hash +"/"+fname
  try{
    const response = await axios.get(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function downloadFileAsGuest(hash, fname){
  url = host + "guestDownload/" + hash +"/"+fname
  try{
    const response = await axios.get(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function getFileInfo(hash){
  url = host + "fileInfo/?file_hash=" + hash;
  try{
    const response = await axios.get(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function deleteRequest(reqID){
  url = host + "request?request_id=" + reqID;
  try{
    const response = await axios.delete(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function unblockFile(hashid){
  url = host + "unblock?file_hash=" + hashid;
  try{
    const response = await axios.delete(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function blockFile(hashid){
  url = host + "block?file_hash=" + hashid;
  try{
    const response = await axios.put(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function checkFileStatus(hashid){
  url = host + "checkStatus?file_hash=" + hashid;
  try{
    const response = await axios.get(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function getFileList(userid){
  url = host + "files/" + userid;

  try{
    const response = await axios.get(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function requestInfo(rid){
  url = host + "request/" + rid;

  try{
    const response = await axios.get(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function getRequests(){
  url = host + "requests";

  try{
    const response = await axios.get(url);
    return response
  } catch(error){
    console.log(error)
  }
}

export async function uploadFile(fileData, usertype, id){
  if(usertype === 'GEUST') url = host + "uploadFile";
  else{url = host + "uploadFile?user_id=" + id }
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
  try{
    const response = await axios.post(url, JSON.stringify(data), {
      headers:{'Content-Type': 'application/json'}
    });
    return response
  } catch(error){
    console.log(error)
  }
}
