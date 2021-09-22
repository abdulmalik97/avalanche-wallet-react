import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import { useMoralis, MoralisProvider, useMoralisWeb3ApiCall, useMoralisWeb3Api } from "react-moralis";
import { Button, ButtonGroup, Box, Wrap } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption } from "@chakra-ui/react";

const LogoutButton = () => {
  const { logout, isAuthenticating } = useMoralis();

  return (
    <Button colorScheme="red" variant="solid" isLoading={isAuthenticating} onClick={() => logout()} disabled={isAuthenticating}>
      Logout
    </Button>
    // <button onClick={() => logout()} disabled={isAuthenticating}>
    //   Authenticate
    // </button>
  );
};

const displayTokenBalancesTable = (tokenData) => {
  return (
    <div>
      <Table variant="simple">
        <TableCaption>Avalanche Wallet Assets</TableCaption>
        <Thead>
          <Tr>
            <Th>Token Name</Th>
            <Th>Balance</Th>
            <Th>Symbol</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tokenData.map((element) => {
            return (
              <React.Fragment>
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
        <TableCaption> NFT Assets</TableCaption>
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
          {NFTData.result.map((element) => {
            return (
              <React.Fragment>
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
    chain: "eth",
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
      <div>
        <button onClick={() => authenticate()}>Authenticate</button>
      </div>
    );
  }

  // useEffect(() => {
  //   // document.title = `You clicked ${count} times`;
  // }, [tokenData]); // Only re-run the effect if count changes

  const tokenDataResult = {};

  return (
    <Box className="App" d="flex" alignItems="center">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <h1>Welcome {user.get("username")}</h1>
          <LogoutButton />
        </p>
        {!isLoading && data !== null ? (
          <div>
            <Button
              colorScheme="green"
              variant="outline"
              // isLoading={isAuthenticating}
              onClick={() => fetch()}
              disabled={isLoading}
            >
              Refetch Native balance
            </Button>

            <pre>AVAX BALANCE : {JSON.stringify(data.balance, null, 2)}</pre>
          </div>
        ) : (
          <p>Loading</p>
        )}
        {/* -------------Tokens------------ */}
        <Button colorScheme="green" variant="outline" onClick={() => fetch()} disabled={tokenIsLoading}>
          Refetch Tokens
        </Button>
        {!tokenIsLoading && tokenData !== null ? displayTokenBalancesTable(tokenData) : <p>Loading</p>}
        {/* -------------NFT------------ */}
        <Button colorScheme="green" variant="outline" onClick={() => nftfetch()} disabled={nftLoading}>
          Refetch NFTs
        </Button>
        {!nftLoading && nftData !== null ? displayNFTBalancesTable(nftData) : <p>Loading</p>}

        <div>
          <a></a>
        </div>
      </header>
    </Box>
  );
}

export default App;
