import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Col, Row, Button, Container } from 'react-bootstrap';

import App from './components/App/App.jsx';
import Login from './components/Login/Login.jsx';

import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './main.css'; // Import custom CSS

export default function Main() {

    const [loggedin, setLoggedin] = useState(false)
    const [reload, setReload] = useState(false)


    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setLoggedin(true)
            const id = localStorage.getItem("userId")
            const token = localStorage.getItem("jwtToken")
            console.log("IDDDD " + id)
        }
    }, [reload])

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
                            <Button className="m-3 custom-button" >...</Button>
                        </Col>
                    </Row>


                    {/* <App /> */}
                    {loggedin ? <App /> : <Login reload={reload} setReload={setReload} />}



                </Container>
            </div>
        </StrictMode>
    );
}


createRoot(document.getElementById('root')).render(<Main />);