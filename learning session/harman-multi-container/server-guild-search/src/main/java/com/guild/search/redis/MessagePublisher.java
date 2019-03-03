package com.guild.search.redis;

public interface MessagePublisher {

    void publish(final String message);

}
