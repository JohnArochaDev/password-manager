import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './UserData.css';

export default function UserData({ secureData, setClicked, setDarkMode, darkMode, handleDelete }) {
    const [credentialId, setCredentialId] = useState('');
    const [userToken, setUserToken] = useState('');

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    useEffect(() => {
        setUsername(secureData.username)
        setPassword(secureData.password)
    }, [])

    const [buttonSwitch, setButtonSwitch] = useState(false)

    async function handleDeleteClick() {
        try {
            const response = await fetch(`http://localhost:8080/credentials/${credentialId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                handleDelete();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleEdit() {

        setButtonSwitch(true)

        let updatedData = {
            username: username,
            password: password
        }

        try {
            const response = await fetch(`http://localhost:8080/credentials/${credentialId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                body: {updatedData}
            });
            if (response.ok) {
                console.log("SUCCESSFUL UPDATE")
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        setCredentialId(secureData.id);

        chrome.storage.local.get(['jwtToken', 'userId'], function(result) {
            setUserToken(result.jwtToken);
        });
    }, [secureData.id]);

    return (
        <Container className="w-100 d-flex flex-column justify-content-between align-items-center text-white">
            <Row className="w-100">
                <Col className="d-flex justify-content-end p-0">
                    <Button className="x-button no-padding no-margin mb-3" onClick={() => setClicked(null)}>X</Button>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col xs={12} className="d-flex justify-content-center">
                    <p className="field">{secureData.website}</p>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col xs={6} className="text-start">
                    <p className="field">Username:</p>
                </Col>
                <Col xs={6} className="text-end">
                    <input type="text" 
                    value={username} 
                    readOnly={!buttonSwitch} 
                    className="form-control dark-input field" 
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </Col>
            </Row>
            <Row className="mb-4">
                <Col xs={6}>
                    <p className="field">Password:</p>
                </Col>
                <Col xs={6}>
                    <input type="password" 
                    value={password} 
                    readOnly={!buttonSwitch} 
                    className="form-control dark-input field" 
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </Col>
            </Row>
            <Row className="w-100 d-flex justify-content-between align-items-center">
                <Col xs="auto">
                    <Button variant="primary" block onClick={handleEdit}>Edit</Button>
                </Col>
                <Col xs="auto">
                    {buttonSwitch ? <Button block onClick={handleDeleteClick}>Confirm</Button> : <Button variant="danger" block onClick={handleDeleteClick}>Delete</Button>}
                </Col>
            </Row>
        </Container>
    );
}