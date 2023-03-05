export async function blockExplorerStatus(chainIdDec: number, address: string) {
  let api_url = 'not_defined';
  switch (chainIdDec) {
    case 1:
      // Ethereum Mainnet
      api_url =
        'https://api.etherscan.io/api?module=contract&apikey=112F4KAFBT6EEYZKNPN8X94PBN1K6QVJVF';
      break;
    case 137:
      // Polygon Mainnet
      api_url =
        'https://api.polygonscan.com/api?module=contract&apikey=9CSKBQWVMATK4H3GYFQ2D9883DFGTZ3SGT';
      break;
    default:
      throw new Error('Unrecognized chain id!');
  }
  api_url += '&action=getsourcecode&address=' + address;
  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
  };
  let verified = false;
  await fetch(api_url, options)
    .then((response) => response.json())
    .then((response) => {
      //console.log(`blockExplorerStatus response : ` + JSON.stringify(response));
      let abi = JSON.stringify(response.result[0].ABI);
      //console.log(`blockExplorerStatus abi : ` + abi);
      if (abi.includes('Contract source code not verified')) {
        verified = false;
        //console.log('false');
      } else {
        verified = true;
        //console.log('true');
      }
    })
    .catch((err) => {
      console.log('Error occured with blockExplorerStatus API call!');
      console.error(err);
    });
  return verified;
  //return true;
}
