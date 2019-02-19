package com.guild.search;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface PearlRepository extends CrudRepository<Pearl, Long> {

    List<Pearl> findByName(String name);

}
