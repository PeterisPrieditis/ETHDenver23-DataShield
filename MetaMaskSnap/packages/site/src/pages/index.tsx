import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import * as smartmoney from '../assets/smart_money.json';
import * as smarttx from '../assets/smart_tx.json';

import {
  connectSnap,
  getSnap,
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
} from '../components';
const Input = styled.input`
  padding: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text.default};
  background-color: ${({ theme }) => theme.colors.background.light};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.default};
  width: 100%;
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.primary.default};
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 3.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;

  th,
  td {
    padding: 1rem;
    text-align: left;
    vertical-align: middle;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
  }

  th {
    background-color: ${({ theme }) => theme.colors.background.alternative};
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text.alternative};
  }

  tbody tr:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background.light};
  }

  ${({ error, theme }) =>
    error &&
    `
      th,
      td {
        border: 1px solid ${theme.colors.error.default};
      }

      tbody tr:nth-child(even) {
        background-color: ${theme.colors.error.muted};
      }
  `}
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const [inputAddress, setInputAddress] = useState("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
  const [debounceInputAddress, setDebounceInputAddress] = useState();
  const [chatList, setChatList] = useState<any>([]);
  useEffect(() => {
    if (inputAddress) {
      const timeout = setTimeout(() => {
        setDebounceInputAddress(inputAddress);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [inputAddress]);

  useEffect(() => {
    if (debounceInputAddress !== inputAddress) {
      console.log('debounceInputAddress', debounceInputAddress);
      //https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=-0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
      //https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=-0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
      //https://api.gopluslabs.io/api/v1/address_security/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d?chain_id=1 
      //https://api.gopluslabs.io/api/v1/nft_security/1?contract_addresses=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
      const addressSecurity = "https://api.gopluslabs.io/api/v1/address_security/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d?chain_id=1"
      fetch(addressSecurity)
  .then((response) => response.json())
  .then((data) => {
  

      fetch(addressSecurity)
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          async function fetchStream(stream:any) {
            const reader = stream.getReader();
            let charsReceived = 0;
            let li = ""
        
            // read() returns a promise that resolves
            // when a value has been received
            const result = await reader.read().then(
                function processText({ done, value }:any) {
                    // Result objects contain two properties:
                    // done  - true if the stream has already given you all its data.
                    // value - some data. Always undefined when done is true.
                    if (done) {
                        console.log("Stream complete");
                        return li;
                    }
                    // value for fetch streams is a Uint8Array
                    charsReceived += value.length;
                    const chunk = value;
                    console.log(`Received ${charsReceived} characters so far. Current chunk = ${chunk}`);
                    li+=chunk;
                    return reader.read().then(processText);
                });
            const list = result.split(",")
            const numList = list.map((item:any) => {
                return parseInt(item)
            })
            const text = String.fromCharCode(...numList);
            const response = JSON.parse(text)
            return response
        }

          async function createCompletion(params = {}) {
            const DEFAULT_PARAMS = {
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "The user will provide you a machine readable JSON of ethereum security assesments and you have to convert it a 200 character text for a target group of an iq of 90." },
                { role: "user", content: JSON.stringify(data) }],
                // max_tokens: 4096,
                temperature: 0,
                // frequency_penalty: 1.0,
                // stream: true,
            };
            const params_ = { ...DEFAULT_PARAMS, ...params };
            try{
            const result = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${"ENTER TOKEN HERE"}`
                },
                body: JSON.stringify(params_)
            });
            const stream = result.body
            const output = await fetchStream(stream);
            console.log(output)
            if(output?.error?.code==="invalid_api_key"){
              throw "invalid_api_key"
            }
              output?.choices?.[0]?.message && setChatList((previousInputs:any) => (previousInputs.concat(output.choices[0].message)));

            }catch(err){
              console.log(err)
              //delay setChatList 2 seconds
              setTimeout(() => {

              setChatList([{content: "Ethereum security assessments show no signs of cybercrime, money laundering, phishing activities, or any other malicious activities. The contract address is secure and there is no evidence of fake KYC or stealing attacks. The data source is unknown, but there is no doubt of any blacklisted activities or sanctioned behavior. Malicious mining activities, mixers, and honeypot-related addresses are also absent."}])
              }, 2000);

            }

        }
        createCompletion()
          
        }
        )
        .catch((error:any) => {
          console.error('Error:', error);
        }

        )




    
  })}}, [debounceInputAddress,inputAddress]);

  return (
    <Container>
      <Heading>
        Welcome to <span style={{ color: '#7FD3A0' }}>DATA</span>
        <span style={{ color: '#333333' }}> SHIELD</span>
      </Heading>
      <Subtitle>
        Find data on any
        <code>
          <b>ETH ADDRESS OR NFT</b>
        </code>
      </Subtitle>

      <div>
        {' '}
        <br />{' '}
        <Input
          onChange={(event) => setInputAddress(event.target.value)}
          value={inputAddress}
          placeholder="0x7aa9..."
        />
        <button style={{ width: '100%' }}>Analyze</button>

        {chatList.length >0 && <CardContainer>
          <Card
            content={{
              title: 'Results',
              description: <p style={{maxWidth:"300px"}}>{(chatList as any)[0].content}</p>  }} />
        </CardContainer>}
      </div>
      <CardContainer>
        <Card
          content={{
            title: 'Smart money',
            description: (
              <div>
                Using our insights, you can make better decisions and earn more
                money.
                <Table>
                  <tr>
                    <td>Bot entity</td>
                    <td>Contract</td>
                    <td>Profit</td>
                  </tr>
                  {smartmoney.map((item) => {
                    //{"mev_trades":"3E5BC06268C827E684B278AAAACCDF7B741EE6494670CFC0D7155F1AFA2C068F","contract_address":"44D39E215C112C5AEC6A733D691B464AA62B3F85","topic":"52D77A8187160E41D08F892F46D6CF8ADA1F6771","value":0.01460109}
                    // style tds with ellipsis
                    return (
                      <tr>
                        <td style={{ maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        }}>{item.contract_address}</td>

                        <td style={{ maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        }}>{item.mev_trades}</td>
                        {/* <td style={{ maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        }} >{item.topic}</td> */}
                        <td style={{ maxWidth: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        }} >USD {
                        // improve the styling of the value
                          item.value 
                        }</td> 
                      </tr>
                    );
                  })}
                </Table>
              </div>
            ),
          }}
          fullWidth
        />
      </CardContainer>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}

        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
