import logo from "./avalancheLogo.jpg";
import React, { useState, useEffect } from "react";
import "./App.css";
import { useMoralis, useMoralisWeb3ApiCall, useMoralisWeb3Api, useMoralisQuery, useMoralisCloudFunction } from "react-moralis";
import { Button, ButtonGroup, Box, Wrap, Text, Heading, Divider, Stack, Alert, AlertIcon } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Container, Center } from "@chakra-ui/react";

const chain = "avalanche";

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
  const { authenticate, isAuthenticated, user, Moralis } = useMoralis();

  const Web3Api = useMoralisWeb3Api();
  //------ Moralis Web3 API methods for Native, ERC20 & NFT  ---------
  const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(Web3Api.account.getNativeBalance, {
    chain: chain,
  });
  const {
    fetch: tokenFetch,
    data: tokenData,
    error: tokenError,
    isLoading: tokenIsLoading,
  } = useMoralisWeb3ApiCall(Web3Api.account.getTokenBalances, {
    chain: chain,
  });

  const {
    fetch: nftFetch,
    data: nftData,
    error: nftError,
    isLoading: nftLoading,
  } = useMoralisWeb3ApiCall(Web3Api.account.getNFTs, {
    chain: chain,
  });
  //----------------- Setting User in state   ----------
  const [userState, setUserState] = useState(null);
  const [openModel, setOpenModel] = useState(false);

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
    console.log(user, "USER");
    return () => clearInterval(interval);
  }, [user]);

  //if chain is changed let the user know
  Moralis.onChainChanged(async function (chain) {
    if (chain !== "0xa86a") {
      setOpenModel(true);
    } else {
      setOpenModel(false);
    }
  });

  // ----- Authenticate in Metamask---------
  if (!isAuthenticated) {
    return (
      <Container maxW="container.lg">
        {openModel && (
          <Alert status="error">
            <AlertIcon />
            Please switch to Avalanche Network
          </Alert>
        )}
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
      {openModel && (
        <Alert status="error">
          <AlertIcon />
          Please switch to Avalanche Network
        </Alert>
      )}
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

//https://docs.moralis.io/moralis-server/automatic-transaction-sync/historical-transactions#watch-address-from-code
// MAke sure your address is lowercase whilequerying or calling cloud
// const {
//   fetch: fetchCloudFunction,
//   data: dataFromCloudFunction,
//   error: e,
//   isLoading: isLoadingResponse,
// } = useMoralisCloudFunction("watchAvaxAddress", {
//   address: "0x3d2336e5dc92ae517f295e3fa306bd7bf50c6e3d",
//   sync_historical: true,
// });
//https://github.com/MoralisWeb3/react-moralis#realtime--live-queries
// const {
//   fetch: fetchAvaxTransactions,
//   data: dataAvaxTransactions,
//   error: e,
//   isLoading: isLoadingTransactions,
// } = useMoralisQuery("AvaxTransactions", (query) => query.equalTo("from_address", "0x3d2336e5dc92ae517f295e3fa306bd7bf50c6e3d"), [], {
//   live: true,
// });
// console.log(dataAvaxTransactions, "Transactions updating in real time");
