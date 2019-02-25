package com.guild.search.redis;

import com.guild.search.Pearl;
import com.guild.search.PearlRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Configurable
public class RedisMessageSubscriber implements MessageListener {

    private RedisConnection con;

    private static final Logger log = LoggerFactory.getLogger(RedisMessageSubscriber.class);

    @Autowired
    private PearlRepository pearlRepository;

    public RedisMessageSubscriber(RedisConnection con) {
        this.con=con;
    }

    public void onMessage(final Message message, final byte[] pattern) {
        log.info("Message received: " + new String(message.getBody()));
        if (pearlRepository == null) {
            con.hSet("values".getBytes(), message.getBody(), (message.toString()+" says: AUTOWIRING SUCKS").getBytes());
            return;
        }
        List<Pearl> pearls = pearlRepository.findByName(message.toString());
        if (pearls == null || pearls.isEmpty()) {
            con.hSet("values".getBytes(), message.getBody(), "שומר על זכות השתיקה".getBytes());
            return;
        }
        for (Pearl pearl : pearls) {
            con.hSet("values".getBytes(), message.getBody(), pearl.getPearl().getBytes());
        }
    }
}
