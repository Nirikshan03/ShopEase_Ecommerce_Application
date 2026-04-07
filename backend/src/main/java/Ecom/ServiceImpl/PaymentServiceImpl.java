package Ecom.ServiceImpl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Ecom.Enum.OrderStatus;
import Ecom.Enum.PaymentMethod;
import Ecom.Enum.PaymentStatus;
import Ecom.Exception.PaymentException;
import Ecom.Exception.UserException;
import Ecom.Model.Orders;
import Ecom.Model.Payment;
import Ecom.Model.User;
import Ecom.Repository.OrderRepository;
import Ecom.Repository.PaymentRepository;
import Ecom.Repository.UserRepository;
import Ecom.Service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Payment makePayment(Integer orderId, Integer userId, String paymentMethod) throws PaymentException {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found in the database."));

        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new PaymentException("Order not found with ID: " + orderId));

        // Prevent duplicate payment
        if (order.getPayment() != null) {
            throw new PaymentException("Payment already made for order ID: " + orderId);
        }

        // Validate order belongs to this user
        if (!order.getUser().getUserId().equals(userId)) {
            throw new PaymentException("This order does not belong to the specified user.");
        }

        PaymentMethod method;
        try {
            method = PaymentMethod.valueOf(paymentMethod.toUpperCase());
        } catch (IllegalArgumentException e) {
            method = PaymentMethod.UPI; // default
        }

        Payment payment = new Payment();
        payment.setPaymentAmount(order.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(method);
        payment.setPaymentStatus(PaymentStatus.SUCCESSFUL);
        payment.setUser(existingUser);
        payment.setOrder(order);
        paymentRepository.save(payment);

        order.setStatus(OrderStatus.SHIPPED);
        order.setPayment(payment);
        orderRepository.save(order);

        existingUser.getPayments().add(payment);
        userRepository.save(existingUser);

        return payment;
    }
}
