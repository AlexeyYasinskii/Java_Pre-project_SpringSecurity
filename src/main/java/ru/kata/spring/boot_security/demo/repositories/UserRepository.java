package ru.kata.spring.boot_security.demo.repositories;



import org.springframework.data.jpa.repository.JpaRepository;
import ru.kata.spring.boot_security.demo.models.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    public User findUserByUsername(String username);
}
