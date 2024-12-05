import { Container, Row, Col, Button } from 'react-bootstrap';
import './UserData.css'

export default function UserData({ secureData }) {
    return (
        <Container className="d-flex flex-column justify-content-center text-white">
            <Row className="mb-4">
                <Col xs={12} className="d-flex justify-content-center">
                    <p>{secureData.website}</p>
                </Col>
            </Row>
            
            <Row className="mb-4">
                <Col xs={6} className="text-start">
                    <p>Username:</p>
                </Col>
                {/* Make this a component that is a rounded input that hides the data, will be used for both user and pass and will have a copy button on the right hand side for ease of use */}
                <Col xs={6} className="text-end">
                    <input type="text" value={secureData.email} readOnly className="form-control dark-input" />
                </Col>
            </Row>
            <Row className="mb-4">
                <Col xs={6}>
                    <p>Password:</p>
                </Col>
                <Col xs={6}>
                    <input type="password" value={secureData.password} readOnly className="form-control dark-input" />
                </Col>
            </Row>
            <Row className="w-100 d-flex justify-content-between">
                <Col xs={6}>
                    <Button variant="primary" block>Edit</Button>
                </Col>
                <Col xs={6} style={{ paddingRight: '0px', marginRight: '0px', alignSelf: 'end' }}>
                    <Button variant="danger" block>Delete</Button>
                </Col>
            </Row>
        </Container>
    );
}