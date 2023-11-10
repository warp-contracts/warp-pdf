import { WarpFactory, getJsonResponse } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

interface ContractsByTag {
  paging: {
    total: number;
    limit: number;
    items: number;
    page: number;
    pages: number;
  };
  contracts: {
    contract: string;
    owner: string;
    testnet: string;
    contracttx: { tags: { name: string; value: string }[] };
    synctimestamp: string;
    total: string;
  }[];
}

export const initializeWarp = () => {
  return WarpFactory.forMainnet().use(new DeployPlugin());
};

export const getContracts = async (props: { walletAddress: string | null; contractTxId: string | null }) => {
  let result: any;
  result = (
    await getJsonResponse<ContractsByTag>(
      fetch(
        `https://gw.warp.cc/gateway/contracts-by-tag?owner=${props.walletAddress}&tag={"name":"Application-Name","value":"Warp PDF"}`
      )
    )
  ).contracts;

  async function waitUntil() {
    return await new Promise((resolve) => {
      const interval = setInterval(async () => {
        if (
          !result.some((r: any) => {
            return r.contract == props.contractTxId;
          })
        ) {
          result = (
            await getJsonResponse<ContractsByTag>(
              fetch(
                `https://gw.warp.cc/gateway/contracts-by-tag?owner=${props.walletAddress}&tag={"name":"Application-Name","value":"Warp PDF"}`
              )
            )
          ).contracts;
        } else {
          resolve('');
          clearInterval(interval);
        }
      }, 2000);
    });
  }

  if (props.contractTxId != null) {
    await waitUntil();
  }

  const contracts = result
    .sort((a, b) => Number(b.synctimestamp) - Number(a.synctimestamp))
    .map((e, i) => {
      return {
        i: i + 1,
        id: e.contract,
        name: e.contracttx.tags.find((t) => t.name == 'Warp PDF Name')?.value,
        timestamp: e.synctimestamp,
      };
    });
  return contracts;
};

export const overflowId = (id: string) => {
  return id.substr(0, 10) + '...' + id.substr(id.length - 10);
};
