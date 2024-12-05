import { Container, Row, Col, Button } from 'react-bootstrap';

export default function UserData() {
  return (
    <Container
      className="d-flex flex-column justify-content-center text-white"
    >
        <Row className="mb-4">
            <Col className="d-flex justify-content-center">
            <p>https://www.myurl.com/something</p>
            </Col>
        </Row>
        
        <Row className="mb-4">
            <Col xs={6} className="text-start">
                <p>Username:</p>
            </Col>
            {/* Make this a componend that is a rounded input that hides the data, will be used for both user and pass and will haave a cop button on the right hand side for ease of use  */}
            <Col xs={6} className="text-end">
                <p>myUser123</p>
            </Col>
        </Row>
        <Row className="mb-4">
            <Col xs={6} className="text-start">
                <p>Password:</p>
            </Col>
            <Col xs={6} className="text-end">
                <p>*******</p>
            </Col>
        </Row>
        <Row className="w-100 d-flex justify-content-between">
            <Col xs={6} className="text-start">
                <Button variant="primary" block>Edit</Button>
            </Col>
            <Col xs={6} className="text-end" style={{paddingRight : '0px', marginRight : '0px', alignSelf : 'end'}} >
                <Button variant="danger" block>Delete</Button>
            </Col>
        </Row>
    </Container>
  );
}
