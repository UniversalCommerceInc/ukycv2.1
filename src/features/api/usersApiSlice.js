import { USERS_URL } from "../../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (creds) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: creds,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // Wait for login to resolve
          await queryFulfilled;
          // Dispatch the `me` query
          await new Promise(resolve => setTimeout(resolve, 800));
          dispatch(usersApiSlice.endpoints.me.initiate());
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    register: builder.mutation({
      query: (creds) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: creds,
      }),
      invalidatesTags: ["User"], 
    
    }),
    me: builder.query({
      query: () => ({
        url: `${USERS_URL}/me`,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useMeQuery } = usersApiSlice;
