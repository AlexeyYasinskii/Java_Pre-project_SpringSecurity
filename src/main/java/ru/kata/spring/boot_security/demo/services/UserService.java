package ru.kata.spring.boot_security.demo.services;


import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {

    List<User> showAllUsers();

    void updateUser(User user);

    void saveUser(User user);

    User showUser(int id);

    void deleteUser(int id);

    User findUserByUsername(String username);


}
