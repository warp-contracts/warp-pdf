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
  setContractTxId: (value: string) => void;
  connectArconnectWallet: () => void;
  connectMetamaskWallet: () => void;
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
      try {
        userSigner = new InjectedEthereumSigner(wallet);
        await userSigner.setPublicKey();
      } catch (e) {
        await props.connectMetamaskWallet();
        userSigner = new InjectedEthereumSigner(wallet);
        await userSigner.setPublicKey();
      }
    } else {
      if (!window.arweaveWallet) {
        await props.connectArconnectWallet();
        setLoading(false);
        return;
      }
      try {
        userSigner = new InjectedArweaveSigner(window.arweaveWallet);
        await userSigner.setPublicKey();
      } catch (e) {
        await props.connectArconnectWallet();
        userSigner = new InjectedArweaveSigner(window.arweaveWallet);
        await userSigner.setPublicKey();
      }
    }

    const arrayBufferFile = await file().arrayBuffer();
    const { contractTxId } = await props.warp.deployFromSourceTx({
      srcTxId: 'HzBCFeoei50hjdlEq2X0q0X5qdMHNozXaCkNZfHRI1M',
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

    setLoading(false);
    setFile();
    props.setContractTxId(contractTxId);
    await props.refetch();
  };
  return (
    <Row class='justify-content-center flex-column main flex-grow-1 align-middle mt-4'>
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
          <Row class='flex-grow-1'>
            <Col md={{ span: 8, offset: 2 }}>
              <Row class='main__list-wrapper justify-content-center'>
                <span class='p-2'>Documents</span>
                <Show
                  when={!props.contractsLoading && !props.loadingWalletAddress()}
                  fallback={<Row class='loader'></Row>}
                >
                  <Show
                    when={props.contracts && props.contracts.length > 0}
                    fallback={<div class='main__list-wrapper__no-info'>No info about documents.</div>}
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
