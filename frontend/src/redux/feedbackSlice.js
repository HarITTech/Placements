import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance"; // Assuming axiosInstance is already configured

// Thunks for asynchronous actions

// Create Feedback for a Specific Job
export const createFeedback = createAsyncThunk(
  "feedback/createFeedback",
  async ({ jobId, message, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/job/${jobId}/feedback`, {
        message,
        content,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create feedback."
      );
    }
  }
);

// Like Feedback
export const likeFeedback = createAsyncThunk(
  "feedback/likeFeedback",
  async (feedbackId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/job/feedback/${feedbackId}/like`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like feedback."
      );
    }
  }
);

// Dislike Feedback
export const dislikeFeedback = createAsyncThunk(
  "feedback/dislikeFeedback",
  async (feedbackId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/feedback/${feedbackId}/dislike`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to dislike feedback."
      );
    }
  }
);

// Add Comment to Feedback
export const addCommentToFeedback = createAsyncThunk(
  "feedback/addCommentToFeedback",
  async ({ feedbackId, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/job/feedback/${feedbackId}/comment`,
        { comment }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment."
      );
    }
  }
);

// Get Feedback with Comments
export const getFeedbackWithComments = createAsyncThunk(
  "feedback/getFeedbackWithComments",
  async (feedbackId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feedback."
      );
    }
  }
);

// Get Feedbacks for a Specific Job
export const getFeedbacksForJob = createAsyncThunk(
  "feedback/getFeedbacksForJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/job/${jobId}/feedbacks`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feedbacks."
      );
    }
  }
);

// Delete Feedback
export const deleteFeedback = createAsyncThunk(
  "feedback/deleteFeedback",
  async (feedbackId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/job/feedback/${feedbackId}`
      );
      return { feedbackId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete feedback."
      );
    }
  }
);

// Slice
const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    feedbackDetails: null,
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
      // Create Feedback
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        if (Array.isArray(state.feedbacks)) {
          state.feedbacks.push(action.payload.feedback);
        } else {
          state.feedbacks = [action.payload.feedback];
        }
      })
      .addCase(likeFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(likeFeedback.fulfilled, (state, action) => {
        if (Array.isArray(state.feedbacks)) {
          const feedbackIndex = state.feedbacks.findIndex(
            (feedback) => feedback._id === action.payload._id
          );
          if (feedbackIndex !== -1) {
            state.feedbacks[feedbackIndex] = action.payload;
          } else {
            state.feedbacks.push(action.payload);
          }
        } else {
          state.feedbacks = [action.payload];
        }
      })
      .addCase(likeFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Dislike Feedback
      .addCase(dislikeFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dislikeFeedback.fulfilled, (state, action) => {
        if (Array.isArray(state.feedbacks)) {
          const feedbackIndex = state.feedbacks.findIndex((feedback) => feedback._id === action.payload._id);
          if (feedbackIndex !== -1) {
            state.feedbacks[feedbackIndex] = action.payload;
          } else {
            state.feedbacks.push(action.payload);
          }
        } else {
          state.feedbacks = [action.payload];
        }
      })
      .addCase(dislikeFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Comment to Feedback
      .addCase(addCommentToFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommentToFeedback.fulfilled, (state, action) => {
        if (Array.isArray(state.feedbacks)) {
          const feedbackIndex = state.feedbacks.findIndex((feedback) => feedback._id === action.payload.feedbackId);
          if (feedbackIndex !== -1) {
            state.feedbacks[feedbackIndex].comments.push(action.payload.comment);
          }
        } else {
          // Handle the case where state.feedbacks is not an array
          console.log("Error: state.feedbacks is not an array");
        }
        window.location.reload();
      })
      .addCase(addCommentToFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Feedback with Comments
      .addCase(getFeedbackWithComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedbackWithComments.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackDetails = action.payload;
      })
      .addCase(getFeedbackWithComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Feedbacks for a Specific Job
      .addCase(getFeedbacksForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedbacksForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(getFeedbacksForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        if (Array.isArray(state.feedbacks)) {
          state.feedbacks = state.feedbacks.filter((feedback) => feedback._id !== action.payload.feedbackId);
        } else {
          // Handle the case where state.feedbacks is not an array
          console.log("Error: state.feedbacks is not an array");
        }
        window.location.reload();
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetState } = feedbackSlice.actions;
export default feedbackSlice.reducer;
