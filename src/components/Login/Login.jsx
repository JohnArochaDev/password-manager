import React, { useState } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import './login.css' // Ensure this import is correct

export default function Login({ darkMode, reload, setReload, setLoggedin }) {
    const [showPassword, setShowPassword] = useState(false)
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')

    const [form, setForm] = useState('login')

    const [loginError, setLoginError] = useState('')

    function togglePasswordVisibility() {
        setShowPassword(!showPassword)
    }

    function toggleRegisterPasswordVisibility() {
        setShowRegisterPassword(!showRegisterPassword)
    }

    function makeRegister() {
        setForm("register")

        setPassword('')
        setUsername('')
        setName('')
    }

    function makeLogin() {
        setForm("login")
    }

    async function handleRegister(e) {
        e.preventDefault()
        makeLogin()

        const registerData = {
            name: name,
            username: username,
            password: password
        }

        console.log("REGISTER OBJ", registerData)

        try {
            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            })

            if (!response.ok) {
                setLoginError('Invalid email address or password');
                console.log("REGISTER OBJ", registerData)
                throw new Error('Network response was not ok');
            }
            makeLogin()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const loginData = {
            username: username,
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

            // Store the token in chrome.storage
            chrome.storage.local.set({ jwtToken: data.token }, function() {
            })

            // Optionally, store the user ID
            chrome.storage.local.set({ userId: data.userId }, function() {
            })

            // Update the UI or redirect as needed
            setLoggedin(true)
            setReload(!reload)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <Container fluid className="container-fullwidth d-flex flex-column justify-content-center align-items-center">
            <Row className="w-100 d-flex justify-content-center align-items-center">
                <Col xs={12} md={6} lg={4}>
                <h2 className={darkMode ? 'text-center text-white mt-3 mx-auto' : 'text-center text-black mt-3 mx-auto'}>{form == 'login' ? "Welcome Back" : "Create Account"}</h2>
                    {(form == "login") ? (
                        <Form onSubmit={handleSubmit} className="p-4 mt-5" style={{ backgroundColor: darkMode ? '#292a2d' : '#fafafa', borderRadius: '8px' }}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label className={darkMode ? 'text-white' : 'text-black'} >Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    isInvalid={!!loginError}
                                    required
                                    className={darkMode ? "dark-input" : "light-input"}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {loginError}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mt-3">
                                <Form.Label className={darkMode ? 'text-white' : 'text-black'}>Password</Form.Label>
                                <div className="password-input-container">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        isInvalid={!!loginError}
                                        required
                                        className={darkMode ? "dark-input" : "light-input"}
                                    />
                                    <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <Form.Control.Feedback type="invalid">
                                    {loginError}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-between mt-4">
                            <Button variant="danger" type="submit" className={darkMode ? "login-form-button" : "light-login-form-button"}>
                                Login
                            </Button>
                            <Button variant="danger" className={darkMode ? "login-form-button" : "light-login-form-button"} onClick={makeRegister}>
                                Register
                            </Button>
                        </div>
                        </Form>) : (
                        <Form onSubmit={handleRegister} className="p-4 mt-3" style={{ backgroundColor: darkMode ? '#292a2d' : '#fafafa', borderRadius: '8px' }}>
                            <Form.Group controlId="formBasicName">
                                <Form.Label className={darkMode ? 'text-white' : 'text-black'}>Full name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className={darkMode ? "dark-input" : "light-input"}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicUsername">
                                <Form.Label className={darkMode ? 'text-white' : 'text-black'}>Email</Form.Label>
                                <Form.Control
                                    type="email" // this was username
                                    placeholder="Enter email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className={darkMode ? "dark-input" : "light-input"}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mt-3">
                                <Form.Label className={darkMode ? 'text-white' : 'text-black'}>Password</Form.Label>
                                <div className="password-input-container">
                                    <Form.Control
                                        type={showRegisterPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className={darkMode ? "dark-input" : "light-input"}
                                    />
                                    <span className="password-toggle-icon" onClick={toggleRegisterPasswordVisibility}>
                                        {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </Form.Group>

                            <div className="d-flex justify-content-between mt-4">
                                <Button type="submit" className={darkMode ? "login-form-button" : "light-login-form-button"}>
                                    Register
                                </Button>
                                <Button type="submit" className={darkMode ? "login-form-button" : "light-login-form-button"} onClick={makeLogin}>
                                    Back
                                </Button>
                            </div>
                        </Form>)}
                </Col>
            </Row>
        </Container>
    )
}