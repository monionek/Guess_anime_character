"use client";

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

type jwtToken = null | string;

type JwtContextType = {
    jwtToken: jwtToken;
    setJwtToken: Dispatch<SetStateAction<jwtToken>>;
};

const JwtContext = createContext<JwtContextType | undefined>(undefined);

export const JwtProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [jwtToken, setJwtToken] = useState<jwtToken>(null);

    return (
        <JwtContext.Provider value={{ jwtToken, setJwtToken }}>
            {children}
        </JwtContext.Provider>
    );
};

export const useJwt = () => {
    const context = useContext(JwtContext);
    if (context === undefined) {
        throw new Error("useJwt must be used within a JwtProvider");
    }
    return context;
};