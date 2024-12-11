-1. FREE UP THE POST /users ROUTE, CHANGE IT TO /register OR /users/register AND THEN FREE IT SO ANYCONE CAN MAKE AN ACCOUNT< NOT JUST LOGGED IN USERS

0. MAKE A LOGOUT ROUTE AND UNENCRYPT THE USERNAMES WHEN THEY COME OUT OF THE DB, SOMETHING IS VERY WRONG WITH THE USERNAMES RIGHT NOW. MAY REMOVE THEM AS EMAIL IS USED FOR LOGGING IN. LOOK INTO IT TOMORROW.

1. [DONE] Add login and conect it to protected routes

2. [DONE] connect the db and backend to the front end, data for population, and debug if necessary

3. [DONE] add a login feature and conditional rendering if the user doesn't have any saved passwords and if the user isn't logged in

4. change how login works, primarily change how the DB stores new users email and password, hash instead of encrypt, and make sure then the user log's in they hash the attempt and compare against

5. [DONE] add a feature that encrypts the usernames and passwords for the user in the database             [WILL BE CHANGED]

6. [DONE] 4.5 Add a feature to encrypt the users saved credentials in the DB

7. add a feature that encrypts the data going back and forth from the API call, make sure it stays encryped when in the browser until the button is pressed to show the user the password (Will look like this ******)

8. [HALF-DONE] add a hamburger menu on the ... button for logging out, adding 2 factor auth, and light/dark mode

9. Add a seach option at the top that will look through the websites annd find the sire the user is looking for. partial and full searches

10. finalize styling

ADDITIONAL features

1. auto populate

2. favicon saving for closed card display

3. weak password warning, run the password through a basic formatter that I may have to build, looks for num of characters, special characters, numbers, no repetition, things like that and tells the user the password strength

4. maybe inpliment an API that has common passwords and runs the users by it to tell them if its been in a data breech or if its too common







This is the object to send data to the password manager : 

making a user : 

{
  "name": "DaUsernameBoi",
  "email": "daemailboi@daemail.com",
  "password": "DaPasswordBoi"
}

making a credential :

{
  "username": "exampleUsername",
  "password": "examplePassword",
  "website": "https://example.com"
}

for put 

{
  "username": "exampleUsername",
  "password": "examplePassword",
  "website": "https://example.com"
}


MONDAY TOFO FOR TOKEN AUTH : 

To manage logged-in and logged-out states in your password manager, you should implement token-based authentication. This typically involves using JSON Web Tokens (JWT) to securely transmit information between the client and server. Here are the steps to implement this:

Steps to Implement Token-Based Authentication
Generate JWT Tokens:

Generate JWT tokens upon successful login.
Send Tokens to Client:

Send the generated token to the client upon successful login.
Store Tokens on Client:

Store the token on the client side (e.g., in localStorage or cookies).
Protect Routes:

Protect routes on the server that require authentication by verifying the token.
Handle Logged-In and Logged-Out States:

Use the presence of the token to determine if the user is logged in or logged out and conditionally render features accordingly.
Example Implementation
1. Generate JWT Tokens
Add a dependency for JWT in your pom.xml (if using Maven):

<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>

Create a utility class for generating and validating JWT tokens:

package com.example.demo.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtUtil {
    private static final String SECRET_KEY = "your_secret_key";

    public static String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    public static boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

2. Send Tokens to Client
Update the login method in UserController to generate and send the token upon successful login:

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    try {
        boolean isAuthenticated = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
        if (isAuthenticated) {
            String token = JwtUtil.generateToken(loginRequest.getEmail());
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
    }
}

3. Store Tokens on Client
Store the token on the client side (e.g., in localStorage or cookies) after receiving it from the server.

4. Protect Routes
Create a filter to protect routes that require authentication:

package com.example.demo.filter;

import com.example.demo.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtFilter implements javax.servlet.Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String authorizationHeader = httpRequest.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = authorizationHeader.substring(7);
        if (!JwtUtil.isTokenValid(token)) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Claims claims = JwtUtil.extractClaims(token);
        httpRequest.setAttribute("claims", claims);
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}

Register the filter in your WebSecurityConfig:

package com.example.demo.config;

import com.example.demo.filter.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@Order(1)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtFilter jwtFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/login").permitAll()
            .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    }
}

5. Handle Logged-In and Logged-Out States
Use the presence of the token to determine if the user is logged in or logged out and conditionally render features accordingly on the client side.

Summary
Generate JWT Tokens: Generate JWT tokens upon successful login.
Send Tokens to Client: Send the generated token to the client upon successful login.
Store Tokens on Client: Store the token on the client side (e.g., in localStorage or cookies).
Protect Routes: Protect routes on the server that require authentication by verifying the token.
Handle Logged-In and Logged-Out States: Use the presence of the token to determine if the user is logged in or logged out and conditionally render features accordingly.
By following these steps, you can implement token-based authentication and manage logged-in and logged-out states in your password manager.