import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance"; // Assuming axiosInstance is already configured

// Thunks for asynchronous actions

// Send a message from student to admin
export const sendMessageToAdmin = createAsyncThunk(
  "communication/sendMessageToAdmin",
  async (message, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/help/send-to-admin",
        { message }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message to admin."
      );
    }
  }
);

// Send a message from admin to student
export const sendMessageToStudent = createAsyncThunk(
  "communication/sendMessageToStudent",
  async ({ studentId, message }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/help/send-to-student",
        { studentId, message }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message to student."
      );
    }
  }
);

// Get all messages for a student
export const getMessagesForStudent = createAsyncThunk(
  "communication/getMessagesForStudent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/help/messages");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages for student."
      );
    }
  }
);

// Get all messages for an admin
export const getMessagesForAdmin = createAsyncThunk(
  "communication/getMessagesForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/help/admin/messages");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages for admin."
      );
    }
  }
);

// Slice
const communicationSlice = createSlice({
  name: "communication",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Message to Admin
      .addCase(sendMessageToAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendMessageToAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.messages.push(action.payload.communication);
      })
      .addCase(sendMessageToAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Message to Student
      .addCase(sendMessageToStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendMessageToStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.messages.push(action.payload.communication);
      })
      .addCase(sendMessageToStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Messages for Student
      .addCase(getMessagesForStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessagesForStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(getMessagesForStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Messages for Admin
      .addCase(getMessagesForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessagesForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(getMessagesForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetState } = communicationSlice.actions;
export default communicationSlice.reducer;
