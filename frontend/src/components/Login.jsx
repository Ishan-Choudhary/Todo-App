import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link as ChakraLink,
    Button,
    Heading,
    Text,
    Alert,
    AlertIcon,
    AlertTitle,

  } from '@chakra-ui/react';


  import {Link as ReactRouterLink} from "react-router-dom";
  import { useState } from 'react';
  
  export default function Login({loggedInFn}) {    

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    async function handleSubmti() {
      setLoading(true);
      const createRequest = {
        "password": password,
        "username": username
      }

      const tokenReq = await fetch("http://127.0.0.1:8000/auth/token/login/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(createRequest)
      })

      if(!tokenReq.ok)  {
        const errorData = await tokenReq.json()
        setError(errorData[Object.keys(errorData)[0]]);
        setLoading(false);
      }
      else  {
        const res = await tokenReq.json()
        const token = res["auth_token"];
        console.log(token);
        sessionStorage.setItem("auth_token", token);
        
        loggedInFn(true);
      }
      setLoading(false);

    }

    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool <ChakraLink color={'blue.400'}>features</ChakraLink> ✌️
            </Text>
          </Stack>
          {
            error ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            ) : <></>
          }
          <Box
            rounded={'lg'}
            bg={'white'}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" onChange={handleUsernameChange}/>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" onChange={handlePasswordChange}/>
              </FormControl>
              <Stack spacing={10}>
                
                <Button
                  isLoading={loading}
                  loadingText={"Signing in"}
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  onClick={handleSubmti}
                  >
                  Sign in
                </Button>
                <Stack pt={6}>
                <Text align={'center'}>
                  New user? <ChakraLink color={'blue.400'} as={ReactRouterLink} to="/signup">Sign up here</ChakraLink>
                </Text>
              </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }