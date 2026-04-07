package Ecom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Ecom.Model.Payment;
import Ecom.Service.PaymentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ecom/order-payments")
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Make a payment for an order.
     * @param orderId   the order to pay for
     * @param userId    the user making the payment
     * @param method    payment method: UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING (default: UPI)
     */
    @PostMapping("/makePayment")
    public ResponseEntity<Payment> makePayment(
            @RequestParam Integer orderId,
            @RequestParam Integer userId,
            @RequestParam(required = false, defaultValue = "UPI") String method) {
        Payment payment = paymentService.makePayment(orderId, userId, method);
        return ResponseEntity.ok(payment);
    }
}
