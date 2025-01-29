import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../../models/user-info";

const initialState: UserInfo = {
    email: undefined,
    loginSource: undefined
} as unknown as UserInfo;

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state: UserInfo, action: PayloadAction<UserInfo>) => {
            return action.payload;
        },
        clearUserInfo: (state: UserInfo) => {
            return initialState;
        }
    }
});

export const { setUserInfo, clearUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;