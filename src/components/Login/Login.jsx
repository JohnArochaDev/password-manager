import React, { useState } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import './login.css' // Ensure this import is correct

export default function Login({ reload, setReload, setLoggedin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')

    const [form, setForm] = useState("login")

    const [loginError, setLoginError] = useState('');

    function makeRegister() {
        setForm("register")
    }

    function makeLogin() {
        setForm("login")
    }

    async function handleRegister(e) {

        const registerData = {
            username: username,
            name: name,
            email: email,
            password: password
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const loginData = {
            email: email,
            password: password
        }

        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            })

            if (!response.ok) {
                setLoginError('Invalid email address or password');
                throw new Error('Network response was not ok');
            }

            const data = await response.json()
            console.log('Success:', data)

            // Store the token in chrome.storage
            chrome.storage.local.set({ jwtToken: data.token }, function() {
                console.log('Token saved')
            })

            // Optionally, store the user ID
            chrome.storage.local.set({ userId: data.userId }, function() {
                console.log('User ID saved')
            })

            // Update the UI or redirect as needed
            setLoggedin(true)
            setReload(!reload)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <Container fluid className="container-fullwidth d-flex flex-column justify-content-center align-items-center text-white">
            <Row className="w-100 d-flex justify-content-center align-items-center">
                <Col xs={12} md={6} lg={4}>
                    {(form == "login") ? (
                        <Form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: '#344955', borderRadius: '8px' }}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    isInvalid={!!loginError}
                                    required
                                    className="dark-input"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {loginError}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mt-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    isInvalid={!!loginError}
                                    required
                                    className="dark-input"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {loginError}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-between mt-4">
                                <Button variant="danger" type="submit" style={{ backgroundColor: '#344955', borderColor: '#50727B' }}>
                                    Login
                                </Button>
                                <Button variant="danger" style={{ backgroundColor: '#344955', borderColor: '#50727B' }} onClick={makeRegister}>
                                    Register
                                </Button>
                            </div>
                        </Form>) : (
                        <Form onSubmit={handleRegister} className="p-4" style={{ backgroundColor: '#344955', borderRadius: '8px' }}>
                            <Form.Group controlId="formBasicName">
                                <Form.Label>Full name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="dark-input"
                                />
                            </Form.Group>
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

                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="username"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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

                            <div className="d-flex justify-content-between mt-4">
                                <Button variant="danger" type="submit" style={{ backgroundColor: '#344955', borderColor: '#50727B' }} onClick={makeLogin}>
                                    Login
                                </Button>
                                <Button variant="danger" type="submit" style={{ backgroundColor: '#344955', borderColor: '#50727B' }}>
                                    Register
                                </Button>
                            </div>
                        </Form>)}
                </Col>
            </Row>
        </Container>
    )
}