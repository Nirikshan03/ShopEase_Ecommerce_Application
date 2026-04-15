package Ecom.service;

import Ecom.Exception.ProductException;
import Ecom.Model.Product;
import Ecom.ModelDTO.ProductDTO;
import Ecom.Repository.ProductRepository;
import Ecom.ServiceImpl.ProductServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ProductServiceImpl.
 * Uses Mockito to isolate service logic from the database.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService Unit Tests")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product();
        sampleProduct.setProductId(1);
        sampleProduct.setName("Test Laptop");
        sampleProduct.setCategory("Electronics");
        sampleProduct.setPrice(999.99);
        sampleProduct.setImageUrl("https://example.com/laptop.jpg");
        sampleProduct.setDescription("A powerful laptop for tests");
        sampleProduct.setAvailable(true);
    }

    // ─── addProduct ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("addProduct: should save and return product when valid")
    void addProduct_ShouldSaveProduct_WhenProductIsValid() throws ProductException {
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        Product result = productService.addProduct(sampleProduct);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Laptop");
        assertThat(result.getPrice()).isEqualTo(999.99);
        verify(productRepository, times(1)).save(sampleProduct);
    }

    @Test
    @DisplayName("addProduct: should throw ProductException when product is null")
    void addProduct_ShouldThrowException_WhenProductIsNull() {
        assertThatThrownBy(() -> productService.addProduct(null))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("Product Can not be Null");

        verify(productRepository, never()).save(any());
    }

    // ─── getAllProduct ────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAllProduct: should return all products sorted when no keyword")
    void getAllProduct_ShouldReturnAllProducts_WhenNoKeyword() throws ProductException {
        List<Product> products = Arrays.asList(sampleProduct);
        when(productRepository.findAll(any(Sort.class))).thenReturn(products);

        List<Product> result = productService.getAllProduct(null, "asc", "name");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Laptop");
    }

    @Test
    @DisplayName("getAllProduct: should filter by keyword when keyword is given")
    void getAllProduct_ShouldFilterByKeyword_WhenKeywordProvided() throws ProductException {
        List<Product> products = Arrays.asList(sampleProduct);
        when(productRepository.findAllByNameContainingIgnoreCase(eq("Laptop"), any(Sort.class)))
                .thenReturn(products);

        List<Product> result = productService.getAllProduct("Laptop", "asc", "name");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).contains("Laptop");
    }

    @Test
    @DisplayName("getAllProduct: should return empty list when no products found")
    void getAllProduct_ShouldReturnEmptyList_WhenNoProducts() throws ProductException {
        when(productRepository.findAll(any(Sort.class))).thenReturn(Collections.emptyList());

        List<Product> result = productService.getAllProduct(null, "asc", "name");

        assertThat(result).isEmpty();
    }

    // ─── getSingleProduct ─────────────────────────────────────────────────────

    @Test
    @DisplayName("getSingleProduct: should return product when ID exists")
    void getSingleProduct_ShouldReturnProduct_WhenIdExists() {
        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));

        Product result = productService.getSingleProduct(1);

        assertThat(result).isNotNull();
        assertThat(result.getProductId()).isEqualTo(1);
    }

    @Test
    @DisplayName("getSingleProduct: should throw ProductException when ID not found")
    void getSingleProduct_ShouldThrowException_WhenIdNotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getSingleProduct(99))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("Product not found");
    }

    // ─── updateProduct ────────────────────────────────────────────────────────

    @Test
    @DisplayName("updateProduct: should update and return product when ID exists")
    void updateProduct_ShouldUpdateProduct_WhenIdExists() throws ProductException {
        ProductDTO dto = new ProductDTO();
        dto.setName("Updated Laptop");
        dto.setCategory("Electronics");
        dto.setPrice(1299.99);
        dto.setImageUrl("https://example.com/new.jpg");
        dto.setDescription("Updated description here");

        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        Product result = productService.updateProduct(1, dto);

        assertThat(result.getName()).isEqualTo("Updated Laptop");
        assertThat(result.getPrice()).isEqualTo(1299.99);
        verify(productRepository, times(1)).save(sampleProduct);
    }

    @Test
    @DisplayName("updateProduct: should throw ProductException when product not found")
    void updateProduct_ShouldThrowException_WhenProductNotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.updateProduct(99, new ProductDTO()))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("not found");
    }

    // ─── removeProduct ────────────────────────────────────────────────────────

    @Test
    @DisplayName("removeProduct: should delete product when ID exists")
    void removeProduct_ShouldDeleteProduct_WhenIdExists() throws ProductException {
        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));
        doNothing().when(productRepository).delete(sampleProduct);

        productService.removeProduct(1);

        verify(productRepository, times(1)).delete(sampleProduct);
    }

    @Test
    @DisplayName("removeProduct: should throw ProductException when ID not found")
    void removeProduct_ShouldThrowException_WhenIdNotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.removeProduct(99))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("not found");

        verify(productRepository, never()).delete(any());
    }

    // ─── getProductByCategory ─────────────────────────────────────────────────

    @Test
    @DisplayName("getProductByCategory: should return products for valid category")
    void getProductByCategory_ShouldReturnProducts_WhenCategoryExists() throws ProductException {
        when(productRepository.getProductCategoryName("Electronics"))
                .thenReturn(Arrays.asList(sampleProduct));

        List<Product> result = productService.getProductByCategory("Electronics");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategory()).isEqualTo("Electronics");
    }

    @Test
    @DisplayName("getProductByCategory: should throw ProductException when no products in category")
    void getProductByCategory_ShouldThrowException_WhenNoCategoryMatch() {
        when(productRepository.getProductCategoryName("UnknownCategory"))
                .thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> productService.getProductByCategory("UnknownCategory"))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("not found");
    }
}
