import { createContext, useContext } from "react";

const RootContext = createContext(null);
export const RootContextProvider = RootContext.Provider;
export const useRootContext = () => useContext(RootContext);

