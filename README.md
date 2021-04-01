# Kafka Channel reload tests

Created for https://github.com/knative-sandbox/eventing-kafka/pull/486

Apply initial config

```
k apply -f config/000-kafka-config.yaml
```

Create channel and receiver:

```
k apply -f config/100-kafka-channel.yaml
k apply -f config/200-receiver.yaml
```

Start watching receiver logs:

```
stern receiver
```

Create sender and start watching logs:

```
k apply -f config/300-sender.yaml
stern sender
```

Sender will send messages for 2 minutes. You have 2 mins to change the config:

```
k apply -f config/400-kafka-config-update.yaml
```

Receiver will stop receiving events after 3 mins.

Sender will print the number of messages it sends.
Receiver will print the number of messages it receives.


Restart

```
k delete -f config/300-sender.yaml
k delete -f config/200-receiver.yaml
k delete -f config/100-kafka-channel.yaml
k apply -f config/000-kafka-config.yaml

k apply -f config/100-kafka-channel.yaml
k apply -f config/200-receiver.yaml
k apply -f config/300-sender.yaml

k apply -f config/400-kafka-config-update.yaml
```
