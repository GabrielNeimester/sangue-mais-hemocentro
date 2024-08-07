import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../hooks/queries/data/useData'
import { Data } from '../../interfaces/data'
import { Button, FormControl, FormErrorMessage, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Stack, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import styles from '../calendario/Calendario.module.css'
import { MdDeleteOutline, MdOutlineEdit, MdCalendarMonth } from "react-icons/md"
import Erro from '../../components/Erro'
import { useDeleteData, useSalvarData } from '../../hooks/mutations/data/mutationData'

export default function Calendario() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const { data, isLoading, isError, refetch } = useData()
    const [novaData, setNovaData] = useState('')
    const [error, setError] = useState('')

    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [mensagemSucesso, setMensagemSucesso] = useState('')


    const mutate = useSalvarData()

    const  mutateDelete = useDeleteData()

    const handleSave = async () => {
        if (!novaData) {
            setError('Por favor informe uma data');
            return
        }
        try {
            mutate.mutateAsync({ data: novaData })
            onClose()
            setMensagemSucesso("A nova data foi salva com sucesso.")
            setShowSuccessModal(true)

        } catch (error) {
            onClose()
            setMensagemErro("Ocorreu um erro ao tentar salvar a nova data. Por favor, tente novamente mais tarde.")
            setShowErrorModal(true)
        }
    }

    const handleClose = () => {
        setError('')
        onClose()
    }

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false)
        refetch()
    };

    const handleErrorModalClose = () => {
        setShowErrorModal(false)
        refetch()
    }

    const handleDeleteData = async (id: string) => {
        try {
            await mutateDelete.mutateAsync(id)
            onClose()
            setMensagemSucesso("Data foi deletada com sucesso")
            setShowSuccessModal(true)

        } catch (error) {
            onClose()
            setMensagemErro("Ocorreu um erro ao deletar a data. Por favor, tente novamente mais tarde.")
            setShowErrorModal(true)
            
        }
      }


    return (
        <Layout>
            <Heading as='h3' size='lg' className={styles.titulo}>Gerir Calendário</Heading>
            <div>
                {isLoading && (
                    <Stack className={styles.skeleton}>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </Stack>
                )}

                {isError && (
                    <Erro></Erro>
                )}
                {!isLoading && !isError && data && (
                    <div className={styles.card_container}>
                        {data.map((data: Data) => (
                            <div key={data._id} className={styles.card}>
                                <div className={styles.card_content}>
                                    <MdCalendarMonth color='E31515' size={'48px'} />
                                    <div className={styles.agendamento}>
                                        <Heading as='h5' size='sm'>Agendamento</Heading>
                                        <p>{data.data}</p>
                                    </div>
                                </div>
                                <div>

                                    <IconButton icon={<MdDeleteOutline size={'24px'} />} className={styles.icon_button} aria-label='Deletar' onClick={() => { handleDeleteData(data._id) }}/>
                                    <Link to={`/calendario/${data._id}`}>
                                    <IconButton icon={<MdOutlineEdit size={'24px'} />} className={styles.icon_button} aria-label='Editar' />
                                    </Link>
                                </div>
                            </div>
                        ))}
                        <Button onClick={onOpen} className={styles.botao_adicionar}>Adicionar nova Data</Button>
                    </div>
                )}
            </div>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicionar nova Data</ModalHeader>
                    <ModalCloseButton onClick={handleClose} />
                    <ModalBody >
                        <FormControl isInvalid={!!error}>
                            <Input placeholder='Selecione uma data' size='md' type='date' onChange={(e) => setNovaData(e.target.value)}
                                required></Input>
                            {error && <FormErrorMessage>{error}</FormErrorMessage>}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSave}>
                            Salvar
                        </Button>
                        <Button onClick={handleClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={showSuccessModal} onClose={handleSuccessModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sucesso!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                       {mensagemSucesso}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSuccessModalClose}>
                            Continuar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={showErrorModal} onClose={handleErrorModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Erro</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                       {mensagemErro}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={handleErrorModalClose}>
                            Continuar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Layout>
    )
}
