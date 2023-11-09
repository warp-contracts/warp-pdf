import { Modal } from 'solid-bootstrap';
import { ParentComponent } from 'solid-js';
import Button from '../Button/Button';

interface ModalProps {
  open: () => boolean;
  handleClose: () => void;
  additionalButton?: string | null;
  handleAdditionalButton?: () => void;
}

const ActionModal: ParentComponent<ModalProps> = (props) => {
  return (
    <Modal show={props.open()} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Connect wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button handleClick={props.handleClose}>Close</Button>
        {props.additionalButton && props.handleAdditionalButton && (
          <Button handleClick={props.handleAdditionalButton}>{props.additionalButton}</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ActionModal;
