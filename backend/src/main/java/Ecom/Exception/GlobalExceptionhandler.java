package Ecom.Exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionhandler {

    private ResponseEntity<MyErrorClass> build(String message, HttpStatus status, WebRequest req) {
        MyErrorClass err = new MyErrorClass();
        err.setMessage(message);
        err.setLocalDateTimes(LocalDateTime.now());
        err.setDesc(req.getDescription(false));
        return new ResponseEntity<>(err, status);
    }

    // 400 — validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MyErrorClass> handleValidation(MethodArgumentNotValidException e, WebRequest req) {
        String msg = e.getBindingResult().getFieldError() != null
                ? e.getBindingResult().getFieldError().getDefaultMessage()
                : "Validation failed";
        return build(msg, HttpStatus.BAD_REQUEST, req);
    }

    // 404 — route not found
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<MyErrorClass> handleNotFound(NoHandlerFoundException e, WebRequest req) {
        return build("Route not found: " + e.getRequestURL(), HttpStatus.NOT_FOUND, req);
    }

    // 404 — domain not found errors
    @ExceptionHandler({UserException.class, ProductException.class, OrdersException.class,
            CartException.class, ReviewException.class, AddressException.class,
            ShippingException.class, ShipperException.class})
    public ResponseEntity<MyErrorClass> handleDomainNotFound(Exception e, WebRequest req) {
        return build(e.getMessage(), HttpStatus.NOT_FOUND, req);
    }

    // 400 — payment errors (bad request — e.g., duplicate payment)
    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<MyErrorClass> handlePayment(PaymentException e, WebRequest req) {
        return build(e.getMessage(), HttpStatus.BAD_REQUEST, req);
    }

    // 409 — duplicate registration
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<MyErrorClass> handleRuntime(RuntimeException e, WebRequest req) {
        String msg = e.getMessage();
        if (msg != null && msg.toLowerCase().contains("already")) {
            return build(msg, HttpStatus.CONFLICT, req);
        }
        return build(msg != null ? msg : "An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR, req);
    }

    // 500 — catch-all
    @ExceptionHandler(Exception.class)
    public ResponseEntity<MyErrorClass> handleGeneral(Exception e, WebRequest req) {
        return build(e.getMessage() != null ? e.getMessage() : "Internal server error",
                HttpStatus.INTERNAL_SERVER_ERROR, req);
    }
}
