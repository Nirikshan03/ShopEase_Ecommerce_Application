package Ecom.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import Ecom.Enum.UserAccountStatus;
import Ecom.Enum.UserRole;
import Ecom.Exception.UserException;
import Ecom.Model.User;
import Ecom.ModelDTO.AdminDTO;
import Ecom.ModelDTO.CustomerDTO;
import Ecom.ModelDTO.UserDTO;
import Ecom.Repository.UserRepository;
import Ecom.Service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserByEmailId(String emailId) throws UserException {
        return userRepository.findByEmail(emailId)
                .orElseThrow(() -> new UserException("User not found with email: " + emailId));
    }

    @Override
    public User addUser(CustomerDTO customer) throws UserException {
        if (customer == null)
            throw new UserException("Customer cannot be null");

        Optional<User> findByEmail = userRepository.findByEmail(customer.getEmail());
        if (findByEmail.isPresent()) {
            throw new UserException("Email already registered: " + customer.getEmail());
        }

        User newCustomer = new User();
        newCustomer.setEmail(customer.getEmail());
        // Password is encoded in CustomerController before calling this method
        newCustomer.setPassword(customer.getPassword());
        newCustomer.setFirstName(customer.getFirstName());
        newCustomer.setLastName(customer.getLastName());
        newCustomer.setPhoneNumber(customer.getPhoneNumber());
        newCustomer.setRole(UserRole.ROLE_USER);
        newCustomer.setRegisterTime(LocalDateTime.now());
        newCustomer.setUserAccountStatus(UserAccountStatus.ACTIVE);

        return userRepository.save(newCustomer);
    }

    @Override
    public User addUserAdmin(AdminDTO admin) throws UserException {
        if (admin == null)
            throw new UserException("Admin cannot be null");

        Optional<User> findByEmail = userRepository.findByEmail(admin.getEmail());
        if (findByEmail.isPresent()) {
            throw new UserException("Email already registered: " + admin.getEmail());
        }

        User newAdmin = new User();
        newAdmin.setEmail(admin.getEmail());
        // FIX: encode password for admin registration too
        newAdmin.setPassword(passwordEncoder.encode(admin.getPassword()));
        newAdmin.setFirstName(admin.getFirstName());
        newAdmin.setLastName(admin.getLastName());
        newAdmin.setPhoneNumber(admin.getPhoneNumber());
        newAdmin.setRole(UserRole.ROLE_ADMIN);
        newAdmin.setRegisterTime(LocalDateTime.now());
        newAdmin.setUserAccountStatus(UserAccountStatus.ACTIVE);

        return userRepository.save(newAdmin);
    }

    @Override
    public User changePassword(Integer userId, UserDTO customer) throws UserException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));
        String newPass = customer.getNewPassword();
        if (newPass == null || newPass.length() < 5 || newPass.length() > 20) {
            throw new UserException("Password must be between 5 and 20 characters");
        }
        user.updatePassword(newPass, passwordEncoder);
        return userRepository.save(user);
    }

    @Override
    public String deactivateUser(Integer userId) throws UserException {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));
        existingUser.setUserAccountStatus(UserAccountStatus.DEACTIVETE);
        userRepository.save(existingUser);
        return "Account deactivated successfully";
    }

    @Override
    public User getUserDetails(Integer userId) throws UserException {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));
    }

    @Override
    public List<User> getAllUserDetails() throws UserException {
        List<User> existingAllUser = userRepository.findAll();
        if (existingAllUser.isEmpty()) {
            throw new UserException("No users found");
        }
        return existingAllUser;
    }
}
