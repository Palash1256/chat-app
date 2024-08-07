const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/auto/upload`;

const uploadFile =async(file)=>{
    const fromData =new FormData()
    fromData.append('file',file)
    fromData.append("upload_preset", "chat-app")
    const response =fetch(url,{
        method:'post',
        body:fromData
    })
    const responseData =(await response).json()

    return responseData
}

export default uploadFile