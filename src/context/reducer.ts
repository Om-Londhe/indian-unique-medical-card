export const initialState: {
  user: null | {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    userType: string;
    photoURL: string;
  };
  verified: boolean;
} = {
  user: null,
  verified: false,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_VERIFIED: "SET_VERIFIED",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_VERIFIED:
      return {
        ...state,
        verified: action.verified,
      };
    default:
      return state;
  }
};

export default reducer;
