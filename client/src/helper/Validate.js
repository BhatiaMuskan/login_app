


import toast from 'react-hot-toast'
import {authenticate} from './helper'


/** validate login page username */
export async function usernameValidate(values){
    const errors=usernameVerify({},values);

    if(values.username){
        const {status}= await authenticate(values.username);
        if(status!==200){
            errors.exist=toast.error('User does not exist');
        }
    }
    return errors;
}

export async function passwordValidate(values){
    const errors=passwordVerify({},values);
    return errors;
}

/**validate password */
function passwordVerify(errors={},values){
    const specialChars = /[!@#$%^&*()\-_=+\|{}\[\];:/?.>]/;

    if(!values.password){
        errors.password=toast.error("Password Required...!");
    }
    else if (/\s/.test(values.username)) { 
        errors.username = toast.error('Invalid username: no spaces allowed!');
    }
    else if(values.password.length<4){
        errors.password=toast.error("Password must be at least 4 characters long");
    }
    else if(!specialChars.test(values.password)){
        errors.password=toast.error("Password must contain at least one special character");
    }
    return errors;
}

/**validate username */
function usernameVerify(error = {}, values) {
    if (!values.username) {
        error.username = toast.error('Username is required!');
    } else if (/\s/.test(values.username)) { 
        error.username = toast.error('Invalid username: no spaces allowed!');
    }
    return error;
}

function mobileVerify(error = {}, values) {
    if (!values.mobile) {
      error.mobile = toast.error("Mobile number is required!");
    } else if (!/^\d{10}$/.test(values.mobile)) {
      error.mobile = toast.error("Invalid mobile number: must be 10 digits!");
    }
    return error;
  }

/**validate reset password */
export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values);

    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error("Password not match...!");
    }

    return errors;
}

/** validate register */
export async function registerValidation(values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors,values);
    emailVerify(errors,values);
    mobileVerify(errors,values);
    return errors;
}

/** validate email */
function emailVerify(error={},values){
    if(!values.email){
        error.email=toast.error("email required");
    }
    else if (/\s/.test(values.email)) { 
        error.email = toast.error('Invalid email');
    }
    else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Invalid email address...!")
    }
    return error;
}

/** validate profile page */
export async function profileValidation(values){
    const errors = emailVerify({}, values);
    return errors;
}

