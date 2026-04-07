package Ecom.Model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "products", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name"}, name = "uk_product_name")
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @NotNull(message = "Product name is mandatory")
    @NotBlank(message = "Product name is mandatory")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @NotNull(message = "Product image is mandatory")
    @NotBlank(message = "Product image is mandatory")
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "is_available")
    private boolean isAvailable = true;

    @NotNull(message = "Product description is mandatory")
    @NotBlank(message = "Product description is mandatory")
    @Size(min = 5, max = 100)
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull(message = "Product price is mandatory")
    @Column(name = "price", nullable = false)
    private Double price;

    @NotNull(message = "Product category is mandatory")
    @NotBlank(message = "Product category is mandatory")
    @Column(name = "category_name", nullable = false)
    private String category;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<OrderItem> orderItem = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();
}
