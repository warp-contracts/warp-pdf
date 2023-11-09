import { providers } from 'ethers';
import { arrayify, hashMessage, recoverPublicKey } from 'ethers/lib/utils';
import { GQLResultInterface, GQLTransactionsResultInterface, Warp, WarpFactory, getJsonResponse } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

export const initializeWarp = () => {
  return WarpFactory.forMainnet().use(new DeployPlugin());
};

export const getContracts = async (walletAddress: string) => {
  console.log(walletAddress);
  const variables = {
    tags: [
      {
        name: 'Application-Name',
        values: 'Warp PDF',
      },
    ],
    owners: [walletAddress],
  };
  const query = `query Transaction($tags: [TagFilter!]!, $owners: [String!]) {
      transactions(tags: $tags, owners: $owners) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          owner { address }
          block {
            timestamp
          }
          tags {
            name
            value
          }
        }
        cursor
      }
      }
    }`;

  let result: GQLTransactionsResultInterface = (
    await getJsonResponse<GQLResultInterface>(
      fetch(`https://arweave.net/graphql`, {
        method: 'POST',
        body: createGqlQuery(query, variables),
        headers: {
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
    )
  ).data.transactions;
  const edges = [...result.edges];
  console.log(edges);

  while (result.pageInfo.hasNextPage) {
    const cursor = result.edges[100 - 1].cursor;

    const newVariables = {
      ...variables,
      after: cursor,
    };

    result = (
      await getJsonResponse<GQLResultInterface>(
        fetch(`https://arweave.net/graphql`, {
          method: 'POST',
          body: createGqlQuery(query, newVariables),
          headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
      )
    ).data.transactions;
    edges.push(...result.edges);
  }
  const contracts = edges
    // .sort((a, b) => b.node.block.timestamp - a.node.block.timestamp)
    .map((e, i) => {
      return { i: i + 1, id: e.node.id, name: e.node.tags.find((t) => t.name == 'Warp PDF Name')?.value };
    });
  return contracts;
};

const createGqlQuery = (query: string, variables: { tags: { name: string; values: string }[]; cursor?: string }) => {
  return JSON.stringify({ query, variables });
};

export const overflowId = (id: string) => {
  return id.substr(0, 5) + '...' + id.substr(id.length - 5);
};

export const getEthAddressForGql = async (warp: Warp) => {
  const wallet = new providers.Web3Provider(window.ethereum).getSigner();
  const text = 'Sign this message to connect to Warp PDF';
  const signedMsg = await wallet.signMessage(text);
  const hash = hashMessage(text);
  const recoveredKey = recoverPublicKey(arrayify(hash), signedMsg);
  const publicKey = Buffer.from(arrayify(recoveredKey));
  console.log(publicKey.toString('base64'));
  const addressGql = await warp.arweave.wallets.ownerToAddress(publicKey.toString('base64'));
  return addressGql;
};
