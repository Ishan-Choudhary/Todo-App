import React from 'react'

const TaskModal = ({disclosure, icon, title, description}) => {
  return (
    <div>
        <Button colorScheme="blue" onClick={disclosure.onOpen}>{icon}</Button>
        <Modal onClose={disclosure.onClose} isOpen={disclosure.isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add a task!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <FormControl id="title" isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input type='text' onChange={(e) => setTitle(e.target.value)}/>
                </FormControl>
                <FormControl id="Description">
                    <FormLabel>Description: </FormLabel>
                    <Textarea size="sm" placeholder='What is the task about' onChange={(e) => {setDescription(e.target.value)}} />
                </FormControl>
                </ModalBody>
                <ModalFooter>
                <Button colorScheme='teal' onClick={handleFormSubmition} isLoading={addLoadingIndicator} loadingText={"Adding"}>
                    Add
                </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
  )
}

export default TaskModal;