import logo from "./avalancheLogo.jpg";
import React, { useState, useEffect } from "react";
import "./App.css";
import { useMoralis, MoralisProvider, useMoralisWeb3ApiCall, useMoralisWeb3Api } from "react-moralis";
import { Button, ButtonGroup, Box, Wrap, Text, Heading, Divider, Stack } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Container, Center } from "@chakra-ui/react";

const LogoutButton = () => {
  const { logout, isAuthenticating } = useMoralis();

  return (
    <Button display={"block"} colorScheme="red" variant="solid" isLoading={isAuthenticating} onClick={() => logout()} disabled={isAuthenticating}>
      Logout
    </Button>
  );
};

// ------- Render balance Tables --------
const displayTokenBalancesTable = (tokenData) => {
  return (
    <div>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Token Name</Th>
            <Th>Balance</Th>
            <Th>Symbol</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tokenData.length !== 0 ? (
            tokenData.map((element, i) => {
              return (
                <React.Fragment key={i}>
                  <Tr>
                    <Td>{element.name}</Td>
                    <Td>{element.balance / ("1e" + element.decimals)}</Td>
                    <Td>{element.symbol}</Td>
                  </Tr>
                </React.Fragment>
              );
            })
          ) : (
            <Tr>
              <Td></Td>
              <Td>No Tokens</Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </div>
  );
};

const displayNFTBalancesTable = (NFTData) => {
  return (
    <Box d="flex" align-items="baseline">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>NFT Name</Th>
            <Th>Token Address</Th>
            <Th>Token ID</Th>
            <Th>Contract Type</Th>
          </Tr>
        </Thead>
        <Tbody>
          {NFTData.length !== 0 ? (
            NFTData.result.map((element, i) => {
              return (
                <React.Fragment key={i}>
                  <Tr>
                    <Td>{element.name}</Td>
                    <Td>{element.token_address}</Td>
                    <Td style={{ lineBreak: "anywhere" }}>{element.token_id}</Td>
                    <Td>{element.contract_type}</Td>
                  </Tr>
                </React.Fragment>
              );
            })
          ) : (
            <Tr>
              <Td></Td>
              <Td>No NFTs</Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

// ---------- APP -------------
function App() {
  const { authenticate, isAuthenticated, user } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  //------ Moralis Web3 API methods for Native, ERC20 & NFT  ---------
  const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(Web3Api.account.getNativeBalance, {
    chain: "rinkeby",
  });
  const {
    fetch: tokenFetch,
    data: tokenData,
    error: tokenError,
    isLoading: tokenIsLoading,
  } = useMoralisWeb3ApiCall(Web3Api.account.getTokenBalances, {
    chain: "rinkeby",
  });

  const {
    fetch: nftFetch,
    data: nftData,
    error: nftError,
    isLoading: nftLoading,
  } = useMoralisWeb3ApiCall(Web3Api.account.getNFTs, {
    chain: "rinkeby",
  });
  //----------------- Setting User in state   ----------
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    //call API every 5 seconds
    const interval = setInterval(() => {
      if (user) {
        setUserState(user);
        fetch();
        tokenFetch();
        nftFetch();
      }
    }, 5000);
    //clear the interval
    return () => clearInterval(interval);
  }, [user]);

  // ----- Authenticate in Metamask---------
  if (!isAuthenticated) {
    return (
      <Container maxW="container.lg">
        <Center>
          <img width={500} height={500} src={logo} alt="logo" />
        </Center>
        <br />
        <Center>
          <Heading as="h2" size="3xl" p={10}>
            Avalanche Wallet Tracker
          </Heading>
        </Center>
        <Center>
          <Button colorScheme="green" size="lg" onClick={() => authenticate()}>
            Sign in using Metamask
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <Box display={"block"} p={35} className="App">
      <LogoutButton />
      <Center>
        <img width={500} height={500} src={logo} alt="logo" />
      </Center>

      <Center>
        <Heading as="h2" size="3xl" p={10}>
          Avalanche Wallet Tracker
        </Heading>
      </Center>
      {/* ------  Native Balance -------- */}
      {!isLoading && data !== null ? (
        <Stack direction={["column", "row"]} spacing="24px">
          <Text fontSize="2xl" style={{ padding: "10px", textAlign: "initial", fontWeight: "bold" }}>
            AVAX/ETH Balance : {data.balance / ("1e" + 18)}
          </Text>
          <Button style={{ display: "block" }} colorScheme="green" variant="outline" onClick={() => fetch()} disabled={isLoading}>
            Refetch Native balance
          </Button>
        </Stack>
      ) : (
        <p>Loading</p>
      )}

      {/* -------------Tokens------------ */}

      <Text fontSize="3xl" style={{ textAlign: "initial", fontWeight: "bold" }}>
        Wallet Tokens
      </Text>
      <Button colorScheme="green" variant="outline" onClick={() => tokenFetch()} disabled={tokenIsLoading}>
        Refetch Tokens
      </Button>
      {!tokenIsLoading && tokenData !== null ? displayTokenBalancesTable(tokenData) : <p>Loading</p>}
      <Divider />
      {/* -------------NFTs------------ */}
      <Text fontSize="3xl" style={{ textAlign: "initial", fontWeight: "bold" }}>
        Wallet NFTs
      </Text>
      <Button colorScheme="green" variant="outline" onClick={() => nftFetch()} disabled={nftLoading}>
        Refetch NFTs
      </Button>
      {!nftLoading && nftData !== null ? displayNFTBalancesTable(nftData) : <p>Loading</p>}
    </Box>
  );
}

export default App;
