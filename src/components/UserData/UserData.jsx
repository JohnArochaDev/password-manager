import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { FaCopy } from 'react-icons/fa'; // Import the icon
import './UserData.css';

export default function UserData({ secureData, setClicked, setDarkMode, darkMode, handleDelete }) {
    const [credentialId, setCredentialId] = useState('');
    const [userToken, setUserToken] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const isInitialRender = useRef(true);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            setUsername(secureData.username);
            setPassword(secureData.password);
        }

    }, []);


    const [buttonSwitch, setButtonSwitch] = useState(false);

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

    async function handleEdit(e) {
        e.preventDefault();

        setButtonSwitch(true);

        let updatedData = {
            username: username,
            password: password
        };

        try {
            const response = await fetch(`http://localhost:8080/credentials/${credentialId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            if (response.ok) {
                console.log("SUCCESSFUL UPDATE");
                setButtonSwitch(false)
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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    return (
        <Container className="w-100 d-flex flex-column justify-content-between align-items-center text-white">
            <Form onSubmit={handleEdit} className="w-100">
                <Row className="w-100">
                    <Col className="d-flex justify-content-end p-0">
                        <Button className={darkMode ? "x-button no-padding no-margin mb-3" : "light-mode-x-button no-padding no-margin mb-3"} onClick={() => setClicked(null)}>X</Button>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col xs={12} className="d-flex justify-content-center">
                        <p className={darkMode ? "field text-white" : "field text-black"}>{secureData.website}</p>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col xs={4} className="text-start pt-2">
                        <p className={darkMode ? "field text-white" : "field text-black"}>Username:</p>
                    </Col>
                    <Col xs={8} className="text-end">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={username}
                                readOnly={!buttonSwitch}
                                className={darkMode ? "form-control dark-input field" : "form-control light-input field"}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Button variant="secondary" onClick={() => copyToClipboard(username)} className="copy-button">
                                <FaCopy />
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col xs={4} className='pt-2' >
                        <p className={darkMode ? "field text-white" : "field text-black"}>Password:</p>
                    </Col>
                    <Col xs={8}>
                        <InputGroup>
                            <Form.Control
                                type={buttonSwitch ? "text" : "password"}
                                value={password}
                                readOnly={!buttonSwitch}
                                className={darkMode ? "form-control dark-input field" : "form-control light-input field"}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button variant="secondary" onClick={() => copyToClipboard(password)} className="copy-button">
                                <FaCopy />
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
                <Row className="w-100 d-flex justify-content-between align-items-center">
                    <Col xs="auto">
                        <Button variant="primary" block onClick={() => setButtonSwitch(true)}>Edit</Button>
                    </Col>
                    <Col xs="auto">
                        {buttonSwitch ? <Button type="submit" block>Confirm</Button> : <Button variant="danger" block onClick={handleDeleteClick}>Delete</Button>}
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}