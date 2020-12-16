# http-echo-server

Forked from [watson/http-echo-server](https://github.com/watson/http-echo-server/)

Will accept any TCP connection and echo back an HTTP response with the
entire content of the incoming TCP connection.

The server makes no attempt to understand the incoming HTTP request
hence it doesn't know when the request is completed and therefore just
terminates the TCP connection 2 seconds after the first data packet.

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/standard/standard)

## Installation

To set up a simple echo-server on Heroku just click this button:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

*Note that the Heroku routing stack will proxy the incoming request and
add custom HTTP headers.*

Alternatively, to start it locally just run (only supported on newer
versions of npm):

```
npx http-echo-server
```

Or if you wish to install the module globally:

```
npm install http-echo-server -g
```

## Example usage

Just curl the URL of the app:

```
curl http://<heroku-app-name>.herokuapp.com
```

Alternatively - if installed locally - you can start the server using
the command `http-echo-server`, take note of the port it starts on and
then curl it:

```
curl http://localhost:<port>
```

## Setting listening port

To set the http port, either supply the port as an argument to the
`http-echo-server` executable:

```
http-echo-server 3005
```

Or use the `PORT` environment variable:

```
export PORT=3005
http-echo-server
```

## Setting response delay

To set the response delay (in milliseconds), either supply the port as the 2nd argument to the
`http-echo-server` executable:

```
http-echo-server 3005 250
```

Or use the `PORT` environment variable:

```
export DELAY=250
http-echo-server
```

## License

[MIT](LICENSE)
