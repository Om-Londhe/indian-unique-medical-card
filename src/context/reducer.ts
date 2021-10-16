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
  medicalData: {
    issue: string;
    fees: number;
    medicines: number;
    on: any;
    patientID: string;
  }[];
} = {
  user: null,
  medicalData: [
    { issue: "", fees: 0, medicines: 0, on: new Date(), patientID: "" },
  ],
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_MEDICAL_DATA: "SET_MEDICAL_DATA",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_MEDICAL_DATA:
      return {
        ...state,
        medicalData: action.medicalData,
      };
    default:
      return state;
  }
};

export default reducer;
