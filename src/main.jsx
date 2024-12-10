import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Col, Row, Button, Container } from 'react-bootstrap';

import App from './components/App/App.jsx';
import Login from './components/Login/Login.jsx';

import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './main.css'; // Import custom CSS

export default function Main() {

    const [loggedin, setLoggedin] = useState(false)


    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        console.log("THIS IS THE TOKEN : \n" + token)
        if (token) {
            console.log("WE IN HEREEE")
            setLoggedin(true)
        }
    }, [])

    return(
        <StrictMode>
            <div className="custom-bg">
                <Container fluid className="container-fullwidth d-flex flex-column justify-content-center align-items-center text-white">
                    <Row className="w-100 d-flex justify-content-between align-items-center">
                        <Col xs="auto">
                            <img src="shield-lock-line-icon.png" alt="icon" className="m-3" />
                            {/* here is the link for later : https://uxwing.com/shield-lock-line-icon/ */}
                        </Col>
                        <Col xs="auto">
                            <Button className="m-3" variant="danger" style={{ backgroundColor: '#344955', borderColor: '#50727B' }}>...</Button>
                        </Col>
                    </Row>


                    {/* <App /> */}
                    {loggedin ? <App /> : <Login />}



                </Container>
            </div>
        </StrictMode>
    );
}


createRoot(document.getElementById('root')).render(<Main />);