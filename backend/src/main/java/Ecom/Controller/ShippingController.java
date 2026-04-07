package Ecom.Controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Ecom.Model.ShippingDetails;
import Ecom.ModelDTO.ShippingDTO;
import Ecom.Service.ShippingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ecom/order-shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    @PostMapping("/{orderId}/{shipperId}")
    public ResponseEntity<ShippingDetails> setShippingDetails(@PathVariable Integer orderId,
                                                              @PathVariable Integer shipperId,
                                                              @Valid @RequestBody ShippingDetails shippingDetails) {
        ShippingDetails saved = shippingService.setShippingDetails(orderId, shipperId, shippingDetails);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{shippingId}")
    public ResponseEntity<ShippingDetails> updateShippingAddress(@PathVariable Long shippingId,
                                                                 @Valid @RequestBody ShippingDTO shippingDTO) {
        ShippingDetails updated = shippingService.updateShippingAddress(shippingId, shippingDTO);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{shippingId}")
    public ResponseEntity<Void> deleteShippingDetails(@PathVariable Long shippingId) {
        shippingService.deleteShippingDetails(shippingId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
