import { Col, Row } from 'solid-bootstrap';
import { Component } from 'solid-js';
import Button from '../Button/Button';
import { overflowId } from '../utils';

interface HeaderProps {
  handleModalOpen: () => void;
  walletAddress: () => string | null;
}

const Header: Component<HeaderProps> = (props) => {
  return (
    <Row>
      <Col class='d-flex justify-content-between'>
        <img height={50} src='/assets/logo.svg' />
        <Button handleClick={props.handleModalOpen}>
          {props.walletAddress() ? overflowId(props.walletAddress() as string) : 'Connect'}
        </Button>
      </Col>
    </Row>
  );
};

export default Header;
