package com.sena.tienda.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.tienda.Entity.Person;
import com.sena.tienda.IRepository.IPersonRepository;
import com.sena.tienda.IService.IPersonService;

@Service
public class PersonService implements IPersonService {
    @Autowired
    private IPersonRepository PersonRepository;

    @Override
    public List<Person> findAll() {
        return PersonRepository.findAll();
    }

    @Override
    public Person findById(Long id) {
        return PersonRepository.findById(id).orElse(null);
    }

    @Override
    public Person save(Person person) {
        return PersonRepository.save(person);
    }

    @Override
    public void deleteById(Long id) {
        PersonRepository.deleteById(id);
    }
}
