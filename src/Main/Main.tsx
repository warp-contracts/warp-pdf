import { Component, Show, createSignal } from 'solid-js';
import { Col, Row } from 'solid-bootstrap';
import './Main.scss';
import Button from '../Button/Button';
import DragNDrop from '../DragNDrop/DragNDrop';
import { Tag, Warp } from 'warp-contracts';
import { InjectedArweaveSigner, InjectedEthereumSigner } from 'warp-contracts-plugin-deploy';
import List from '../List/List';
import { providers } from 'ethers';

interface MainProps {
  handleModalOpen: () => void;
  walletAddress: () => string | null;
  warp: Warp;
  contracts: any;
  contractsLoading: boolean;
  refetch: any;
  walletProvider: () => 'metamask' | 'arconnect' | undefined;
  loadingWalletAddress: () => boolean;
  setContractNumber: (value: number) => void;
}

const Main: Component<MainProps> = (props) => {
  const [loading, setLoading] = createSignal(false);
  const [file, setFile] = createSignal<any>();
  const deployContract = async () => {
    setLoading(true);
    const address = props.walletAddress() as string;
    const tags = [
      new Tag('Content-Type', 'application/pdf'),
      new Tag('Type', 'pdf'),
      new Tag('Title', 'Sample PDF'),
      new Tag('Description', 'Sample PDF uploaded as Atomic Asset to Permaweb'),
      new Tag('Application-Name', 'Warp PDF'),
      new Tag('Warp PDF Name', file().name),
    ];

    let userSigner;
    if (props.walletProvider() == 'metamask') {
      const wallet = new providers.Web3Provider(window.ethereum);
      userSigner = new InjectedEthereumSigner(wallet);
    } else {
      userSigner = new InjectedArweaveSigner(window.arweaveWallet);
    }

    await userSigner.setPublicKey();
    const arrayBufferFile = await file().arrayBuffer();
    const { contractTxId } = await props.warp.deployFromSourceTx({
      srcTxId: 'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ',
      initState: JSON.stringify({
        balances: {
          [address]: 1000000,
        },
        name: 'AtomicToken',
        ticker: 'ATOMIC-TOKEN',
        pairs: [],
        creator: address,
        settings: [['isTradeable', true]],
      }),
      wallet: userSigner as any,
      data: {
        'Content-Type': 'application/pdf',
        body: Buffer.from(arrayBufferFile),
      },
      tags,
    });

    console.log('Contract tx id', contractTxId);
    setLoading(false);
    setFile();
    props.setContractNumber(props.contracts.length + 1);
    await props.refetch();
  };
  return (
    <Row class='justify-content-center flex-column main flex-grow-1 align-middle'>
      {!props.walletAddress() ? (
        <>
          <Col class='d-flex justify-content-center align-items-end'>
            <div class='main__loader'></div>
          </Col>
          <Col>
            <Button handleClick={props.handleModalOpen}>Connect</Button>
          </Col>
        </>
      ) : (
        <>
          <DragNDrop handleClick={deployContract} loading={loading()} file={file} setFile={setFile}></DragNDrop>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <Row class='main__list-wrapper justify-content-center'>
                <span class='p-2'>PDFs</span>
                <Show
                  when={!props.contractsLoading && !props.loadingWalletAddress()}
                  fallback={<Row class='loader'></Row>}
                >
                  <Show
                    when={props.contracts && props.contracts.length > 0}
                    fallback={<div class='main__list-wrapper__no-info'>No info about pdfs.</div>}
                  >
                    <List data={props.contracts}></List>
                  </Show>
                </Show>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Row>
  );
};

export default Main;
