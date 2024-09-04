package ru.kata.spring.boot_security.demo.services;


import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {

    public List<User> showAllUsers();

    public void saveOrUpdateUser(User user);

    public User showUser(int id);

    public void deleteUser(int id);

    public User findUserByUsername(String username);
}
