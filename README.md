# node-red-contrib-pulsar

Add producer and consumer nodes to your Node-RED flow to send and receive messages from Apache Pulsar.

## Install

> Run the following command in your Node-RED user directory - typically `~/.node-red`

```bash
npm install ng-galien/node-red-contrib-pulsar#main
```

## Usage

Run a standalone Pulsar instance using Docker:

```bash
docker run -it \
  -p 6650:6650 \
  -p 8080:8080 \
  apachepulsar/pulsar:3.1.1 \
  bin/pulsar standalone
```
Start Node-RED:

```bash
node-red
```