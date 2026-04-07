package Ecom.Service;

import Ecom.Exception.PaymentException;
import Ecom.Model.Payment;

public interface PaymentService {
    Payment makePayment(Integer orderId, Integer userId, String paymentMethod) throws PaymentException;
}
