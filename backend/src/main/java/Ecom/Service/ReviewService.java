package Ecom.Service;

import java.util.List;

import Ecom.Exception.ReviewException;
import Ecom.Model.Review;

public interface ReviewService {
    Review addReviewToProduct(Integer productId, Integer userId, Review review) throws ReviewException;
    Review updateReviewToProduct(Long reviewId, Review review) throws ReviewException;
    void deleteReview(Long reviewId) throws ReviewException;
    List<Review> getAllReviewOfProduct(Integer productId) throws ReviewException;
}
