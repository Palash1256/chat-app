import React, { createContext, useContext, useRef } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    if (!socketRef.current) {
        socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
            auth: {
                token: localStorage.getItem("token"),
            },
            withCredentials: true,
        });
    }

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};
