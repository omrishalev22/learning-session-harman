package com.guild.search.redis;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;

@Service
@Configurable
public class RedisMessageSubscriber implements MessageListener {

    @Autowired
    private MessagePublisher redisPublisher;

    private static final Logger log = LoggerFactory.getLogger(RedisMessageSubscriber.class);

    public RedisMessageSubscriber(MessagePublisher redisPublisher) {
        this.redisPublisher = redisPublisher;
    }

    public void onMessage(final Message message, final byte[] pattern) {
        log.info("Message received: " + new String(message.getBody()));
        redisPublisher.publish("Message received: " + new String(message.getBody()));
    }
}
