package com.guild.search;

import javax.persistence.*;

@Entity
@Table(name = "PEARL")
public class Pearl {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String name;
    private String pearl;

    protected Pearl() {
    }

    public Pearl(String name, String pearl) {
        this.name = name;
        this.pearl = pearl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPearl() {
        return pearl;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "Pearl{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", pearl='" + pearl + '\'' +
                '}';
    }
}
