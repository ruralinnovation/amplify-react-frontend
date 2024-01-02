import userReducer, {
    updateUser,
    selectUser
} from "./user/userSlice";

import userIdReducer,  {
    updateUserId,
    selectUserId,
} from "./user/userIdSlice";

import userNameReducer, {
    updateUserName,
    selectUserName,
} from "./user/userNameSlice";

export {
    userReducer,
    userIdReducer,
    userNameReducer,
    updateUser,
    updateUserId,
    updateUserName,
    selectUser,
    selectUserId,
    selectUserName
};
