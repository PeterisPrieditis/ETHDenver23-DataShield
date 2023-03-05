const getApiUrl = (chainIdDec: number) => {
  switch (chainIdDec) {
    case 1:
      // Ethereum Mainnet
      return 'https://api.etherscan.io/api?module=contract&apikey=112F4KAFBT6EEYZKNPN8X94PBN1K6QVJVF';
    case 5:
      // Goerli Testnet
      return 'https://api-goerli.etherscan.io/api?module=contract?apikey=DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW';
    case 137:
      // Polygon Mainnet
      return'https://api.polygonscan.com/api?module=contract&apikey=9CSKBQWVMATK4H3GYFQ2D9883DFGTZ3SGT';
      
    default:
      throw new Error('Unrecognized chain id!');
  }}

export async function blockExplorerStatus(chainIdDec: number, address: string) {
  let api_url = getApiUrl(chainIdDec)
  api_url += '&action=getsourcecode&address=' + address;
  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
  };
  let verified = false;
  try {
    const response = await fetch(api_url, options)
    const data = await response.json();
    const abi = JSON.stringify(data.result[0].ABI);
    if (abi?.includes('Contract source code not verified')) {
      verified = false;
    }
    else {
      verified = true;
    }

  } catch (error) {
    console.log('Error occured with blockExplorerStatus API call!');
      console.error(error);
  }
  
   
  
  return verified;
  //return true;
}
