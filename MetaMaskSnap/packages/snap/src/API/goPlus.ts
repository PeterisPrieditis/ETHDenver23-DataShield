export const  goPlusPhishing = async (website: string)=> {
  //let url =  'https://api.gopluslabs.io/api/v1/phishing_site?url=https://xn--cm-68s.cc/';
  const url = `https://api.gopluslabs.io/api/v1/phishing_site?url=${website}`
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.result.phishing_site;
  }
  catch (error) {
    console.log('Error occured with GoPlus Security call!');
    console.error(error);
  }
}
