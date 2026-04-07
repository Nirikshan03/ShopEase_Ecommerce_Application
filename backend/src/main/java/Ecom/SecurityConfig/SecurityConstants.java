package Ecom.SecurityConfig;

public interface SecurityConstants {
    // Use environment variable JWT_SECRET in production
    // Fallback is only for local dev — NEVER use default in production
    String JWT_KEY = System.getenv("JWT_SECRET") != null
            ? System.getenv("JWT_SECRET")
            : "shopease_super_secret_key_2024_minimum_32_chars!!";
    String JWT_HEADER = "Authorization";
}
