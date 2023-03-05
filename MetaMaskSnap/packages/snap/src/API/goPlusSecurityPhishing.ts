export async function goPlusPhishing(website: string) {
  //let url =  'https://api.gopluslabs.io/api/v1/phishing_site?url=https://xn--cm-68s.cc/';
  let url = 'https://api.gopluslabs.io/api/v1/phishing_site?url=' + website;
  let phishingResp;
  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      phishingResp = response.result.phishing_site;
    })
    .catch((err) => {
      console.log('Error occured with GoPlus Security call!');
      console.error(err);
    });
  return phishingResp;
}
