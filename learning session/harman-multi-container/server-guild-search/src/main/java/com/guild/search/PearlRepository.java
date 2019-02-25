package com.guild.search;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PearlRepository extends CrudRepository<Pearl, Long> {

    List<Pearl> findByName(String name);

}
