interface UserState {
    name: string,
    phoneNumber: string,
    isAllPreferences: boolean,
    preferences: []
}

const initialState: UserState = {
    name: '',
    phoneNumber: '',
    isAllPreferences: false,
    preferences: []
};

const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };
        case 'UPDATE_PREF':
            return {
                ...state,
                preferences: action.payload.value
            };

        default:
            return state;
    }
};

export default userReducer;
