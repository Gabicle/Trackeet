package com.trackeet.Trackeet.user;

import com.trackeet.Trackeet.user.exception.BadRequestException;
import com.trackeet.Trackeet.user.exception.UserNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UserService  {
    private final UserRepository userRepository;

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public void addUser(User user) {
        Boolean existsEmail = userRepository.selectExistsEmail(user.getEmail());
        if(existsEmail){
            throw new BadRequestException("Email " + user.getEmail() + " taken");
        }
        userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        //check if user exists tho
        if(!userRepository.existsById(userId)){
            throw new UserNotFoundException("User with id " + userId + " does not exist");
        }
        userRepository.deleteById(userId);
    }
}
