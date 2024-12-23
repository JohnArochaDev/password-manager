import { useEffect, useState, useRef } from 'react';
import PasswordsPage from "../PasswordsPage/PasswordsPage";
import {Card, Container, Modal, Button, Form} from 'react-bootstrap';

import "./App.css";

function useBackgroundData(reload) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isInitialRender = useRef(true);

    const fetchDataFromBackground = () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    console.error('Failed to fetch data:', response.message);
                    reject(new Error(response.message || 'Failed to fetch data'));
                }
            });
        });
    };

    const fetchData = async () => {
        try {
            await fetchDataFromBackground();
            chrome.storage.local.get('usersData', (result) => {
                if (result.usersData && JSON.stringify(result.usersData) !== JSON.stringify(data)) {
                    setData(result.usersData);
                } else {
                    setError('No data found.');
                }
                setLoading(false);
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            fetchData();
        } else {
            fetchData();
        }
    }, [reload]);

    return { data, loading, error };
}



export default function App({ reload, setReload, setDarkMode, darkMode }) {
    const { data, loading, error } = useBackgroundData(reload);

    const [userId, setUserId] = useState()
    const [userToken, setUserToken] = useState()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [website, setWebsite] = useState('')

    const [showModal, setShowModal] = useState(false);

    function handleShowModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    const headerStyle = {
        marginBottom: '2vh',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    };

    async function newCredential(e) {
        e.preventDefault();

        let newCredentialForm = {
            username: username,
            password: password,
            website: website
        };

        chrome.storage.local.get(['jwtToken', 'userId'], async function(result) {
            const userToken = result.jwtToken;
            const userId = result.userId;

            if (!userToken || !userId) {
                console.error('User token or ID is missing');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/credentials/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCredentialForm)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                handleCloseModal();
                setReload(!reload);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    return (
        <>
            <h1 style={headerStyle} className={darkMode ? "doto-title" : "light-mode-doto-title"}>SafePass</h1>
            <hr style={{ width: '90%', borderColor: '#37383a' }} />
            {loading ? (
                "Loading...."
            ) : error ? (
                <p>{error}</p>
            ) : (
                Array.isArray(data?.loginCredentials) && data.loginCredentials.map((secureData, idx) => (
                    <PasswordsPage key={idx} secureData={secureData} setDarkMode={setDarkMode} darkMode={darkMode} className="mb-2" />
                ))
            )}
            <Container >
                <Card className={darkMode ? "rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center card-hover" : "rounded-3 p-3 shadow-sm mx-1 my-2 text-black d-flex justify-content-center align-items-center light-mode-card-hover"} onClick={handleShowModal}>
                    <h1>+</h1>
                </Card>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Credential</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={newCredential}>
                        <Form.Group controlId="formWebsite">
                            <Form.Label>Website</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formUsername" className="mt-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-4">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}