import React, { useState, createContext, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Cookies from 'universal-cookie';

export const Context = createContext();

const cookies = new Cookies();
var lastUrl = cookies.get("fimme-server");
var ws = null;
var reconnect = null;
var accessToken = null;
var refreshToken = cookies.get("fimme-token");
var online = false;

export function ContextProvider (props)
{
    const { enqueueSnackbar } = useSnackbar();

    const [missedMessage, setMissedMessage] = useState(null);
    const [connected, setConnected] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [users, setUsers] = useState([]);
    const [connections, setConnections] = useState([]);

    useEffect(() =>
    {
        connect(lastUrl);
    }, []);

    function set(access, refresh)
    {
        accessToken = access;
        refreshToken = refresh;
        cookies.set("fimme-token", refresh);
        setLoggedIn(true);
    }

    function reset()
    {
        ws && ws.close();
        ws = null;
        lastUrl = null;
        accessToken = null;
        refreshToken = null;
        online = false;

        setConnected(false);
        setLoggedIn(false);
        setUsers([]);
        setConnections([]);
        cookies.remove("fimme-token");
        enqueueSnackbar("Logged out.");
    }

    function sendMessage(channel, data)
    {
        var token = channel === "authenticate" ? null : accessToken;
        online && ws.send(JSON.stringify({ token: token, channel: channel, data: data }));
    }

    const connect = (providedUrl) =>
    {
        var url = providedUrl ? providedUrl : lastUrl;

        if (url && url !== "")
        {
            lastUrl = url;
            ws = new WebSocket(url);
    
            ws.onopen = () =>
            {
                clearInterval(reconnect);
                enqueueSnackbar("Connected to the server.");
                setConnected(true);
                online = true;
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
                        refreshConnections();
                        refreshUsers();
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
                        refreshConnections();
                        refreshUsers();
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
                online = false;
                clearInterval(reconnect);
                reconnect = setInterval(connect.bind(this, lastUrl), 2000);
            }
        }
    }

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
                lastUrl: lastUrl,
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