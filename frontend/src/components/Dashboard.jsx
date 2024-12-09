import {
  Container,
  Heading,
  Text,
  Tag,
  VStack,
  Flex,
  Spacer,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Box,
} from '@chakra-ui/react';
import { React, useEffect, useState } from 'react'

const Dashboard = ({ loggedInFn }) => {

  const [userDetails, setUserDetails] = useState({});
  const [addLoadingIndicator, setAddLoadingIndicator] = useState(false);
  const [logoutLoadingIndicator, setLogoutLoadingIndicator] = useState(false);
  const [hoverID, setHoverID] = useState(null);
  const addModal = useDisclosure()
  const editModal = useDisclosure()

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todoItems, setTodoItems] = useState([]);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editLoadingIndicator, setEditLoadingIndicator] = useState(false);

  useEffect(() => {
    async function fetchData() {

      const urls = [fetch("http://localhost:8000/auth/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${sessionStorage.getItem("auth_token")}`
        }
      }), fetch("http://localhost:8000/api/todos/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${sessionStorage.getItem("auth_token")}`
        }
      })]

      const req = await Promise.all(urls)
      const [userDetailsValues, userTodosValues] = req



      const userDetailsRes = await userDetailsValues.json()
      const userTodosRes = await userTodosValues.json()

      setUserDetails(userDetailsRes);
      setTodoItems(userTodosRes);

      console.log(userTodosRes);

    }

    fetchData();

    return () => { }

  }, [])


  async function handleFormSubmition() {
    setAddLoadingIndicator(true)
    const reqBody = {
      "title": title,
      "description": description,
    }

    const request = await fetch("http://localhost:8000/api/todos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${sessionStorage.getItem("auth_token")}`
      },
      body: JSON.stringify(reqBody)
    })

    if (!request.ok) {
      const errorData = await request.json();
      console.log("Error Creating User: ", errorData)
      setAddLoadingIndicator(false);

    }
    else {
      const response = await request.json();
      setTodoItems((todoItems) => todoItems.concat([...[response]]))
    }

    setAddLoadingIndicator(false);
    addModal.onClose();
  }

  async function handleLogout() {
    setLogoutLoadingIndicator(true);
    const request = await fetch("http://localhost:8000/auth/token/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${sessionStorage.getItem("auth_token")}`
      }
    })

    if (!request.ok) {
      const errorData = await request.json();
      console.log("Error logging out: ", errorData);
      setLogoutLoadingIndicator(false);
    }
    else {
      sessionStorage.removeItem("auth_token");
      console.log("Logged out successfully")
      setLogoutLoadingIndicator(false);
      loggedInFn(false);
    }
  }


  const handleTaskChange = async (curr) => {

    setTodoItems(() => todoItems.map((val, i) => {
      if (val.title === curr.title) {
        return { ...val, status: !val.status }
      }
      return val
    }))

    const requestBody = {
      "title": curr.title,
      "description": curr.description,
      "status": !curr.status,
    }

    const request = await fetch(`http://localhost:8000/api/todos/${curr.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Token ${sessionStorage.getItem("auth_token")}`
      },
      body: JSON.stringify(requestBody),
    })

    if (!request.ok) {
      const errorData = await request.json();
      console.log("Error changing task: ", errorData);
    }
  }

  const deleteTask = async (curr) => {

    setTodoItems(() => todoItems.filter((item, i) => item.id !== curr.id))


    const request = await fetch(`http://localhost:8000/api/todos/${curr.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authorization": `TOKEN ${sessionStorage.getItem("auth_token")}`
      }
    })

    if (!request.ok) {
      const errorData = await request.json();
      console.log("The error is ", errorData);
    }

  }

  const handleEditFormSubmission = async () => {
    setEditLoadingIndicator(true);
    const requestBody = {
      "title": editTitle,
      "description": editDescription,
      "status": todoItems.find(item => item.id === editId).status, // Retain the current status
    }

    const request = await fetch(`http://localhost:8000/api/todos/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${sessionStorage.getItem("auth_token")}`
      },
      body: JSON.stringify(requestBody),
    })

    if (!request.ok) {
      const errorData = await request.json();
      console.log("Error updating task: ", errorData);
      setEditLoadingIndicator(false);
    } else {
      const updatedTask = await request.json();
      setTodoItems((todoItems) => todoItems.map(item => item.id === editId ? updatedTask : item));
      setEditLoadingIndicator(false);
      editModal.onClose();
    }
  }

  const openEditModal = (task) => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditId(task.id);
    editModal.onOpen();
  }



  return (
    <Container height={"40px"}>
      <VStack alignItems="flex-start" spacing={3}>
        <Flex color="black" width={"100%"} alignItems={"center"}>
          <Box>
            <Heading>Hello {userDetails.username}</Heading>
            <Text>Lets get some work done ✏️</Text>
          </Box>
          <Spacer />
          <Button colorScheme='red' loadingText="Logging out" isLoading={logoutLoadingIndicator} onClick={handleLogout}>Logout</Button>
        </Flex>
        <Flex color="white" width={"100%"} mt={"10"}>
          <Tag size="lg" colorScheme="blue">TODO</Tag>
          <Spacer /> 
          <Button colorScheme="blue" onClick={addModal.onOpen}>+</Button>
          <Modal onClose={addModal.onClose} isOpen={addModal.isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add a task!</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl id="title" isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input type='text' onChange={(e) => setTitle(e.target.value)} />
                </FormControl>
                <FormControl id="Description">
                  <FormLabel>Description: </FormLabel>
                  <Textarea size="sm" placeholder='What is the task about' onChange={(e) => { setDescription(e.target.value) }} />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='teal' onClick={handleFormSubmition} isLoading={addLoadingIndicator} loadingText={"Adding"}>
                  Add
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
        {
          todoItems?.map(
            (curr, i) => {
              if(curr.status === false) {
                return (
                  <Flex key={curr.id} width="100%"
                    onMouseEnter={
                      () => setHoverID(curr.id)
                    }
                    onMouseLeave={
                      () => setHoverID(null)
                    }
                  >
                    <Checkbox
                      onChange={
                        () => handleTaskChange(curr)
                      }
                    >
                      {curr.title}
                    </Checkbox>
                    <Spacer />
                    <Box display={hoverID === curr.id ? "inline-block" : "none"}>
                      <Button
                        colorScheme='gray'
                        mr="3"
                        onClick={() => openEditModal(curr)}
                      >✎</Button>
                      <Button
                        colorScheme='yellow'
                        onClick={
                          () => deleteTask(curr)
                        }
                      >🗑</Button>
                    </Box>
                  </Flex>
                  
                )
              }
            }
          )
        }
        <Flex color="white" width={"100%"} mt={5}>
          <Tag size="lg" colorScheme="green">COMPLETED</Tag>
        </Flex>
        {todoItems?.map((curr, i) => {
          if (curr.status === true) {
            return (
              <Flex key={curr.id} width="100%"
                    onMouseEnter={
                      () => setHoverID(curr.id)
                    }
                    onMouseLeave={
                      () => setHoverID(null)
                    }
              >
                <Checkbox key={curr.title} onChange={() => handleTaskChange(curr)} isChecked>
                  <Text as="s">{curr.title}</Text>
                </Checkbox>
                <Spacer />
                <Button
                  colorScheme='yellow'
                  onClick={
                    () => deleteTask(curr)
                  }
                  display={hoverID === curr.id ? "inline-block" : "none"}
                >🗑</Button>
              </Flex>
              
            )
          }
        })}
      </VStack>
      <Modal onClose={editModal.onClose} isOpen={editModal.isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit this task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="editTitle" isRequired>
              <FormLabel>Title</FormLabel>
              <Input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </FormControl>
            <FormControl id="editDescription">
              <FormLabel>Description</FormLabel>
              <Textarea size="sm" placeholder='What is this task about' value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='gray' onClick={handleEditFormSubmission} isLoading={editLoadingIndicator} loadingText={"Editing"}>
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


    </Container>
  )
}

export default Dashboard;