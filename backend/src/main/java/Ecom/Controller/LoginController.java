package Ecom.Controller;

import Ecom.Model.User;
import Ecom.ModelDTO.UserSignInDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import Ecom.Service.UserService;

@RestController
@RequestMapping("/ecom")
public class LoginController {

    @Autowired
    private UserService userService;

    @GetMapping("/signIn")
    public ResponseEntity<UserSignInDetail> getLoggedInCustomerDetailsHandler(Authentication auth) {
        // FIX: auth is null when Basic Auth header is missing or credentials are wrong.
        // Return 401 clearly instead of NullPointerException.
        if (auth == null || !auth.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User customer = userService.getUserByEmailId(auth.getName());
        UserSignInDetail signInData = new UserSignInDetail();
        signInData.setId(customer.getUserId());
        signInData.setFirstNAme(customer.getFirstName());
        signInData.setLastName(customer.getLastName());
        signInData.setSigninStatus("Success");
        signInData.setRole(customer.getRole().name());
        if (customer.getCart() != null) {
            signInData.setCartId(customer.getCart().getCartId());
        }
        return new ResponseEntity<>(signInData, HttpStatus.OK);
    }
}
