export async function simulateAssetChangesAlchemy(
  chainIdDec: number,
  transaction,
) {
  let alchemy_url = 'not_defined';
  switch (chainIdDec) {
    case 1:
      // Ethereum Mainnet
      break;
    case 137:
      // Polygon Mainnet
      alchemy_url =
        'https://polygon-mainnet.g.alchemy.com/v2/8Vbod3ZyZouZX9ASH5-cXFE88nlUuUdJ';
      break;
    case 80001:
      // Polygon Mumbai
      alchemy_url =
        'https://polygon-mumbai.g.alchemy.com/v2/GmLly04ZIkM9hdaxgiqFhJ77QgAUW2R3';
      break;
    default:
      throw new Error('Unrecognized chain id!');
  }
  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_simulateAssetChanges',
      params: [
        {
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          data: transaction.data,
        },
      ],
    }),
  };

  let assetChangeResp: object = {};
  await fetch(alchemy_url, options)
    .then((response) => response.json())
    .then((response) => {
      //console.log('below is stringify response');
      //console.log(JSON.stringify(response));
      //console.log('below is RAW response');
      //console.log(response);
      assetChangeResp = response;
    })
    .catch((err) => {
      console.log(
        'Error occured with Alchemy API call! alchemy_simulateExecution',
      );
      console.error(err);
    });
  //console.log(JSON.stringify(assetChangeResp));
  let filteredData = Object.values(assetChangeResp.result.changes).filter(
    function (item) {
      return item.from === transaction.from || item.to === transaction.from;
    },
  );
  return filteredData;
}
