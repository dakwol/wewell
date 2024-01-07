interface ForceUpdateState {
    forceUpdate: boolean;
  }
  
  const initialForceUpdateState: ForceUpdateState = {
    forceUpdate: false,
  };
  
  const forceUpdateReducer = (state = initialForceUpdateState, action: any) => {
    switch (action.type) {
      case 'SET_FORCE_UPDATE':
        // Установка нового значения forceUpdate
        return {
          ...state,
          forceUpdate: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default forceUpdateReducer;
  