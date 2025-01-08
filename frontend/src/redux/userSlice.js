import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie"; // Import js-cookie library

// Thunk for login functionality
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { mpsp } = response.data.user;

      // Store token securely using Cookies.set
      Cookies.set("mpsp", mpsp, {
        path: "/",
        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS // Prevent cross-site usage
        expires: 7, // Optional: Token expires in 7 days
        sameSite: "None" 
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Thunk for logout functionality
// Thunk for logout functionality
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call the logout API
      await axiosInstance.post("/auth/logout");

      // Clear token from cookies
      Cookies.remove("mpsp", { path: "/" }); // Ensure the path matches

      // Remove persist:root from localStorage to clear Redux state
      localStorage.removeItem("persist:root");

      return {}; // Return an empty object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);


// Thunk for fetching user by ID
// export const fetchUserById = createAsyncThunk(
//   "user/fetchUserById",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/auth/user/${userId}`);
//       return response.data.user; // Ensure we are only returning the user object
//     } catch (error) {
//       return rejectWithValue(error.response.data.message || "Failed to fetch user");
//     }
//   }
// );
export const fetchUserById = createAsyncThunk(
  "user/fetchUser ById",
  async (userId, { getState, rejectWithValue }) => {
    const { user, student } = getState().user;

    // Avoid API call if the user data for the given ID is already present
    if (student && student._id === userId) {
      return student; // Return cached user data
    }

    try {
      const response = await axiosInstance.get(`/auth/user/${userId}`);
      return response.data.user; // Return fetched user data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);



export const getProfileCompletionDetails = createAsyncThunk(
  "user/getProfileCompletionDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/get-profile-completion");
      return response.data.profileDetails; // Return profile completion details
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to fetch profile completion details");
    }
  }
);

// Thunk for updating student profile
export const updateStudentProfile = createAsyncThunk(
  "user/updateStudentProfile",
  async (profileUpdates, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/auth/update-profile/${profileUpdates.studentId}`, profileUpdates);
      return response.data; // Return updated student profile
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile");
    }
  }
);

// Thunk for updating profile picture
export const updateProfilePic = createAsyncThunk(
  "user/updateProfilePic",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/updateProfilePic", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // For file upload
        },
      });
      return response.data.profilePic; // Return the new profile picture URL
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile picture");
    }
  }
);

// Thunk for listing users of a specific college
export const listUsersOfCollege = createAsyncThunk(
  "user/listUsersOfCollege",
  async (collegeId, { rejectWithValue, getState }) => {
    const { user } = getState();
    if (user.collegeUsers.length > 0) {
      return user.collegeUsers; // Return cached data if available
    }

    try {
      const response = await axiosInstance.get(`/auth/college/${collegeId}/users`);
      return response.data.users; // Return the list of users
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users of the college");
    }
  }
);

export const createStudent = createAsyncThunk(
  "user/createStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/create-student", studentData);
      return response.data.student; // Return the created student data
    } catch (error) {
      console.log("Error response:", error.response); // Log the full error response
      return rejectWithValue(error.response?.data || "Failed to create student");
    }
  }
);

// Thunk for deleting a user
export const deleteUser  = createAsyncThunk(
  "user/deleteUser ",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/auth/delete-student/${userId}`);
      return response.data; // Return the deleted user data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);



const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: Cookies.get("mpsp") || null, // Fetch token from cookies
    profileCompletionDetails: [],
    collegeUsers: [],
    student: null,
    createdStudent: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.user = null;
      state.token = null;
       state.student  = null;
      state.profileCompletionDetails = []; 
      state.collegeUsers = [];
      state.createdStudent = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.user.token;
        state.status = "succeeded";
        state.error = null;
        window.location.reload();
      })
      .addCase(loginUser .pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser .rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Debugging
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "succeeded";
        state.error = null;
        // Refresh the page to log out the user
        window.location.reload();
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload; // 
        state.student  = action.payload;                          // Set the fetched user data
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
       state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getProfileCompletionDetails.fulfilled, (state, action) => {
        state.profileCompletionDetails = action.payload; // Store profile completion details
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getProfileCompletionDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        // Replace the whole user object with the updated profile
        state.user = { ...state.user, profile: action.payload.profile };
        state.status = "succeeded";
      })
    .addCase(updateStudentProfile.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(updateProfilePic.fulfilled, (state, action) => {
      // Update the profile picture URL in the state
      state.user.profile.profilePic = action.payload;
      state.status = "succeeded";
    })
    .addCase(updateProfilePic.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(listUsersOfCollege.fulfilled, (state, action) => {
      state.collegeUsers = action.payload; // Store the list of users
      state.status = "succeeded";
      state.error = null;
    })
    .addCase(listUsersOfCollege.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    // Existing cases...
    .addCase(createStudent.fulfilled, (state, action) => {
      state.createdStudent = action.payload; // Store the created student
      state.status = "succeeded";
      state.error = null;
    })
    .addCase(createStudent.pending, (state) => {
      state.status = "loading";
    })
    .addCase(createStudent.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(deleteUser .pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteUser .fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
    })
    .addCase(deleteUser .rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const { resetState } = userSlice.actions;
export default userSlice.reducer;
