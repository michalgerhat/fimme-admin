import React, { useState, useEffect, createContext } from 'react';

export const Context = createContext();

export function ContextProvider (props)
{
    const [ws, setWs] = useState(null);
    const [missedMessage, setMissedMessage] = useState(null);
    const [connected, setConnected] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [users, setUsers] = useState([]);
    const [connections, setConnections] = useState([]);

    useEffect(() =>
    {
        if (ws)
        {
            ws.onopen = () =>
            {
                setConnected(true);
            }

            ws.onerror = () =>
            {
                setConnected(false);
            }

            ws.onmessage = (e) =>
            {
                var msg = JSON.parse(e.data);
                console.log(msg);

                switch (msg.channel)
                {
                    case "admin-login-accepted":
                        setAccessToken(msg.data.accessToken);
                        setRefreshToken(msg.data.refreshToken);
                        setLoggedIn(true);
                        break;

                    case "admin-login-denied":
                        setLoggedIn(false);
                        break;

                    case "authenticated":
                        setAccessToken(msg.data.accessToken);
                        setRefreshToken(msg.data.refreshToken);
                        break;

                    case "unauthenticated":
                        setMissedMessage(msg.data);
                        ws && ws.send(JSON.stringify({ token: null, channel: "authenticate", data: refreshToken }));
                        break;

                    case "users-list":
                        setUsers(msg.data);
                        break;

                    case "connections-list":
                        setConnections(msg.data);
                        break;

                    case "register-accepted":
                    case "user-removed":
                        ws && ws.send(JSON.stringify({ token: accessToken, channel: "fetch-users", data: "" }));
                        break;

                    case "logged-out":
                        setUsers([]);
                        setConnections([]);
                        setLoggedIn(false);
                        setConnected(false);
                        setAccessToken(null);
                        setRefreshToken(null);
                        ws && ws.close();
                        setWs(null);
                        break;

                    default:
                        break;
                }
            }

            ws.onclose = () =>
            {
                setConnected(false);
            }
        }
    }, [ws, accessToken, refreshToken]);

    useEffect(() =>
    {
        if (missedMessage) 
        {
            ws && ws.send(JSON.stringify({ token: accessToken, channel: missedMessage.channel, data: missedMessage.data }));
            setMissedMessage(null);
        }
    }, [ws, accessToken, refreshToken, missedMessage]);

    const connect = (url) =>
    {
        if (url !== "")
            setWs(new WebSocket(url));
    };

    const login = (username, password) =>
    {
        var data =  { username: username, password: password };
        ws && ws.send(JSON.stringify({ token: accessToken, channel: "request-admin-login", data: data }));
    };

    const logout = () =>
    {
        ws && ws.send(JSON.stringify({ token: accessToken, channel: "request-logout", data: refreshToken }));
    };

    const createUser = (username, password) =>
    {
        var data = { username: username, password: password };
        ws && ws.send(JSON.stringify({ token: accessToken, channel: "request-register", data: data }));
    };

    const changePassword = (username, password) =>
    {
        var data = { username: username, password: password };
        ws && ws.send(JSON.stringify({ token: accessToken, channel: "change-password", data: data }));
    };

    const removeUser = (username) =>
    {
        ws && ws.send(JSON.stringify({ token: accessToken, channel: "remove-user", data: username }));
    };

    const refreshUsers = () =>
    {
        ws && ws.send(JSON.stringify({ token: accessToken, channel: "fetch-users", data: "" }));
    };

    const refreshConnections = () =>
    {
        ws && ws.send(JSON.stringify({ token: accessToken, channel: "fetch-connections", data: "" }));
    };

    return (
        <Context.Provider
            value={{
                users: users,
                connections: connections,
                connected: connected,
                loggedIn: loggedIn,
                connect: (url) => connect(url),
                login: (username, password) => login(username, password),
                logout: () => logout(),
                createUser: (username, password) => createUser(username, password),
                changePassword: (username, password) => changePassword(username, password),
                removeUser: (username) => removeUser(username),
                refreshUsers: () => refreshUsers(),
                refreshConnections: () => refreshConnections()}}>
                    {props.children}
        </Context.Provider>
    );
}

export const ContextConsumer = Context.Consumer;