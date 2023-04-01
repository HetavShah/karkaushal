import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_RESET,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_UPDATE_FAIL,
} from "../constants/userConstant";

export const login = (email, password) => async (dispatch) => {
  try {
    console.log('here');
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log('here');
    const { data } = await axios.post(
      "/api/users/signin",
      { email, password },
      config
    );
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    console.log(error.response.data.errors[0].message);
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.errors[0].message
          ? error.response.data.errors[0].message
          : error.message,
    });
  }
};

export const logout = () => async(dispatch) => {
 let data;
 try{
  data=await axios.post('/api/users/signout',{});
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_LIST_RESET });
 }catch(error)
 {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_LIST_RESET });
 }

};

export const register = (name, email, password,age,address,city,postalcode,country,pehchanCardNo="",shopAddress="",website="",isSeller=false) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    const myAge=Number.parseInt(age);
let data;
    if(!isSeller)
    {
        data  = await axios.post(
        "/api/users/signup",
        { name, 
          email, 
          password,
          "age":myAge,
        "isSeller":false,
        "gender":"male",
        "shippingAddress":{
          "address":address,
          "city":city,
          "postalcode":postalcode,
          "country":country
      },
         },
        config
      );

    }
    else{
       data  = await axios.post(
        "/api/users/signup",
        { name, email, password,
          "age":myAge,
        "isSeller":true,
        "gender":"male",
        "shippingAddress":{
          city,postalcode,country,address
        },
        website,shopAddress,pehchanCardNo
         },
        config
      );      

    }
   

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data.data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data.data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    console.log(error)
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
      error.response && error.response.data.errors[0].message
      ? error.response.data.errors[0].message
      : error.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    console.log(userInfo);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    console.log(id);
    console.log('here on getUserDetails');
    const { data } = await axios.get(`/api/users/${id}`, config);
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
      error.response && error.response.data.errors[0].message
      ? error.response.data.errors[0].message
      : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(`/api/users/${user._id}`, user, config);

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
      error.response && error.response.data.errors[0].message
      ? error.response.data.errors[0].message
      : error.message,
    });
  }
};
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users`, config);

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
      error.response && error.response.data.errors[0].message
      ? error.response.data.errors[0].message
      : error.message,
    });
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/users/${id}`, config);

    dispatch({
      type: USER_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
      error.response && error.response.data.errors[0].message
      ? error.response.data.errors[0].message
      : error.message,
    });
  }
};


export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const {data} = await axios.patch(`/api/users/${user._id}`,user, config);

    dispatch({
      type: USER_UPDATE_SUCCESS,
    });
    dispatch({
      type: USER_DETAILS_SUCCESS,payload:data
    })
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
      error.response && error.response.data.errors[0].message
          ? error.response.data.errors[0].message
          : error.message,
    });
  }
};
