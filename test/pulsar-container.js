const { GenericContainer, Wait } = require("testcontainers");
const axios = require('axios');

function createPulsarContainer(done, callback) {
    new GenericContainer("apachepulsar/pulsar:3.1.1")
        .withCommand(["bin/pulsar", "standalone"])
        .withExposedPorts(6650, 8080)
        .withWaitStrategy(Wait.forHttp("/admin/v2/persistent/public/default", 8080))
        .start()
        .then(function (container) {
            console.log("Pulsar container started");
            callback(container);
        }).catch(function (error) {
            console.error(error)
            done(error);
        });
}

function stopPulsarContainer(container, done) {
    container.stop()
        .then(function () {
            console.log("Pulsar container stopped");
            done();
        }).catch(function (error) {
            console.error(error)
            done(error);
        });
}

function createTopic(container, topic, done, callback) {
    const serviceUrl = "http://localhost:" + container.getMappedPort(8080);
    axios.put(serviceUrl + '/admin/v2/persistent/public/default/' + topic, {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            console.log("Topic created", response.status);
            callback();
        }).catch(function (error) {
            console.error(error)
            done(error);
        });
}

module.exports = {
    createPulsarContainer: createPulsarContainer,
    stopPulsarContainer: stopPulsarContainer,
    createTopic: createTopic
}