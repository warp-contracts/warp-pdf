import { Col, Container, Row } from 'solid-bootstrap';
import { Show, createResource, createSignal } from 'solid-js';
import { ADDRESS_KEY, getContractsByOwner } from '../utils';
import List from '../List/List';
import './App.scss';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const App = () => {
  const [walletAddress, setWalletAddress] = createSignal<string | null>(
    localStorage.getItem(ADDRESS_KEY) || 'jnioZFibZSCcV8o-HkBXYPYEYNib4tqfexP0kCBXX_M'
  );
  const [data, { refetch }] = createResource(
    () => ({ walletAddress: walletAddress(), contractTxId: null }),
    getContractsByOwner
  );

  return (
    <Container fluid class='app p-4 d-flex flex-column'>
      <Row>
        <Header></Header>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Row class='app__list-wrapper justify-content-center'>
            <span class='p-2'>Documents</span>
            <Show when={data && !data.loading} fallback={<Row class='loader'></Row>}>
              <Show when={data} fallback={<div class='app__list-wrapper__no-info'>No info about documents.</div>}>
                <List data={data()}></List>
              </Show>
            </Show>
          </Row>
        </Col>
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
};

export default App;
