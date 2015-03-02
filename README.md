# http-echo-server

Will accept any TCP connection and echo back a HTTP response with the
entire content of the incoming TCP connection.

The server makes no attempt to understand the incoming HTTP request
hence it doesn't know when the request is completed and therefore just
terminates the TCP connection 2 seconds after the first data packet.

## Installation

To setup a simple echo-server on Heroku just click this button:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

*Note that the Heroku routing stack will proxy the incoming request and
add custom HTTP headers.*

Alternatively, to install locally just run:

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

## License

MIT
