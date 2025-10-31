package com.sena.tienda.IService;

import java.util.List;

import com.sena.tienda.Entity.Person;

public interface IPersonService {
    List<Person> findAll();
    Person findById(Long id);
    Person save(Person person);
    void deleteById(Long id);
}
