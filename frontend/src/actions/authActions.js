import axios from "axios";
import { SubmissionError } from 'redux-form';
import history from "../utils/historyUtils";
import { actions as notifActions } from 'redux-notifications';
const { notifSend } = notifActions;

import { AuthTypes } from "../constants/actionTypes";
import { AuthUrls } from "../constants/urls";
import store from "../store";
import { getUserToken } from "../utils/authUtils";

export function authLogin(token) {
    return {
        type: AuthTypes.LOGIN,
        payload: token
    };
}

export function loginUser(formValues, dispatch, props) {
        const loginUrl = AuthUrls.LOGIN;

        return axios.post(loginUrl, formValues).then((response) => {
            // If request is good...
            // Update state to indicate user is authenticated
            const token = response.data.key;
            dispatch(authLogin(token));

            localStorage.setItem("token", token);

            // redirect to the route '/profile'
            history.push("/profile");
        }).catch(error => {
            const processedError = processServerError(error.response.data);
            throw new SubmissionError(processedError);
        });
}

export function logoutUser() {
    localStorage.removeItem("token");
    return {
        type: AuthTypes.LOGOUT
    };
}

export function signupUser(formValues, dispatch, props) {
    const signupUrl = AuthUrls.SIGNUP;

    return axios.post(signupUrl, formValues)
        .then((response) => {
            // If request is good
            // redirect to login done page.
            history.push("/login");
        })
        .catch((error) => {
            // If request is bad
            // Show an error to the user
            const processedError = processServerError(error.response.data);
            throw new SubmissionError(processedError);
        });
}

function setUserProfile(payload) {
    return {
        type: AuthTypes.USER_PROFILE,
        payload: payload
    };
}

export function getUserProfile() {
    return function(dispatch) {
        const token = getUserToken(store.getState());
        if (token) {
            axios.get(AuthUrls.USER_PROFILE, {
                headers: {
                    authorization: 'Token ' + token
                }
            }).then(response => {
                dispatch(setUserProfile(response.data))
            }).catch((error) => {
                // If request is bad
                // Show an error to the user
                console.log(error);
            });
        }
    };
}


// util functions
function processServerError(error) {
    return  Object.keys(error).reduce(function(newDict, key) {
        if (key === "non_field_errors") {
            newDict["_error"].push(error[key]);
        } else if (key === "token") {
            // token sent with request is invalid
            newDict["_error"].push("The link is not valid any more.");
        } else {
            newDict[key] = error[key];
        }

        return newDict
    }, {"_error": []});
}