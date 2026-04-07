package Ecom.Config;

import Ecom.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Runs once on startup. Logs product count so you can verify seeding worked.
 * The actual seeding is done by data.sql with INSERT IGNORE —
 * this class exists to guard and report, not to duplicate.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(ApplicationArguments args) {
        long count = productRepository.count();
        log.info("✅ ShopEase started. Products in DB: {}", count);
        if (count == 0) {
            log.warn("⚠️ No products found. Check that data.sql ran successfully.");
        }
    }
}
