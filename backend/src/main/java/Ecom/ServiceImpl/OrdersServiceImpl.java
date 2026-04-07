package Ecom.ServiceImpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import Ecom.Enum.OrderStatus;
import Ecom.Exception.OrdersException;
import Ecom.Exception.UserException;
import Ecom.Model.Cart;
import Ecom.Model.CartItem;
import Ecom.Model.OrderItem;
import Ecom.Model.Orders;
import Ecom.Model.User;
import Ecom.ModelDTO.OrdersDTO;
import Ecom.Repository.CartItemRepository;
import Ecom.Repository.CartRepository;
import Ecom.Repository.OrderItemRepository;
import Ecom.Repository.OrderRepository;
import Ecom.Repository.ProductRepository;
import Ecom.Repository.UserRepository;
import Ecom.Service.OrdersService;
import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class OrdersServiceImpl implements OrdersService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;

    @Override
    @Transactional
    public OrdersDTO placeOrder(Integer userId) throws OrdersException {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User Not Found In Database"));

        Cart userCart = existingUser.getCart();
        if (userCart == null || userCart.getCartItems() == null || userCart.getCartItems().isEmpty()) {
            throw new OrdersException("Add items to the cart first.");
        }
        if (userCart.getTotalAmount() == null || userCart.getTotalAmount() == 0) {
            throw new OrdersException("Cart total is zero. Please add items before ordering.");
        }

        Integer cartId = userCart.getCartId();

        Orders newOrder = new Orders();
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setStatus(OrderStatus.PENDING);
        newOrder.setUser(existingUser);
        newOrder.setTotalAmount(userCart.getTotalAmount());

        // Save order first to get an ID
        orderRepository.save(newOrder);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : userCart.getCartItems()) {
            if (cartItem.getCart().getCartId().equals(cartId)) {
                OrderItem orderItem = new OrderItem();
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setOrderId(newOrder.getOrderId());
                orderItems.add(orderItem);
            }
        }

        newOrder.setOrderItem(orderItems);
        orderRepository.save(newOrder);

        // Clear cart after placing order
        userCart.setTotalAmount(0.0);
        cartItemRepository.removeAllProductFromCart(cartId);
        cartRepository.save(userCart);

        OrdersDTO orderData = new OrdersDTO();
        orderData.setOrderId(newOrder.getOrderId());
        orderData.setOrderAmount(newOrder.getTotalAmount());
        orderData.setStatus("PENDING");
        orderData.setPaymentStatus("PENDING");
        orderData.setOrderDate(LocalDateTime.now().toString());
        return orderData;
    }

    @Override
    @Transactional
    public Orders getOrdersDetails(Integer orderId) throws OrdersException {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrdersException("Order not found with ID: " + orderId));
    }

    @Override
    public List<Orders> getAllUserOrder(Integer userId) throws OrdersException {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User Not Found In Database"));
        List<Orders> orders = orderRepository.getAllOrderByUserId(userId);
        if (orders.isEmpty()) {
            throw new OrdersException("No orders found for this user.");
        }
        return orders;
    }

    @Override
    public List<Orders> viewAllOrders() throws OrdersException {
        List<Orders> orders = orderRepository.findAll();
        if (orders.isEmpty()) {
            throw new OrdersException("No orders found in the database.");
        }
        return orders;
    }

    @Override
    public List<Orders> viewAllOrderByDate(LocalDate date) throws OrdersException {
        // FIX: convert LocalDate to LocalDateTime for the query
        LocalDateTime startOfDay = date.atStartOfDay();
        List<Orders> orders = orderRepository.findByOrderDateGreaterThanEqual(startOfDay);
        if (orders.isEmpty()) {
            throw new OrdersException("No orders found for date: " + date);
        }
        return orders;
    }

    @Override
    public void deleteOrders(Integer userId, Integer orderId) throws OrdersException {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User Not Found In Database"));
        Orders existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrdersException("Order Not Found with ID: " + orderId));
        // Verify the order belongs to this user
        if (!existingOrder.getUser().getUserId().equals(userId)) {
            throw new OrdersException("This order does not belong to the specified user.");
        }
        orderRepository.delete(existingOrder);
    }

    @Override
    public Orders updateOrders(Integer ordersId, OrdersDTO orderDTO) throws OrdersException {
        Orders existingOrder = orderRepository.findById(ordersId)
                .orElseThrow(() -> new OrdersException("Order Not Found with ID: " + ordersId));
        if (orderDTO.getStatus() != null) {
            existingOrder.setStatus(OrderStatus.valueOf(orderDTO.getStatus()));
        }
        return orderRepository.save(existingOrder);
    }
}
