// how to call tenderly txt simulation from Google chrome console
let url = 'https://mainnet.gateway.tenderly.co/6FBWoyIf3lASVnnipTOBWy';
let method = 'POST';
let headers = {
  'Content-Type': 'application/json',
};
let body = JSON.stringify({
  jsonrpc: '2.0',
  id: 0,
  method: 'tenderly_simulateTransaction',
  params: [
    {
      from: '0xeeb2f6f7a3953b8d9abb8755872f106cebadd620',
      to: '0xd322a49006fc828f9b5b37ab215f99b4e5cab19c',
      gas: '0x0',
      gasPrice: '0x0',
      value: '0xe8d4a51000',
      data: '0x474cf53d00000000000000000000000087870bca3f3fd6335c3f4ce8392d69350b4fa4e2000000000000000000000000eeb2f6f7a3953b8d9abb8755872f106cebadd6200000000000000000000000000000000000000000000000000000000000000000',
    },
    'latest',
  ],
});

// Make request using fetch library
await fetch(url, {
  method,
  headers,
  body,
})
  .then((response) => response.json())
  .then((data) => console.log(JSON.stringify(data)))
  .catch((error) => console.error(error));
