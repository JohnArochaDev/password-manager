import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Col, Row, Container, Dropdown } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';

import App from './components/App/App.jsx';
import Login from './components/Login/Login.jsx';
import Settings from './components/Settings/Settings.jsx'

import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

export default function Main() {
    const [loggedin, setLoggedin] = useState(false);
    const [reload, setReload] = useState(false);

    const [settingsPage, setSettingsPage] = useState(false)
    const [darkMode, setDarkMode] = useState(true)
    const [showCompromisedPasswords, setShowCompromisedPasswords] = useState(false) // in settings, shows comp or no snow comp
    const [search, setSearch] = useState(true)

    function handleLogout() {
        chrome.storage.local.set({ jwtToken: null, userId: null }, function() {
            setLoggedin(false);
            setReload(!reload);
        });
    }

    useEffect(() => {
        chrome.storage.local.get(['jwtToken', 'userId'], function(result) {
            const token = result.jwtToken;
            const id = result.userId;

            if (token) {
                try {
                    const decodedToken = jwtDecode(token)
                    const currentTime = Date.now() / 1000 // this is time in seconds


                    if(decodedToken.exp < currentTime) {
                        handleLogout()
                    } else {
                        setLoggedin(true)

                        chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
                            if (response.status === 'success') {
                                setReload(!reload);
                            } else {
                                console.error('Failed to fetch data');
                            }
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch data');
                }
            }
        });
    }, []);

    return (
        <StrictMode>
            <div className={darkMode ? "custom-bg" : "light-mode-custom-bg"}>
                <Container fluid className="container-fullwidth d-flex flex-column justify-content-center align-items-center text-white">
                    <Row className="w-100 d-flex justify-content-between align-items-center">
                        <Col xs="auto">
                            <img src="shield-lock-line-icon.png" alt="icon" className="m-3" />
                        </Col>
                        <Col xs="auto">
                            <Dropdown>
                                <Dropdown.Toggle className={darkMode ? "m-3 custom-button" : "m-3 light-mode-custom-button"}>
                                    ...
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={darkMode ? "custom-dropdown-menu" : "light-mode-custom-dropdown-menu"}>
                                    { settingsPage ? (<Dropdown.Item onClick={() => setSettingsPage(!settingsPage)}>Home</Dropdown.Item>) : (<Dropdown.Item onClick={() => setSettingsPage(!settingsPage)}>Settings</Dropdown.Item>) }
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    {loggedin ? ( settingsPage ? (<Settings setDarkMode={setDarkMode} darkMode={darkMode} setReload={setReload} reload={reload} setSettingsPage={setSettingsPage} settingsPage={settingsPage} setLoggedin={setLoggedin} setShowCompromisedPasswords={setShowCompromisedPasswords} showCompromisedPasswords={showCompromisedPasswords} />) : (<App reload={reload} setReload={setReload} setDarkMode={setDarkMode} darkMode={darkMode} search={search} setSearch={setSearch} setShowCompromisedPasswords={setShowCompromisedPasswords} showCompromisedPasswords={showCompromisedPasswords} />) ) : ( <Login reload={reload} setReload={setReload} setLoggedin={setLoggedin} setDarkMode={setDarkMode} darkMode={darkMode} /> ) }
                </Container>
            </div>
        </StrictMode>
    );
}

createRoot(document.getElementById('root')).render(<Main />);