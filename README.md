# Fimme-admin

Standalone administration console for [Fimme-server](https://github.com/michalgerhat/fimme-server). Allows for Fimme user management and connection history viewing.

## Usage

* `npm start` to run development build locally.
* Live demo [here](https://gerhat.cz/fimme-server/admin).

## Features

* User management - create new, change password, delete (deletes their friendships as well).
* Connections log. Timestamp and coordinates of both parties. Purely analytical - no usernames.

## Technologies

* [React](https://reactjs.org/) app.
* Context component providing WebSocket interface to server.
* Sessions using JWT stored in browser cookies.
* [Material-UI](https://material-ui.com/) frontend with [Notistack](https://iamhosseindhv.com/notistack) toast messages.
* Routing programatically using [React Router](https://reacttraining.com/react-router/native/).

## Todo

* Create a new administrator.
* Friendship management.
* Display connections on a map.
* Display active users (maybe).
* Backend overhaul. This was made as a standalone app because of time constraints. It could be better made if it was a part of Fimme-server itself.
* Communication over HTTP (maybe). Use of WebSocket is debatable in this case. Again, it was used to save time - the WS protocol was already made for the client app. It could provide some real-time functionality (such as displaying active users), but other than that HTTP would be better.
