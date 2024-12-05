import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './main.css'; // Import custom CSS

import TempApp from './components/TempApp/TempApp.jsx'; // temporary for styling
import { Container } from 'react-bootstrap';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <div className="custom-bg">
            <Container fluid className="container-fullwidth flex-column justify-content-center align-items-center text-white">
                <TempApp />
            </Container>
        </div>
    </StrictMode>
);