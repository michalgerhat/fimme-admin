import React, { useState, createContext } from 'react';
import { useSnackbar } from 'notistack';
import Cookies from 'universal-cookie';

export const Context = createContext();

export function ContextProvider (props)
{
    const cookies = new Cookies();
    const { enqueueSnackbar } = useSnackbar();

    const [ws, setWs] = useState(null);
    const [lastUrl, setLastUrl] = useState(null);
    const [missedMessage, setMissedMessage] = useState(null);
    const [connected, setConnected] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [users, setUsers] = useState([]);
    const [connections, setConnections] = useState([]);

    if (ws)
    {
        ws.onopen = () =>
        {
            enqueueSnackbar("Connected to the server.");
            setConnected(true);
            cookies.set("fimme-server", lastUrl);
            var token = cookies.get("fimme-token");
            if (token)
                sendMessage("authenticate", token);
        }

        ws.onmessage = (e) =>
        {
            var msg = JSON.parse(e.data);

            switch (msg.channel)
            {
                case "admin-login-accepted":
                    set(msg.data.accessToken, msg.data.refreshToken);
                    break;

                case "admin-login-denied":
                    enqueueSnackbar("Login denied. Please check your credentials.");
                    setLoggedIn(false);
                    break;

                case "authenticated":
                    set(msg.data.accessToken, msg.data.refreshToken);
                    if (missedMessage) 
                    {
                        sendMessage(missedMessage.channel, missedMessage.data);
                        setMissedMessage(null);
                    }
                    break;

                case "unauthenticated":
                    if (msg.data.channel !== "authenticate")
                    {
                        setMissedMessage(msg.data);
                        sendMessage("authenticate", refreshToken);
                    }
                    else
                        reset();
                    break;

                case "users-list":
                    setUsers(msg.data);
                    break;

                case "connections-list":
                    setConnections(msg.data);
                    break;

                case "register-accepted":
                    enqueueSnackbar("User created.");
                    sendMessage("fetch-users", "");
                    break;

                case "user-removed":
                    enqueueSnackbar("User removed.");
                    sendMessage("fetch-users", "");
                    break;

                case "logged-out":
                    reset();
                    break;

                default:
                    break;
            }
        }

        ws.onclose = () =>
        {
            enqueueSnackbar("Connection with server failed. Trying to reconnect...");
            setConnected(false);
            if (lastUrl)
                setWs(new WebSocket(lastUrl));
        }
    }

    function set(accessToken, refreshToken)
    {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        cookies.set("fimme-token", refreshToken);
        setLoggedIn(true);
    }

    function reset()
    {
        setUsers([]);
        setConnections([]);
        setLoggedIn(false);
        setConnected(false);
        setAccessToken(null);
        setRefreshToken(null);
        ws && ws.close();
        setWs(null);
        setLastUrl(null);
        cookies.remove("fimme-token");
        cookies.remove("fimme-server");
        enqueueSnackbar("Logged out.");
    }

    function sendMessage(channel, data)
    {
        var token = channel === "authenticate" ? null : accessToken; 
        ws && ws.send(JSON.stringify({ token: token, channel: channel, data: data }));
    }

    const connect = (url) =>
    {
        if (url !== "")
        {
            setLastUrl(url);
            setWs(new WebSocket(url));
        }
    };

    const login = (username, password) =>
    {
        var data =  { username: username, password: password };
        sendMessage("request-admin-login", data);
    };

    const logout = () =>
    {
        sendMessage("request-logout", refreshToken);
    };

    const createUser = (username, password) =>
    {
        var data = { username: username, password: password };
        sendMessage("request-register", data);
    };

    const changePassword = (username, password) =>
    {
        var data = { username: username, password: password };
        sendMessage("change-password", data);
    };

    const removeUser = (username) =>
    {
        sendMessage("remove-user", username);
    };

    const refreshUsers = () =>
    {
        sendMessage("fetch-users", "");
    };

    const refreshConnections = () =>
    {
        sendMessage("fetch-connections", "");
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