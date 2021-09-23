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
          {tokenData.map((element, i) => {
            return (
              <React.Fragment key={i}>
                <Tr>
                  <Td>{element.name}</Td>
                  <Td>{element.balance / ("1e" + element.decimals)}</Td>
                  <Td>{element.symbol}</Td>
                </Tr>
              </React.Fragment>
            );
          })}
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

            {/* <Th>Symbol</Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {NFTData.result.map((element, i) => {
            return (
              <React.Fragment key={i}>
                <Wrap>
                  <Tr>
                    <Td>{element.name}</Td>
                    <Td>
                      <Wrap>{element.token_address}</Wrap>
                    </Td>
                    <Td>
                      <Wrap>{element.token_id}</Wrap>
                    </Td>
                    <Td>{element.contract_type}</Td>
                  </Tr>
                </Wrap>
              </React.Fragment>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

function App() {
  const { authenticate, isAuthenticated, user } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(Web3Api.account.getNativeBalance, {
    chain: "avalanche",
  });
  const {
    fetch: tokenFetch,
    data: tokenData,
    error: tokenError,
    isLoading: tokenIsLoading,
  } = useMoralisWeb3ApiCall(Web3Api.account.getTokenBalances, {
    chain: "avalanche",
  });

  const {
    fetch: nftFetch,
    data: nftData,
    error: nftError,
    isLoading: nftLoading,
  } = useMoralisWeb3ApiCall(Web3Api.account.getNFTs, {
    chain: "avalanche",
  });

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
      {/* <header className="App-header"> */}
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <LogoutButton />
      <Center>
        <img width={500} height={500} src={logo} alt="logo" />
      </Center>

      <Center>
        <Heading as="h2" size="3xl" p={10}>
          Avalanche Wallet Tracker
        </Heading>
      </Center>
      {!isLoading && data !== null ? (
        <Stack direction={["column", "row"]} spacing="24px">
          <Text fontSize="2xl" style={{ padding: "10px", textAlign: "initial", fontWeight: "bold" }}>
            AVAX Balance : {data.balance / ("1e" + 18)}
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
      <Button colorScheme="green" variant="outline" onClick={() => fetch()} disabled={tokenIsLoading}>
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
