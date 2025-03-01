


import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
/**Make Api Request */


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


/**get data from the token */
// export async function getUsername() {
//     const token = localStorage.getItem('token');
//     if (!token) return Promise.reject("Cannot find token");
    
//     try {
//         const decoded = jwtDecode(token);
//         return decoded;
//     } catch (error) {
//         return Promise.reject("Invalid token");
//     }
// }
/**authenticate function */
export async function authenticate(username){
    try{
      return await axios.post('/api/authenticate',{username});
    }catch(error){
        return {error:"Username not found"}
    }
}

/**get user details */
export async function getUser({username}){
    try{
        const {data}=await axios.get(`/api/user/${username}`);
        return {data};
    }catch(error){
        return {error:"Password not match"};
    }
}

/**register the user */
export async function registerUser(credentials) {
    try {
      const { data: { msg }, status } = await axios.post('/api/register', credentials);
  
      // Extract username and email
      const { username, email } = credentials;
  
      if (status === 201) {
        const subject = "Welcome to Our Service"; // Define the subject
        await axios.post('/api/registerMail', { username, userEmail: email, text: msg, subject });
      }
  
      return Promise.resolve(msg); // Return the success message
    } catch (error) {
      // Handle and propagate error
      return Promise.reject(error.response?.data || error.message || { error: "Registration failed" });
    }
  }
  
/** Send OTP to the user's registered phone number */
export async function sendOtp(username) {
    try {
      const { data } = await axios.post("/api/sendotp", { username });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response?.data || { error: "Failed to send OTP." });
    }
  }
  
  /** Login using username and OTP */
  export async function loginWithOtp({ username, otp }) {
    try {
      const { data } = await axios.post("/api/login", { username, otp });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response?.data || { error: "Login failed." });
    }
  }


/**login function */
// export async function verifyPassword({username,password}){
//     try{
//         if(username){
//             const {data}=await axios.post('/api/login',{username,password});
//             return Promise.resolve({data});
//         }
//     }catch(error){
//         return Promise.reject({error:"Password does not match"});
//     }
// }

/**update user profile function */
export async function updateUser(response){
    try{
      const token=await localStorage.getItem('token');
      const {data}=await axios.put('/api/updateuser',response,{headers:{"Authorization":`Bearer ${token}`}});
      return Promise.resolve({data});
    }catch(error){
        return Promise.reject({error:"could not update profile"});
    }
}

/**generate otp */
export async function generateOTP({username}){
    try{
      const {data:{code},status}=await axios.get('/api/generateOTP',{params:{username}});

      //send mail with otp
      if(status===201){
        let {data:{email}}= await getUser({username});
        let text=`Your Password Recovery OTP is ${code}.Verify and recover your password`;
        await axios.post('/api/registerMail',{username,userEmail:email,text,subject:"Password Recovery Email"});
      }
      return Promise.resolve(code);
    }catch(error){
        return Promise.reject({error});
    }
}

/**Verify OTP */
export async function verifyOTP({username,code}){
    try{
      const {data,status}= await axios.get('/api/verifyOTP',{params:{username,code}});
      return {data,status};
    }catch(error){
        return Promise.reject({error});
    }
}

/**reset password */
export async function resetPassword({username,password}){
    try{
        const {data,status}=await axios.put('/api/resetPassword',{username,password});
        return Promise.resolve({data,status});
    }catch(error){
        return Promise.reject({error});
    }
}


