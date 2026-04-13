package Ecom.SecurityConfig;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class AppConfig {

    @Bean
    public SecurityFilterChain springSecurityConfiguration(HttpSecurity http) throws Exception {

        http
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .cors(cors -> cors.configurationSource(new CorsConfigurationSource() {
                @Override
                public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                    CorsConfiguration cfg = new CorsConfiguration();

                    // Read allowed origin from env var for production
                    // Falls back to allowing all origins for local dev
                    String allowedOrigin = System.getenv("ALLOWED_ORIGIN");
                    if (allowedOrigin != null && !allowedOrigin.isBlank()) {
                        // FIX: Must use OriginPatterns to avoid crash when allowCredentials is true
                        cfg.setAllowedOriginPatterns(List.of(allowedOrigin));
                    } else {
                        cfg.setAllowedOriginPatterns(List.of("*"));
                    }

                    cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    cfg.setAllowCredentials(true);
                    cfg.setAllowedHeaders(List.of("*"));
                    cfg.setExposedHeaders(Arrays.asList("Authorization"));
                    cfg.setMaxAge(3600L);
                    return cfg;
                }
            }))
            .authorizeHttpRequests(auth -> auth
                // ── Public endpoints ──────────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/ecom/admin").permitAll()
                .requestMatchers(HttpMethod.POST, "/ecom/customers").permitAll()
                // FIX: signIn must NOT be permitAll — it needs Basic Auth credentials
                // to be processed so Authentication is populated in the controller.
                // authenticated() forces Spring to validate the Basic Auth header first.
                .requestMatchers(HttpMethod.GET, "/ecom/signIn").authenticated()
                .requestMatchers(HttpMethod.GET,  "/ecom/products/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/ecom/product-reviews/**").permitAll()
                .requestMatchers("/swagger-ui*/**", "/v3/api-docs/**").permitAll()

                // ── ADMIN only ────────────────────────────────────────────
                .requestMatchers(HttpMethod.POST,   "/ecom/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/ecom/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/ecom/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,    "/ecom/customers/get-all-customer").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,    "/ecom/orders/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/ecom/order-shippers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/ecom/order-shippers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/ecom/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/ecom/customer-addresses/delete/**").hasRole("ADMIN")

                // ── USER only ─────────────────────────────────────────────
                .requestMatchers(HttpMethod.POST,   "/ecom/cart/**").hasRole("USER")
                .requestMatchers(HttpMethod.PUT,    "/ecom/cart/**").hasRole("USER")
                .requestMatchers(HttpMethod.DELETE, "/ecom/cart/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST,   "/ecom/orders/**").hasRole("USER")
                .requestMatchers(HttpMethod.DELETE, "/ecom/orders/users/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST,   "/ecom/order-payments/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST,   "/ecom/product-reviews/**").hasRole("USER")
                .requestMatchers(HttpMethod.PUT,    "/ecom/product-reviews/**").hasRole("USER")
                .requestMatchers(HttpMethod.DELETE, "/ecom/product-reviews/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST,   "/ecom/customer-addresses/**").hasRole("USER")
                .requestMatchers(HttpMethod.PUT,    "/ecom/customer-addresses/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST,   "/ecom/order-shipping/**").hasRole("USER")
                .requestMatchers(HttpMethod.PUT,    "/ecom/order-shipping/**").hasRole("USER")

                // ── ADMIN or USER ─────────────────────────────────────────
                .requestMatchers(HttpMethod.GET, "/ecom/orders/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.GET, "/ecom/cart/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.GET, "/ecom/customer-addresses/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.GET, "/ecom/customers/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.PUT, "/ecom/customers/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.GET, "/ecom/order-payments/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.GET, "/ecom/order-shippers").hasAnyRole("ADMIN", "USER")

                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())
            .addFilterAfter(new JwtTokenGeneratorFilter(), BasicAuthenticationFilter.class)
            .addFilterBefore(new JwtTokenValidatorFilter(), BasicAuthenticationFilter.class)
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
