import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Col, Row, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './main.css'; // Import custom CSS

import TempApp from './components/TempApp/TempApp.jsx'; // temporary for styling
import { Container } from 'react-bootstrap';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <div className="custom-bg">
            <Container fluid className="container-fullwidth d-flex flex-column justify-content-center align-items-center text-white">
                <Row className="w-100 d-flex justify-content-between align-items-center">
                    <Col xs="auto">
                        <img src="icon-48.png" alt="icon" className="m-3" />
                    </Col>
                    <Col xs="auto">
                        <Button className="m-3" variant="danger">...</Button>
                    </Col>
                </Row>
                <TempApp />
            </Container>
        </div>
    </StrictMode>
);