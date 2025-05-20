import React, { createContext, useContext, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [, setSocketState] = useState(0); // force update

    const createSocket = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
            auth: {
                token: localStorage.getItem("token"),
            },
            withCredentials: true,
        });
        setSocketState(s => s + 1); // force update to re-render consumers
    }, []);

    // Create socket on mount if token exists
    React.useEffect(() => {
        if (localStorage.getItem("token")) {
            createSocket();
        }
        // eslint-disable-next-line
    }, []);

    // Expose refreshSocket to consumers
    const value = React.useMemo(() => ({
        socket: socketRef.current,
        refreshSocket: createSocket
    }), [createSocket, socketRef.current]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
