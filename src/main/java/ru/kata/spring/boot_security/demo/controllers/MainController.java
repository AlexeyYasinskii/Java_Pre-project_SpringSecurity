package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.List;

@Controller
public class MainController {

    @Autowired
    UserService userService;

    @Autowired
    RoleRepository roleRepository;

    @GetMapping("/admin")
    public String showAllUsers(Model model) {
        List<User> allUsers = userService.showAllUsers();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUsername(authentication.getName());
        List<Role> roles = roleRepository.findAll();
        model.addAttribute("allUsers", allUsers);
        model.addAttribute("user", user);
        model.addAttribute("roles", roles);
        return "admin";
    }

    @GetMapping("/user")
    public String userPage(Model model, Principal principal) {
        User user = userService.findUserByUsername(principal.getName());
        model.addAttribute("user", user);
        return "user";
    }
}
