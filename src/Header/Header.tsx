import { Col, Row } from 'solid-bootstrap';
import { Component } from 'solid-js';
import Button from '../Button/Button';
import { overflowId } from '../utils';

interface HeaderProps {
  handleModalOpen?: () => void;
  walletAddress?: () => string | null | undefined;
}

const Header: Component<HeaderProps> = (props) => {
  return (
    <Row>
      <Col class='d-flex justify-content-between'>
        <a href='/'>
          <img height={50} src='/assets/ondo-wordmark.svg' />
        </a>
        {props.handleModalOpen && props.walletAddress && (
          <Button handleClick={props.handleModalOpen}>
            {props.walletAddress() ? overflowId(props.walletAddress() as string, 4) : 'Connect'}
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default Header;
