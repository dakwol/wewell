interface UserState {
    id: number,
    name: string,
    phoneNumber: string,
    isAllPreferences: boolean,
    url: string,
    avatarPath: string,
    preferences: []
}

const initialState: UserState = {
    id: 0,
    name: '',
    phoneNumber: '',
    isAllPreferences: false,
    url: '',
    avatarPath: '',
    preferences: []
};

const userData = (state = initialState, action?: any) => {
    switch (action.type) {
        case 'UPDATE_DATA':
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };
        default:
            return state;
    }
};

export default userData;
