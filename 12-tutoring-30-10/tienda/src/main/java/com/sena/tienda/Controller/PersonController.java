package com.sena.tienda.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.tienda.Entity.Person;
import com.sena.tienda.IService.IPersonService;



@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/person")
public class PersonController {
    
    @Autowired
    private IPersonService personService;

    @PostMapping
    public Person save(@RequestBody Person entity) {
        return personService.save(entity);
    }

    @GetMapping()
    public List<Person> findAll() {
        return personService.findAll();
    }
    
    
}
