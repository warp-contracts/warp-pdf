import { createSignal, type Component, createResource } from 'solid-js';
import Header from './Header/Header';
import Main from './Main/Main';
import { Container } from 'solid-bootstrap';
import './App.scss';
import detectEthereumProvider from '@metamask/detect-provider';
import ActionModal from './ActionModal/ActionModal';
import ButtonWithIcon from './ButtonWithIcon/ButtonWithIcon';
import { providers, utils } from 'ethers';
import { getContracts, getEthAddressForGql, initializeWarp } from './utils';
import { arrayify, hashMessage, recoverPublicKey } from 'ethers/lib/utils';
import { InjectedEthereumSigner } from 'warp-contracts-plugin-deploy';

const ADDRESS_KEY = 'warp_pdf_address';
const ADDRESS_GQL = 'warp_pdf_address_gql';

const App: Component = () => {
  const warp = initializeWarp();

  const [modalOpen, setModalOpen] = createSignal(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const [metamaskModalOpen, setMetamaskModalOpen] = createSignal(false);
  const handleMetamasModalOpen = () => setMetamaskModalOpen(true);
  const handleMetamasModalClose = () => setMetamaskModalOpen(false);
  const [arconnectModalOpen, setArconnectModalOpen] = createSignal(false);
  const handleArconnectModalOpen = () => setArconnectModalOpen(true);
  const handleArconnectModalClose = () => setArconnectModalOpen(false);
  const [loadingWalletAddress, setLoadingWalletAddress] = createSignal(false);
  const [walletAddress, setWalletAddress] = createSignal(localStorage.getItem(ADDRESS_KEY) || null);
  const [walletAddressGql, setWalletAddressGql] = createSignal<string | null>(
    localStorage.getItem(ADDRESS_GQL) || null
  );
  const [walletProvider, setWalletProvider] = createSignal<'metamask' | 'arconnect'>();
  const [data, { refetch }] = createResource(walletAddressGql, getContracts);
  const connectMetamaskWallet = async () => {
    setLoadingWalletAddress(true);
    const provider = await detectEthereumProvider();
    if (provider) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }).catch((err: any) => {
        if (err.code === 4001) {
          handleModalOpen();
          setLoadingWalletAddress(false);
          return;
        } else {
          console.error(err);
          handleModalClose();
          handleMetamasModalOpen();
          setLoadingWalletAddress(false);
        }
      });
      const address = utils.getAddress(accounts[0]);
      setWalletAddress(address);
      const addressGql = await getEthAddressForGql(warp);
      setWalletAddressGql(addressGql);
      localStorage.setItem(ADDRESS_KEY, address);
      localStorage.setItem(ADDRESS_GQL, addressGql);
      await window.ethereum.on('accountsChanged', handleAccountsChanged);
      handleModalClose();
      setLoadingWalletAddress(false);
      setWalletProvider('metamask');
    } else {
      handleMetamasModalOpen();
      handleModalClose();
      setLoadingWalletAddress(false);
    }
  };

  const handleAccountsChanged = async (accounts: any) => {
    console.log(accounts);
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== walletAddress()) {
      (async () => {
        const addressGql = await getEthAddressForGql(warp);
        setWalletAddressGql(addressGql);
        setWalletAddress(utils.getAddress(accounts[0]));
        localStorage.setItem(ADDRESS_KEY, utils.getAddress(accounts[0]));
        localStorage.setItem(ADDRESS_GQL, addressGql);
      })();
    }
  };

  const disconnect = () => {
    setWalletAddress('');
    localStorage.removeItem(ADDRESS_KEY);
    localStorage.removeItem(ADDRESS_GQL);
    handleModalClose();
  };

  const connectArconnectWallet = async () => {
    if (!window.arweaveWallet) {
      handleModalClose();
      handleArconnectModalOpen();
      return;
    }
    if (!window.arweaveWallet.connect) {
      handleModalClose();
      handleArconnectModalOpen();
      return;
    }
    await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ACCESS_PUBLIC_KEY'], {
      name: 'Warp PDF',
      // logo: 'https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk',
    });
    const userAddress = await window.arweaveWallet.getActiveAddress();
    setWalletAddress(userAddress);
    setWalletAddressGql(userAddress);
    localStorage.setItem(ADDRESS_KEY, userAddress);
    localStorage.setItem(ADDRESS_GQL, userAddress);
    setWalletProvider('arconnect');
    addEventListener('walletSwitch', (e) => {
      console.log(e);
      const newAddress = e.detail.address;
      setWalletAddress(newAddress);
      setWalletAddressGql(newAddress);
      localStorage.setItem(ADDRESS_KEY, newAddress);
      localStorage.setItem(ADDRESS_GQL, userAddress);
    });
    setModalOpen(false);
  };
  return (
    <Container fluid class='app p-4 d-flex flex-column'>
      <ActionModal open={arconnectModalOpen} handleClose={handleArconnectModalClose}>
        Please connect to Arconnect!
      </ActionModal>
      <ActionModal open={metamaskModalOpen} handleClose={handleMetamasModalClose}>
        Please connect to Metamask!
      </ActionModal>
      <ActionModal
        open={modalOpen}
        handleClose={handleModalClose}
        additionalButton={walletAddress() && 'Disconnect'}
        handleAdditionalButton={disconnect}
      >
        <ButtonWithIcon icon='/assets/metamask.svg' handleClick={connectMetamaskWallet}>
          <span>Metamask</span>
        </ButtonWithIcon>
        <ButtonWithIcon
          icon='data:image/png;base64,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'
          handleClick={connectArconnectWallet}
          class='mt-2'
        >
          <span>Arconnect</span>
        </ButtonWithIcon>
      </ActionModal>
      <Header handleModalOpen={handleModalOpen} walletAddress={walletAddress}></Header>
      <Main
        handleModalOpen={handleModalOpen}
        walletAddress={walletAddress}
        warp={warp}
        contracts={data()}
        contractsLoading={data.loading}
        refetch={refetch}
        walletProvider={walletProvider}
        loadingWalletAddress={loadingWalletAddress}
      ></Main>
    </Container>
  );
};

export default App;
