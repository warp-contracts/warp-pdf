import { UploadFile, createDropzone, createFileUploader } from '@solid-primitives/upload';
import { Col, Container, Row } from 'solid-bootstrap';
import { ParentComponent, Show, createSignal } from 'solid-js';
import Button from '../Button/Button';
import './DragNDrop.scss';

interface DragNDropProps {
  handleClick: () => void;
  loading: boolean;
  file: () => File;
  setFile: any;
}

const DragNDrop: ParentComponent<DragNDropProps> = (props) => {
  const [error, setError] = createSignal('');
  const { selectFiles } = createFileUploader({ accept: 'application/pdf' });
  const { setRef: dropzoneRef } = createDropzone({
    onDrop: async (files) => {
      if (files[0].file.type != 'application/pdf') {
        setError(`Only application/pdf file type is accepted. File type: ${files[0].file.type}`);
        return;
      } else {
        setError('');
        props.setFile(files[0].file);
      }
    },
  });

  return (
    <Row class='flex-column justify-content-center align-middle'>
      <Col md={{ span: 6, offset: 3 }}>
        <div
          ref={dropzoneRef}
          class='drag-n-drop d-flex flex-column justify-content-evenly p-4'
          onClick={() => {
            selectFiles(async ([{ file }]) => {
              if (file.size > 500000) {
                setError(`File size exceeds limit of 500KB. File size: ${file.size}.`);
                return;
              } else {
                setError('');
                props.setFile(() => file);
              }
            });
          }}
        >
          {props.loading ? (
            <div class='loader align-self-center'></div>
          ) : props.file() ? (
            <span>{props.file().name}</span>
          ) : (
            <>
              <img class='drag-n-drop__img' height={100} src='/assets/drag-drop.svg' />
              <div class='mt-5'>Drag and drop your PDF or click to browse</div>
              <div class='drag-n-drop__error'>{error() || ' '}</div>
            </>
          )}
        </div>
      </Col>
      <Col class='mt-3'>
        <Button
          handleClick={props.handleClick}
          disabled={!props.file() || props.loading}
          class={!props.file() ? 'invisible' : ''}
        >
          Send
        </Button>
      </Col>
    </Row>
  );
};

export default DragNDrop;
