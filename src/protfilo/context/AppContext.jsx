import React ,{ createContext, useContext, useState} from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppProvider = ({children}) => {
    const [isMobile, setIsMobile] = useState(false);
    
    
    return (
        <AppContext.Provider value={{ isMobile, setIsMobile }}>
            {children}
        </AppContext.Provider>
    )
}