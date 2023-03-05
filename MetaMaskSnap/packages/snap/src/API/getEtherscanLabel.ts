// all labels are here https://polygonscan.com/labelcloud
// scam 0xe7d162ff34bcf5e5efc301fa061cbfb51341a814
// Tornado.cash 0xdf231d99ff8b6c6cbf4e9b9a945cbacef9339178
// No label 0x3F2f4AA023c6Ed149D342229afAc6E140E149114

const getUrl = (chainIdDec: number, address: string) => {
  switch (chainIdDec) {
    case 1:
      // Ethereum Mainnet
      return 'https://etherscan.io/address/${address}';
    case 5:
      // Goerli Testnet
      return'https://goerli.etherscan.io/address/${address}';
    case 137:
      // Polygon Mainnet
      return `https://polygonscan.com/address/${address}`;
      
    default:
      throw new Error('Unrecognized chain id!');
  }}

export async function getEtherscanLabel(chainIdDec: number, address: string) {
  const api_url =  getUrl(chainIdDec, address);
  
  let element = '';
  //Access to fetch at 'https://polygonscan.com/address/0x1e4b7a6b903680eab0c5dabcb8fd429cd2a9598c' from origin 'https://metamask.github.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
  //If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
  //If you are trying to address this issue temporarily on your localhost, you can use this chrome extension : Allow CORS Access-Control-Allow-Origin https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf
  await fetch(api_url)
    .then((response) => response.text())
    .then((htmlString) => {
      // can't use new DOMParser() because it is undefined when running from snap
      /*let parser = new DOMParser();
      let htmlDoc = parser.parseFromString(htmlString, 'text/html');
      let htmlElement = htmlDoc.querySelector('a.u-label.u-label--xs');
      console.log('htmlElement');
      console.log(htmlElement);
      if (htmlElement == null) {
        element = 'No label found';
      } else {
        element = htmlElement.textContent;
      }*/
      let text = htmlString;
      let regex = /u-label u-label--xs.*?>(.+)</g;
      let groups = [...text.matchAll(regex)].map((match) => match[1]);
      let endIndex = groups.map((i) => i.includes('Transfer')).indexOf(true);
      let labels = groups.slice(0, endIndex);
      console.log(labels);
      if (labels.length == 0) {
        element = 'No label found';
      } else {
        element = labels[0];
      }
    })
    .catch((error) => console.error(error));
  console.log(`element`);
  console.log(element);
  return element;
}
