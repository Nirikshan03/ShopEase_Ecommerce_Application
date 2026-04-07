package Ecom.Service;

import java.time.LocalDate;
import java.util.List;

import Ecom.Exception.OrdersException;
import Ecom.Model.Orders;
import Ecom.ModelDTO.OrdersDTO;

public interface OrdersService {
    OrdersDTO placeOrder(Integer userId) throws OrdersException;
    Orders getOrdersDetails(Integer orderId) throws OrdersException;
    List<Orders> getAllUserOrder(Integer userId) throws OrdersException;
    List<Orders> viewAllOrders() throws OrdersException;
    List<Orders> viewAllOrderByDate(LocalDate date) throws OrdersException;
    void deleteOrders(Integer userId, Integer orderId) throws OrdersException;
    Orders updateOrders(Integer ordersId, OrdersDTO orderDTO) throws OrdersException;
}
