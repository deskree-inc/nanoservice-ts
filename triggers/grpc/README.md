# Use the gRPC protocol instead of the Connect protocol

On Node.js, we support three protocols:

1. The gRPC protocol that is used throughout the gRPC ecosystem.
2. The gRPC-Web protocol used by grpc/grpc-web, allowing servers to interop with grpc-web front-ends without the need for an intermediary proxy (such as Envoy).
3. The new Connect protocol, a simple, HTTP-based protocol that works over HTTP/1.1 or HTTP/2. It takes the best portions of gRPC and gRPC-Web, including streaming, and packages them into a protocol that works equally well in browsers, monoliths, and microservices. The Connect protocol is what we think the gRPC protocol should be. By default, JSON- and binary-encoded Protobuf is supported.

So far, we have been using the ```http://``` scheme in our examples. We were not using TLS (Transport Layer Security). If you want to use gRPC and browser clients during local development, you need TLS.

Actually, that only takes a minute to set up! We will use ```mkcert``` to make a certificate. If you don't have it installed yet, please run the following commands:

```bash
brew install mkcert
mkcert -install
mkcert localhost 127.0.0.1 ::1
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
```

If you don't use macOS or ```brew```, see the mkcert docs for instructions. You can copy the last line to your ```~/.zprofile``` or ```~/.profile```, so that the environment variable for Node.js is set every time you open a terminal.

If you already use ```mkcert```, just run ```mkcert localhost 127.0.0.1 ::1``` to issue a certificate for our example server.

Reference:
https://connectrpc.com/docs/node/getting-started/

# Test

```bash
npx buf curl --protocol grpc --schema . --http2-prior-knowledge -d '{"Name": "countries", "Message": "Hola!", "MessageEncoding": "STRING", "MessageType": "TEXT"}' https://localhost:8443/nanoservice.workflow.v1.WorkflowService/ExecuteWorkflow
```