import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import exportToPDF from '../../utils/export.js'
import './settings.css'

export default function Settings({ setReload, reload, setSettingsPage, settingsPage, setLoggedin, darkMode, setDarkMode, showCompromisedPasswords, setShowCompromisedPasswords, setSearchArray, searchArray }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loginError, setLoginError] = useState('');
    
    
    const [showForm, setShowForm] = useState(false);
    const [sureFrom, setSureForm] = useState(false)

    const [userIdForDeletion, setUserIdForDeletion] = useState(null); // Use state
    const [userTokenForDeletion, setUserTokenForDeletion] = useState(null); // Use state


    const handleShowForm = () => setShowForm(true);
    const handleCloseForm = () => setShowForm(false);
    const handleShowSureModal = () => setSureForm(true);
    const handleCloseSureModal = () => setSureForm(false);

    async function handleDeleteSubmit(e) {
        e.preventDefault()

        const loginData = {
            username: email,
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

            const data = await response.json()

            setUserIdForDeletion(data.userId)
            setUserTokenForDeletion(data.token)

            if (!response.ok) {
                setLoginError('Invalid email address or password');
                throw new Error('Network response was not ok');
            }

            handleShowSureModal()
            
        } catch (error) {
            console.error('Error:', error)
        }
    }

    async function areYouSure() {
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
        })

        // Optionally, store the user ID
        chrome.storage.local.set({ userId: null }, function() {
        })

        // Update the UI or redirect as needed
        setLoggedin(false)
        setSettingsPage(false)
        setReload(!reload)
        handleCloseSureModal()
        handleCloseForm()
    }

    function handleExport() {
        if (searchArray.length > 0) {
            exportToPDF(searchArray);
        } else {
            console.error('No data to export');
        }
    }

    return (
        <>
            <h1 className={darkMode ? "font" : "light-mode-font"} >Settings</h1>
            <hr style={{ width: '90%', borderColor: '#37383a' }} />

            <Form className="my-4">
                <Form.Check 
                    type="switch"
                    id="custom-switch"
                    className={darkMode ? "font" : "light-mode-font"}
                    label="Dark Mode"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                />
            </Form>
            <Form className="mb-4">
                <Form.Check 
                    type="switch"
                    id="custom-switch"
                    className={darkMode ? "font" : "light-mode-font"}
                    label="Check Breaches"
                    checked={showCompromisedPasswords}
                    onChange={() => setShowCompromisedPasswords(!showCompromisedPasswords)}
                />
            </Form>

            <Button className={darkMode ? 'custom-form-button mb-4' : 'light-mode-custom-form-button mb-4'} onClick={handleExport}>
                Export Data
            </Button>

            <Button className={darkMode ? 'custom-form-button' : 'light-mode-custom-form-button'} onClick={handleShowForm}>
                Delete Account
            </Button>

            <Modal show={showForm} onHide={handleCloseForm} size="lg" centered className={darkMode ? "custom-modal" : "light-custom-modal"} >
                <Modal.Header closeButton>
                    <Modal.Title style={{color : '#b0b3b8'}} >Verify credentials</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleDeleteSubmit} className={darkMode ? "p-4 delete-form" : "p-4 light-mode-delete-form"}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label style={{color : '#b0b3b8'}} >Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={!!loginError}
                            required
                            className={darkMode ? "dark-input" : "light-input"}
                        />
                        <Form.Control.Feedback type="invalid">
                            {loginError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mt-3">
                        <Form.Label style={{color : '#b0b3b8'}} >Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isInvalid={!!loginError}
                            required
                            className={darkMode ? "dark-input" : "light-input"}
                        />
                        <Form.Control.Feedback type="invalid">
                            {loginError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button variant="danger" type="submit" className={darkMode ? "login-form-button mt-4" : "light-login-form-button mt-4"}>
                            Delete Account
                        </Button>
                    </div>
                </Form>
                </Modal.Body>
            </Modal>

            <Modal show={sureFrom} onHide={handleCloseSureModal} centered className={darkMode ? "custom-modal" : "light-custom-modal"}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure?
                </Modal.Body>
                <Modal.Footer>
                <div className='d-flex justify-content-around w-100'>
                    <Button variant="secondary" onClick={areYouSure} className='sureYes' >
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={handleCloseSureModal} className='sureNo' >
                        No
                    </Button>
                </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}