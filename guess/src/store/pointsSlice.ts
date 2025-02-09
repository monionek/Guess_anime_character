import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userData } from "@/utils/interfaces";

interface PointsState {
    user: userData | null;
    loading: boolean;
    error: string | null;
}

const initialState: PointsState = {
    user: null,
    loading: false,
    error: null,
};
export const fetchUserPoints = createAsyncThunk(
    "points/fetchUserPoints",
    async (username: string, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/get-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName: username }),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to fetch user");
            }

            return data;
        } catch (error) {
            return rejectWithValue("Network error");
        }
    }
);

export const deleteUser = createAsyncThunk(
    "points/deleteUser",
    async (userName: string, { rejectWithValue }) => {
        const response = await fetch('/api/delete-user', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName }),
        });

        if (!response.ok) {
            return rejectWithValue("Failed to delete user");
        }

        return userName;
    }
);

export const updateUserPoints = createAsyncThunk(
    "points/updateUserPoints",
    async ({ userName, newPoints }: { userName: string; newPoints: number }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/change-points', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, points: newPoints }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Failed to update points");
            }

            return newPoints;
        } catch (error) {
            return rejectWithValue("Network error");
        }
    }
);

export const updateProfileIcon = createAsyncThunk(
    "points/updateProfileIcon",
    async ({ userName, profileIcon }: { userName: string; profileIcon: string }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/update-profile-icon', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, profileIcon }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Failed to update profile icon");
            }

            return profileIcon;
        } catch (error) {
            return rejectWithValue("Network error");
        }
    }
);

const pointsSlice = createSlice({
    name: "points",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserPoints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPoints.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserPoints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch user";
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(updateUserPoints.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.points = action.payload;
                }
            })
            .addCase(updateProfileIcon.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.profileIcon = action.payload;
                }
            });
    },
});

export default pointsSlice.reducer;