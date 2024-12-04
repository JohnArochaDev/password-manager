import { Container, Row, Col, Button } from 'react-bootstrap';

export default function UserData() {
  return (
    <Container
      className="d-flex flex-column justify-content-center text-white"
      style={{maxWidth: '30vw', width: '100%' }} // Set max width to 50vw
    >
        <Row className="mb-4">
            <Col className="d-flex justify-content-center">
            <p>https://www.myurl.com/something</p>
            </Col>
        </Row>
        
        <Row className="mb-4">
            <Col md={6} className="text-start">
                <p>Username:</p>
            </Col>
            <Col md={6} className="text-end">
                <p>myUser123</p>
            </Col>
        </Row>
        <Row className="mb-4">
            <Col md={6} className="text-start">
                <p>Password:</p>
            </Col>
            <Col md={6} className="text-end">
                <p>*******</p>
            </Col>
        </Row>
        <Row className="w-100 d-flex justify-content-between">
            <Col md={6} className="text-start">
                <Button variant="primary" block>Edit</Button>
            </Col>
            <Col md={6} className="text-end" style={{paddingRight : '0px', marginRight : '0px', alignSelf : 'end'}} >
                <Button variant="danger" block>Delete</Button>
            </Col>
        </Row>
    </Container>
  );
}