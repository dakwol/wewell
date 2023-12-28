export const updateData = (key: string, value: any) => ({
    type: 'UPDATE_DATA',
    payload: { key, value }
});
export const updateField = (key: string, value: any) => ({
    type: 'UPDATE_FIELD',
    payload: { key, value }
});
export const updatePreferences = (preferences: number[]) => ({
    type: 'UPDATE_PREF',
    payload: { key: 'PreferencesId', value: preferences }
});

export const logoutUser = () => {
    return { type: 'LOGOUT_USER' };
};
