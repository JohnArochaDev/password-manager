import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './login.css'; // Ensure this import is correct

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

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