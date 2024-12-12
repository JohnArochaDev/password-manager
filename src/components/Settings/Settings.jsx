import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import './settings.css'

export default function Settings({ setReload, reload, setSettingsPage, settingsPage, setLoggedin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loginError, setLoginError] = useState('');
    
    
    const [showForm, setShowForm] = useState(false);

    const handleShow = () => setShowForm(true);
    const handleClose = () => setShowForm(false);

    async function handleDeleteSubmit(e) {
        e.preventDefault()

        let userIdForDeletion
        let userTokenForDeletion

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
            userIdForDeletion = data.userId
            userTokenForDeletion = data.token

            // Add delete route
            try {
                const response = await fetch(`http://localhost:8080/users/${userIdForDeletion}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${userTokenForDeletion}`,
                        'Content-Type': 'application/json'
                    },
                })
            } catch (error) {
                console.error('Error:', error)
            }
            
            chrome.storage.local.set({ jwtToken: null }, function() {
                console.log('Token removed')
            })

            // Optionally, store the user ID
            chrome.storage.local.set({ userId: null }, function() {
                console.log('User ID removed')
            })

            // Update the UI or redirect as needed
            setLoggedin(false)
            setSettingsPage(false)
            setReload(!reload)
            console.log("SHOULD RELOAD EVERTHING")
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <>
            <h1>Settings</h1>
            <hr style={{ width: '90%', borderColor: '#37383a' }} />

            <Form className="my-4">
                <Form.Check 
                    type="switch"
                    id="custom-switch"
                    className="custom-switch"
                    label="Dark Mode"
                />
            </Form>

            <Button className='custom-form-button' onClick={handleShow}>
                Delete Account
            </Button>

            <Modal show={showForm} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Verify credentials</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleDeleteSubmit} className="p-4" style={{ backgroundColor: '#344955', borderRadius: '8px' }}>
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
                        <Button variant="danger" type="submit" style={{ backgroundColor: '#344955', borderColor: '#50727B' }}>
                           Delete Account
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}