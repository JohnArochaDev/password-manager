import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './UserData.css'

export default function UserData({ secureData, setClicked, setDarkMode, darkMode }) {

    const [credentialId, setCredentialId] = useState('')
    const [userToken, setUserToken] = useState('')

    async function handleDelete() {
        try {
            const response = await fetch(`http://localhost:8080/credentials/${credentialId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
            })
        } catch (error) {
            console.error('Error:', error)
        }

        // Update the UI or redirect as needed


        console.log("END OF EVERTHING")
    }

    async function handleEdit() {

    }

    useEffect(() => {
        setCredentialId(secureData.id)

        chrome.storage.local.get(['jwtToken', 'userId'], function(result) {
            setUserToken(result.jwtToken)
        })
    }, [secureData.id])

    return (
        // <Container className="d-flex flex-column justify-content-center text-white">
        <Container className="w-100 d-flex flex-column justify-content-between align-items-center text-white">
            <Row className="w-100">
                <Col className="d-flex justify-content-end p-0">
                    <Button className="x-button no-padding no-margin mb-3" onClick={() => setClicked(false)} >X</Button>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col xs={12} className="d-flex justify-content-center">
                    <p className="field" >{secureData.website}</p>
                </Col>
            </Row>
            
            <Row className="mb-4">
                <Col xs={6} className="text-start">
                    <p className="field" >Username:</p>
                </Col>
                {/* Make this a component that is a rounded input that hides the data, will be used for both user and pass and will have a copy button on the right hand side for ease of use */}
                <Col xs={6} className="text-end">
                    <input type="text" value={secureData.username} readOnly className="form-control dark-input field" />
                </Col>
            </Row>
            <Row className="mb-4">
                <Col xs={6}>
                    <p className="field" >Password:</p>
                </Col>
                <Col xs={6}>
                    <input type="password" value={secureData.password} readOnly className="form-control dark-input field" />
                </Col>
            </Row>
            <Row className="w-100 d-flex justify-content-between align-items-center">
                    <Col xs="auto">
                    <Button variant="primary" block onClick={handleEdit}>Edit</Button>
                    </Col>
                    <Col xs="auto">
                    <Button variant="danger" block onClick={handleDelete}>Delete</Button>
                    </Col>
                </Row>
        </Container>
    );
}