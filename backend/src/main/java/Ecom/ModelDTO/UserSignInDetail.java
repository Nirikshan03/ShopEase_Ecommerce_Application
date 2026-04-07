package Ecom.ModelDTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserSignInDetail {
    private Integer id;
    private String firstNAme;
    private String lastName;
    private String signinStatus;
    private String role;      // "ROLE_USER" or "ROLE_ADMIN" — useful for frontend routing
    private Integer cartId;   // so frontend can directly use cart without extra API call
}
