import { useLocation, Navigate } from "react-router-dom";

export const setToken = (token) => {
    localStorage.setItem("token", token)
}

export const fetchToken = () => {
    return localStorage.getItem("token")
}

export function RequireToken ({children}) {
    let auth = fetchToken()
    let location = useLocation()
    if (!auth) {
        return <Navigate to="/login" state={{from:location}}/>;
    }
    return children;
}

// export function getAuthToken() {
//     const token = localStorage.getItem("token")
//     console.log(token)
//     return token
// }