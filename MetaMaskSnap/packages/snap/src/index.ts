import { blockExplorerStatus } from './API/blockExplorerStatus';
import { simulateAssetChangesAlchemy } from './API/alchemyTxtSimulation';
import { getEtherscanLabel } from './API/getEtherscanLabel';
import { goPlusPhishing } from './API/goPlus';
import {
  OnRpcRequestHandler,
  OnTransactionHandler,
} from '@metamask/snaps-types';
import {
  panel,
  text,
  copyable,
  divider,
  spinner,
  heading,
} from '@metamask/snaps-ui';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
  console.log(`state - ${state}`);
  console.log(`state typeof - ` + typeof state);

  if (state == null) {
    // https://docs.metamask.io/guide/snaps-rpc-api.html#snap-managestate
    console.log(`setting initial state for snap_manageState`);
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        //newState: { API_KEY_ALCHEMY: 'GmLly04ZIkM9hdaxgiqFhJ77QgAUW2R3' },
        newState: {
          api_keys: {
            alchemyPolygonMainnet: 'GmLly04ZIkM9hdaxgiqFhJ77QgAUW2R3',
            polygonscan: '9CSKBQWVMATK4H3GYFQ2D9883DFGTZ3SGT',
          },
          addressBook: [{}],
        },
      },
    });
  } else {
    // do nothing
  }

  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Confirmation',
          content: panel([
            heading('Awesome heading!'),
            text(`_Hello_, **${origin}**!`),
            text(`**Markdown test!**`),
            copyable('Text to be copied'),
            divider(),
            spinner(),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    case 'storeStateData':
      console.log('---- storeStateData ----');
      console.log(state);
      console.log(
        `request.params.alchemyPolygonMainnet - ` +
          request.params.alchemyPolygonMainnet,
      );
      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: {
            api_keys: {
              alchemyPolygonMainnet: request.params.alchemyPolygonMainnet,
              polygonscan: request.params.polygonscan,
            },
            addressBook: request.params.addressBook,
          },
        },
      });
      return true;
    case 'getSnapState':
      /*state = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      });*/
      return state;
    default:
      throw new Error('Method not found.');
  }
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  console.log(
    '======================================================================',
  );
  const chainIdHex = chainId.substring(chainId.indexOf(':') + 1, chainId.length);
  const chainIdDec = parseInt(chainIdHex, 16);
  console.log(chainIdHex, ' ', chainIdDec);
  console.log(`transaction.from - ${transaction.from}`);
  console.log(`transaction.to - ${transaction.to}`);
  console.log(`transaction.value - ${transaction.value}`);
  console.log(`transaction.data - ${transaction.data}`);

  console.log(`transaction.gas - ${transaction.gas}`);
  console.log(`transaction.maxFeePerGas - ${transaction.maxFeePerGas}`);

  const filteredData = await simulateAssetChangesAlchemy(chainIdDec, transaction);
    console.log("filteredData", filteredData);
  let contractSourceVerified = await blockExplorerStatus(
    chainIdDec,
    transaction.to,
  );

  const blockExplorerLabel = await getEtherscanLabel(chainIdDec, transaction.to);
  console.log(`blockExplorerLabel - ${blockExplorerLabel}`);
  console.log(`blockExplorerLabel type of- ` + typeof blockExplorerLabel);

  const phishingStatus = await goPlusPhishing(transactionOrigin);
  console.log(`phishingStatus - ${phishingStatus}`);

  const snapUI = [heading('NFT Insights - Txt Simulation')];

  if (contractSourceVerified) {
    snapUI.push(text('Contract code **IS** verified'));
  } else {
    snapUI.push(text('Contract code **IS NOT** verified'));
  }
  if (blockExplorerLabel == 'No label found') {
    snapUI.push(text(`Block explorer label: ${blockExplorerLabel}`));
  } else {
    snapUI.push(text(`Block explorer label: **${blockExplorerLabel}**`));
  }
  if (phishingStatus == 0) {
    snapUI.push(text(`GoPlus phishing website status: false`));
  } else {
    snapUI.push(text(`GoPlus phishing website status: **true**`));
  }

  snapUI.push(divider());

  for (let i = 0; i < filteredData.length; i++) {
    if (filteredData[i]?.from == transaction?.from) {
      snapUI.push(text('**Transfering asset FROM your account**'));
    } else {
      snapUI.push(text('**Transfering asset TO your account**'));
    }

    snapUI.push(text('change type : ' + filteredData[i]?.changeType));
    snapUI.push(text('asset type : ' + filteredData[i]?.assetType));
    snapUI.push(text('name : ' + filteredData[i]?.name));
    snapUI.push(text('symbol : ' + filteredData[i]?.symbol));

    if (filteredData[i]?.from == transaction?.from) {
      snapUI.push(text('from : _YOUR ACCOUNT_'));
      snapUI.push(text('to : ' + filteredData[i]?.to));
    } else {
      snapUI.push(text('from : ' + filteredData[i]?.from));
      snapUI.push(text('to : _YOUR ACCOUNT_'));
    }

    snapUI.push(text('amount : ' + filteredData[i]?.amount));
  }

  return {
    content: panel(snapUI),
  };
};
