// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://apiservice.ukycv2o1.universalcommerce.io/",
//     // baseUrl: "https://apiservice.ukycv2.universalcommerce.io/",
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.token;
//       // console.log(token, "token------------")
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({}),
// });





import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../auth/authSlice"; // Adjust the import based on your file structure

// Define the base query with the appropriate headers
const baseQuery = fetchBaseQuery({
  baseUrl: "https://apiservice.ukycv2o1.universalcommerce.io/",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrap the base query to handle 401 errors
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // If a 401 error is detected, dispatch the logout action
    api.dispatch(logout());
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
