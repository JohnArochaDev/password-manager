import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './login.css'; // Ensure this import is correct

export default function Login({ reload, setReload }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const loginData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);

            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('userId', data.userId)
            chrome.storage.local.set({ jwtToken: data.token }, function() {
                console.log('Token saved');
            });
            
            chrome.storage.local.set({ userId: data.userId }, function() {
                console.log('User ID saved');
            });

            setReload(!reload)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Container fluid className="container-fullwidth d-flex flex-column justify-content-center align-items-center text-white">
            <Row className="w-100 d-flex justify-content-center align-items-center">
                <Col xs={12} md={6} lg={4}>
                    <Form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: '#344955', borderRadius: '8px' }}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="dark-input"
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="dark-input"
                            />
                        </Form.Group>

                        <Button variant="danger" type="submit" className="mt-4" style={{ backgroundColor: '#344955', borderColor: '#50727B' }}>
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}