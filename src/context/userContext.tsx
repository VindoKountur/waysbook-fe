import { createContext, useReducer, Dispatch, Context } from "react";
import { useCookies } from "react-cookie";

import { UserType } from "../utils/types";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

interface LoginUserInterface {
  isLogin: boolean;
  user: UserType;
}

const initialState: LoginUserInterface = {
  isLogin: false,
  user: {
    email: "",
    role: "",
    token: "",
    photo: "",
  },
};

type UserPayload = {
  [UserActionType.AUTH_ERROR]: null;
  [UserActionType.LOGOUT]: null;
  [UserActionType.LOGIN_SUCCESS]: UserType;
  [UserActionType.USER_SUCCESS]: UserType;
};

export type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];

export const UserContext = createContext<{
  state: LoginUserInterface,
  dispatch : Dispatch<UserAction>
}>({
  state: initialState,
  dispatch : () => {}
});

export enum UserActionType {
  USER_SUCCESS = "USER_SUCCESS",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  AUTH_ERROR = "AUTH_ERROR",
  LOGOUT = "LOGOUT",
}

// Action Inteface
interface UserAction {
  type: UserActionType;
  payload: UserType;
}

export const UserContextProvider = ({ children }: {children : React.ReactNode}) => {
  const [_, setCookies, removeCookies] = useCookies();

  const reducer = (state: LoginUserInterface, action: UserAction): LoginUserInterface => {
    const { type, payload } = action;
    
    switch (type) {
      case UserActionType.USER_SUCCESS:
      case UserActionType.LOGIN_SUCCESS:
        setCookies("token", payload.token, { path: "/" });
        return {
          isLogin: true,
          user: payload,
        };

      case UserActionType.AUTH_ERROR:
      case UserActionType.LOGOUT:
        removeCookies("token", { path: "/" });
        return initialState;
      default:
        console.log("default state");
        return initialState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
