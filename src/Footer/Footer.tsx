import { Col, Container, Row } from 'solid-bootstrap';
import './Footer.scss';

const Footer = () => (
  <Container fluid class='mt-4'>
    <Row>
      <Col>
        Powered by <img height={40} src='/assets/logo.svg'></img>
      </Col>
    </Row>
  </Container>
);

export default Footer;
