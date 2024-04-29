import {GenericContainer, StartedTestContainer, Wait} from "testcontainers";
import axios from 'axios';

export function createPulsarContainer(done: (arg0: any) => void, callback: (arg0: StartedTestContainer) => void) {
    new GenericContainer("apachepulsar/pulsar")
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

export function stopPulsarContainer(container: StartedTestContainer, done: () => void) {
    container.stop()
        .then(function () {
            console.log("Pulsar container stopped");
            done();
        }).catch(function (error) {
            console.error(error)
            done();
        });
}

export function createTopic(container:StartedTestContainer, topic: String, done: () => void, callback: () => void) {
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
            done();
        });
}

module.exports = {
    createPulsarContainer: createPulsarContainer,
    stopPulsarContainer: stopPulsarContainer,
    createTopic: createTopic
}
