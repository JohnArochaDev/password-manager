import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Col, Row, Container, Dropdown } from 'react-bootstrap';

import App from './components/App/App.jsx';
import Login from './components/Login/Login.jsx';

import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './main.css'; // Import custom CSS

export default function Main() {
    const [loggedin, setLoggedin] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setLoggedin(true);
            const id = localStorage.getItem("userId");
            console.log("IDDDD " + id);

            // Send a message to the background script to fetch the latest data
            chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
                if (response.status === 'success') {
                    console.log('Data fetched successfully');
                    setReload(!reload); // Trigger a re-render if needed
                } else {
                    console.error('Failed to fetch data');
                }
            });
        }
    }, [reload]);

    return (
        <StrictMode>
            <div className="custom-bg">
                <Container fluid className="container-fullwidth d-flex flex-column justify-content-center align-items-center text-white">
                    <Row className="w-100 d-flex justify-content-between align-items-center">
                        <Col xs="auto">
                            <img src="shield-lock-line-icon.png" alt="icon" className="m-3" />
                            {/* here is the link for later : https://uxwing.com/shield-lock-line-icon/ */}
                        </Col>
                        <Col xs="auto">
                            <Dropdown>
                                <Dropdown.Toggle className="m-3 custom-button">
                                    ...
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="custom-dropdown-menu">
                                    <Dropdown.Item href="#/action-1">Settings</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>

                    {loggedin ? <App /> : <Login reload={reload} setReload={setReload} />}
                </Container>
            </div>
        </StrictMode>
    );
}

createRoot(document.getElementById('root')).render(<Main />);