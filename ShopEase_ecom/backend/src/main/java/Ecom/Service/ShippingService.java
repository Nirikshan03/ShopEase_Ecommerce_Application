package Ecom.Service;

import Ecom.Exception.ShippingException;
import Ecom.Model.ShippingDetails;
import Ecom.ModelDTO.ShippingDTO;

public interface ShippingService {
    ShippingDetails setShippingDetails(Integer orderId, Integer shipperId, ShippingDetails shippingDetails) throws ShippingException;
    ShippingDetails updateShippingAddress(Long shippingId, ShippingDTO shippingDTO) throws ShippingException;
    void deleteShippingDetails(Long shippingId) throws ShippingException;
}
