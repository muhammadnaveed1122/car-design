import { ActionIcon, Box, Button, Container, FileInput, Flex, Group, Image, Modal, Stack, Text, Title } from '@mantine/core'
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconImageInPicture, IconInfoCircle, IconPhoto, IconTrash } from '@tabler/icons-react'
import React, { useRef, useState } from 'react'
import ImageGallery from "react-image-gallery";
import { DropzoneButton } from '../CarManage/DropzoneButton';
import { userService, userCarService } from "@/services";
import { toastShow } from "@/helpers";
const AddImages = ({ dark, carData }, props) => {
    console.log("🚀 ~ AddImages ~ carData:", carData)
    const [openedExterior, { open: openExteriorModal, close: closeExteriorModal }] = useDisclosure(false);
    const [openedInterior, { open: openInteriorModal, close: closeInteriorModal }] = useDisclosure(false);
    const [openedEngine, { open: openEngineModal, close: closeEngineModal }] = useDisclosure(false);
    const [imageLoader, setImageLoader] = useState(false)
    const [fileExteriorImages, setFileExteriorImages] = useState([]);
    const [fileInteriorImages, setFileInteriorImages] = useState([]);
    const [fileEngineImages, setFileEngineImages] = useState([]);
    const [deleteEngine, setDeleteEngine] = useState(false)
    const [deleteExterior, setDeleteExterior] = useState(false)
    const [deleteInterior, setDeleteInterior] = useState(false)

    const isUpdating = props.hasOwnProperty("id");
    const intriorGallery = useRef(null);
    const extriorGallery = useRef(null);
    const engineGallery = useRef(null);

    const initialValues = {
        Extriorfiles: [],
        Intriorfiles: [],
        Enginefiles: [],
        interiorImages: carData?.interiorImages?.length > 0 ? JSON.parse(carData.interiorImages) : [],
        exteriorImages: carData?.exteriorImages?.length > 0 ? JSON.parse(carData.exteriorImages) : [],
        engineImages: carData?.engineImages?.length > 0 ? JSON.parse(carData.engineImages) : [],
        id: carData?.id ?? "",
        year: carData?.year ? carData.year.toString() : "",
        make: carData?.make ?? "",
        model: carData?.model ?? "",
        vin: carData?.vin ?? "",
        lot: carData?.lot ?? "",
        color: carData?.color ?? "",
        price: carData?.price ?? "",
        mileage: carData?.mileage ?? "",
        doors: carData?.doors ?? "",
        seats: carData?.seats ?? "",
        transmission: carData?.transmission ?? "",
        driveSide: carData?.driveSide ?? "",
        vehicleType: carData?.vehicleType ?? "",
        specs: carData?.specs ?? "",
        engine: carData?.engine ?? "",
        referal: carData?.referal ?? "",
        status: carData?.status ?? "",
        bidPrice: carData?.bidPrice ?? "",
        bidDeadline: carData?.bidDeadline ? new Date(carData?.bidDeadline) : null,
        pdf: carData?.pdf ?? "",
        initialBidPrice: carData?.initialBidPrice ?? "",
        companyName: carData?.companyName ?? "",
        companyImage: carData?.companyImage ? carData?.companyImage : "",
        bodyStyle: carData?.bodyStyle ?? "",
        fuelType: carData?.fuelType ?? "",
        driveType: carData?.driveType ?? "",
        bodyStyle: carData?.bodyStyle ?? "",
        cylinders: carData?.cylinders ?? "",
        slug: carData?.slug ?? "",
        purchaseSteps: carData?.purchaseSteps ?? "",
        winBox: carData?.winBox ?? "",
        location: carData?.location ?? "",
        isPending: carData?.isPending ?? "",
    };
    const form = useForm({
        initialValues: initialValues,
    });
    console.log(form.values?.interiorImages, "form.values?.interiorImages ")
    const urlInteriorImages = Array.isArray(form.values?.interiorImages)
        ? form.values.interiorImages.map((image) => ({
            original: image,
            thumbnail: image,
        }))
        : [];
    const urlExteriorImages = Array.isArray(form.values?.exteriorImages)
        ? form.values.exteriorImages.map((image) => ({
            original: image,
            thumbnail: image,
        }))
        : [];
    const urlEngineImages = Array.isArray(form.values?.engineImages)
        ? form.values.engineImages.map((image) => ({
            original: image,
            thumbnail: image,
        }))
        : [];
    let carInteriorImages = [...urlInteriorImages, ...fileInteriorImages];
    if (carInteriorImages?.length === 0)
        carInteriorImages = [
            {
                original: "https://placehold.co/640x480?text=NoImage",
                thumbnail: "https://placehold.co/320x240?text=NoImage",
            },
        ];
    let carEngineImages = [...urlEngineImages, ...fileEngineImages];
    if (carEngineImages?.length === 0)
        carEngineImages = [
            {
                original: "https://placehold.co/640x480?text=NoImage",
                thumbnail: "https://placehold.co/320x240?text=NoImage",
            },
        ];
    let carExtriorImages = [...urlExteriorImages, ...fileExteriorImages];
    if (carExtriorImages?.length === 0)
        carExtriorImages = [
            {
                original: "https://placehold.co/640x480?text=NoImage",
                thumbnail: "https://placehold.co/320x240?text=NoImage",
            },
        ];

    // const handleDeleteInteriorImages = (e) => {
    //     const index = intriorGallery.current.getCurrentIndex();

    //     if (index >= form.values.interiorImages?.length) {
    //         form.setFieldValue(
    //             "Intriorfiles",
    //             form?.values.Intriorfiles?.filter(
    //                 (_, i) => i !== index - form.values.interiorImages?.length
    //             )
    //         );
    //         setFileInteriorImages((prevState) =>
    //             prevState.filter((_, i) => i !== index)
    //         );
    //     } else {
    //         // Remove from the original images
    //         form.setFieldValue(
    //             "interiorImages",
    //             form.values.interiorImages?.filter((_, i) => i !== index)
    //         );
    //     }
    // };
    const handleDeleteInteriorImages = () => {
        const index = intriorGallery.current.getCurrentIndex();
        if (index < form.values.interiorImages?.length) {
            form.setFieldValue(
                "interiorImages",
                form.values.interiorImages?.filter((_, i) => i !== index)
            );
            setDeleteInterior(true)
        } else {
            const newFileIndex = index - form.values.interiorImages.length;
            form.setFieldValue(
                "Intriorfiles",
                form.values.Intriorfiles.filter((_, i) => i !== newFileIndex)
            );
            setFileInteriorImages((prevState) =>
                prevState.filter((_, i) => i !== newFileIndex)
            );
        }
    };
    // const handleDeleteEngineImages = (e) => {
    //     const index = engineGallery.current.getCurrentIndex();

    //     if (index >= form.values.engineImages?.length) {
    //         form.setFieldValue(
    //             "Enginefiles",
    //             form?.values.engineGallery?.filter(
    //                 (_, i) => i !== index - form.values.engineImages?.length
    //             )
    //         );
    //         setFileEngineImages((prevState) =>
    //             prevState.filter((_, i) => i !== index)
    //         );
    //     } else {
    //         // Remove from the original images
    //         form.setFieldValue(
    //             "engineImages",
    //             form.values.engineImages?.filter((_, i) => i !== index)
    //         );
    //     }
    // };
    const handleDeleteEngineImages = () => {
        const index = engineGallery.current.getCurrentIndex();
        if (index < form.values.engineImages?.length) {
            console.log("this is delete call")
            form.setFieldValue(
                "engineImages",
                form.values.engineImages?.filter((_, i) => i !== index)
            );
            setDeleteEngine(true);
        } else {
            const newFileIndex = index - form.values.engineImages.length;
            form.setFieldValue(
                "Enginefiles",
                form.values.Enginefiles.filter((_, i) => i !== newFileIndex)
            );
            setFileEngineImages((prevState) =>
                prevState.filter((_, i) => i !== newFileIndex)
            );
        }
    };
    const handleDeleteExteriorImages = () => {
        const index = extriorGallery.current.getCurrentIndex();
        if (index < form.values.exteriorImages?.length) {
            form.setFieldValue(
                "exteriorImages",
                form.values.exteriorImages?.filter((_, i) => i !== index)
            );
            setDeleteExterior(true)
        } else {
            const newFileIndex = index - form.values.exteriorImages.length;
            form.setFieldValue(
                "Extriorfiles",
                form.values.Extriorfiles.filter((_, i) => i !== newFileIndex)
            );
            setFileExteriorImages((prevState) =>
                prevState.filter((_, i) => i !== newFileIndex)
            );
        }
    };

    const updateExteriorImage = async () => {
        setImageLoader(true);

        const formValues = form.values
        if (formValues.Extriorfiles.length == 0 && !deleteExterior) {
            toastShow("Please add images first", "error");
            setImageLoader(false);
            return false;
        }
        const formData = new FormData();
        if (formValues.Extriorfiles.length > 0) {
            for (let i = 0; i < formValues.Extriorfiles.length; ++i) {
                formData.append("exteriorImages", formValues.Extriorfiles[i]);
            }
        }
        for (const key in formValues) {
            if (key !== "files" && formValues[key] != null) {
                if (key === "exteriorImages") {
                    formData.append(key, JSON.stringify(formValues[key]));
                } else if (key === "id") {
                    formData.append(key, formValues[key]);
                }

            }
        }

        const updateCar = await userCarService.update(formValues.id, formData);
        if (updateCar) {
            form.setValues(updateCar);
            toastShow("Please wait for admin approval");
            setImageLoader(false);
            closeExteriorModal();
        } else {
            setImageLoader(false);

        }
    }
    const updateEngineImage = async () => {
        setImageLoader(true);
        const formValues = form.values
        console.log("formValues.Enginefiles", formValues.Enginefiles)
        if (formValues.Enginefiles.length == 0 && !deleteEngine) {
            toastShow("Please add images first", "error");
            setImageLoader(false);
            return false;
        }
        const formData = new FormData();
        if (formValues.Enginefiles.length > 0) {
            for (let i = 0; i < formValues.Enginefiles.length; ++i) {
                formData.append("engineImages", formValues.Enginefiles[i]);
            }
        }
        for (const key in formValues) {
            if (key !== "files" && formValues[key] != null) {
                if (key === "engineImages") {
                    formData.append(key, JSON.stringify(formValues[key]));
                } else if (key === "id") {
                    formData.append(key, formValues[key]);
                }
            }
        }
        const updateCar = await userCarService.update(formValues.id, formData);
        if (updateCar) {
            form.setValues(updateCar);
            toastShow("Please wait for admin approval");
            setImageLoader(false);
            closeEngineModal();
        } else {
            setImageLoader(false);

        }
    }
    const updateInteriorImage = async () => {

        setImageLoader(true);
        const formValues = form.values
        if (formValues.Intriorfiles.length == 0 && !deleteInterior) {
            toastShow("Please add images first", "error");
            setImageLoader(false);
            return false;
        }
        const formData = new FormData();
        if (formValues.Intriorfiles.length > 0) {
            for (let i = 0; i < formValues.Intriorfiles.length; ++i) {
                formData.append("interiorImages", formValues.Intriorfiles[i]);
            }
        }
        for (const key in formValues) {
            if (key !== "files" && formValues[key] != null) {
                if (key === "interiorImages") {
                    formData.append(key, JSON.stringify(formValues[key]));
                } else if (key === "id") {
                    formData.append(key, formValues[key]);
                }
            }
        }
        const updateCar = await userCarService.update(formValues.id, formData);
        if (updateCar) {
            form.setValues(updateCar);
            toastShow("Please wait for admin approval");
            setImageLoader(false);
            closeInteriorModal();
        }
    }
    const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
    return (
        <>
            <Modal opened={openedExterior} onClose={closeExteriorModal} centered radius={25} title='Exterior Images'>
                <Modal.Body p={'30 15 20'}>
                    <Stack gap={20} mb={30}>
                        <ActionIcon
                            color={"red"}
                            onClick={handleDeleteExteriorImages}
                            title="Delete current Image"
                            style={{
                                top: "80px",
                                marginTop: "-60px",
                                left: "20px",
                                zIndex: 100,
                            }}
                        >
                            <IconTrash size={18} stroke={2.5} />
                        </ActionIcon>
                        <ImageGallery
                            items={carExtriorImages}
                            ref={extriorGallery}
                            showNav={false}
                        />
                        <Group gap={10} justify='center' pos='relative'>
                            <IconPhoto color='#3CDFCD' size={30} />
                            <Text c='fff' fz={24} style={{ textDecoration: 'underline' }}>
                                Upload image
                            </Text>
                            <FileInput variant="unstyled" accept="image/png,image/jpeg,image/jpg" className='custom-file-input' pos='absolute' top={0} left={'23%'} w={'200px'} h={'100%'} multiple
                                onChange={(files) => {
                                    const validFiles = files?.filter(file => allowedExtensions.includes(file.type));
                                    if (validFiles?.length) {
                                        const fileImgs = validFiles.map((file) => {
                                            const imageUrl = URL.createObjectURL(file);
                                            return {
                                                original: imageUrl,
                                                thumbnail: imageUrl,
                                            };
                                        });

                                        setFileExteriorImages(fileImgs);
                                        form.setFieldValue("Extriorfiles", validFiles);
                                    } else {
                                        toastShow("Only image files are allowed", "error")
                                    }
                                }}
                            />
                        </Group>
                    </Stack>
                    <Flex gap={10} bg={dark ? '#2E2E2E' : '#dbd8d8'} c={dark ? '#fff' : '#06070A'} p={'sm'} bd='1px solid #707070' style={{ borderRadius: '6px' }}>
                        <IconInfoCircle size={20} />
                        <Text>Buyers expect to see 20 images on an advert</Text>
                    </Flex>
                    <Button radius={'xl'} size='md' c={'#000'} loading={imageLoader} fullWidth mt={'lg'} onClick={updateExteriorImage}>Save</Button>
                </Modal.Body>
            </Modal>
            <Modal opened={openedInterior} onClose={closeInteriorModal} centered radius={25} title='Interior Images'>
                <Modal.Body p={'30 15 20'}>
                    <Stack gap={20} mb={30}>
                        <ActionIcon
                            color={"red"}
                            onClick={handleDeleteInteriorImages}
                            title="Delete current Image"
                            style={{
                                top: "80px",
                                marginTop: "-60px",
                                left: "20px",
                                zIndex: 100,
                            }}
                        >
                            <IconTrash size={18} stroke={2.5} />
                        </ActionIcon>
                        <ImageGallery
                            items={carInteriorImages}
                            ref={intriorGallery}
                            showNav={false}
                        />
                        <Group gap={10} justify='center' pos='relative'>
                            <IconPhoto color='#3CDFCD' size={30} />
                            <Text c='fff' fz={24} style={{ textDecoration: 'underline' }}>
                                Upload image
                            </Text>
                            <FileInput variant="unstyled" accept="image/png,image/jpeg,image/jpg" className='custom-file-input' pos='absolute' top={0} left={'23%'} w={'200px'} h={'100%'} multiple
                                onChange={(files) => {
                                    const validFiles = files?.filter(file => allowedExtensions.includes(file.type));
                                    if (validFiles?.length) {
                                        const fileImgs = validFiles.map((file) => {
                                            const imageUrl = URL.createObjectURL(file);
                                            return {
                                                original: imageUrl,
                                                thumbnail: imageUrl,
                                            };
                                        });

                                        setFileInteriorImages(fileImgs);
                                        form.setFieldValue("Intriorfiles", validFiles);
                                    } else {
                                        toastShow("Only image files are allowed", "error")
                                    }
                                }}
                            />

                            {/* <DropzoneButton
                            onChange={(files) => {
                                const fileImgs = files.map((file) => {
                                    const imageUrl = URL.createObjectURL(file);
                                    return {
                                        original: imageUrl,
                                        thumbnail: imageUrl,
                                    };
                                });
                                setFileInteriorImages(fileImgs);
                                form.setFieldValue("Intriorfiles", files);
                            }}
                        /> */}

                        </Group>
                    </Stack>
                    <Flex gap={10} bg={dark ? '#2E2E2E' : '#dbd8d8'} c={dark ? '#fff' : '#06070A'} p={'sm'} bd='1px solid #707070' style={{ borderRadius: '6px' }}>
                        <IconInfoCircle size={20} />
                        <Text>Buyers expect to see 20 images on an advert</Text>
                    </Flex>
                    <Button radius={'xl'} size='md' c={'#000'} fullWidth mt={'lg'} loading={imageLoader} onClick={updateInteriorImage}>Save</Button>

                </Modal.Body>
            </Modal>
            <Modal opened={openedEngine} onClose={closeEngineModal} centered radius={25} title='Engine Images'>
                <Modal.Body p={'30 15 20'}>
                    <Stack gap={20} mb={30}>
                        <ActionIcon
                            color={"red"}
                            onClick={handleDeleteEngineImages}
                            title="Delete current Image"
                            style={{
                                top: "80px",
                                marginTop: "-60px",
                                left: "20px",
                                zIndex: 100,
                            }}
                        >
                            <IconTrash size={18} stroke={2.5} />
                        </ActionIcon>
                        <ImageGallery
                            items={carEngineImages}
                            ref={engineGallery}
                            showNav={false}
                        />
                        <Group gap={10} justify='center' pos='relative'>
                            <IconPhoto color='#3CDFCD' size={30} />
                            <Text c='fff' fz={24} style={{ textDecoration: 'underline' }}>
                                Upload image
                            </Text>
                            <FileInput variant="unstyled" accept="image/png,image/jpeg,image/jpg" className='custom-file-input' pos='absolute' top={0} left={'23%'} w={'200px'} h={'100%'} multiple
                                onChange={(files) => {
                                    const validFiles = files?.filter(file => allowedExtensions.includes(file.type));
                                    if (validFiles?.length) {
                                        const fileImgs = validFiles.map((file) => {
                                            const imageUrl = URL.createObjectURL(file);
                                            return {
                                                original: imageUrl,
                                                thumbnail: imageUrl,
                                            };
                                        });

                                        setFileEngineImages(fileImgs);
                                        form.setFieldValue("Enginefiles", validFiles);
                                    } else {
                                        toastShow("Only image files are allowed", "error")
                                    }

                                }}
                            />
                        </Group>
                    </Stack>
                    <Flex gap={10} bg={dark ? '#2E2E2E' : '#dbd8d8'} c={dark ? '#fff' : '#06070A'} p={'sm'} bd='1px solid #707070' style={{ borderRadius: '6px' }}>
                        <IconInfoCircle size={20} />
                        <Text>Buyers expect to see 20 images on an advert</Text>
                    </Flex>
                    <Button radius={'xl'} size='md' c={'#000'} loading={imageLoader} fullWidth mt={'lg'} onClick={updateEngineImage}>Save</Button>
                </Modal.Body>
            </Modal>
            <Container size='xl' c={dark ? '#fff' : '#000'} pb={{ base: 40, md: 60 }}>
                <Title order={2} fz={{ base: 32, sm: 40, lg: 45 }} mb={{ base: 25, md: 50 }}>Add Images</Title>
                <Flex wrap={'wrap'} gap={{ base: '10', md: 'xl' }}>
                    <Button
                        variant='outline' color='#3CDFCD' c={dark ? '#fff' : '#000'} size='lg' radius='xl'
                        leftSection={
                            <Image src='/assets/ic_imge_group.svg' w={25} />
                        }
                        onClick={() => openExteriorModal()}
                    >
                        Exterior
                    </Button>
                    <Button variant='outline' color='#3CDFCD' c={dark ? '#fff' : '#000'} size='lg' radius='xl'
                        leftSection={
                            <Image src='/assets/ic_imge_group.svg' w={25} />
                        }
                        onClick={() => openInteriorModal()}
                    >
                        Interior
                    </Button>
                    <Button variant='outline' color='#3CDFCD' c={dark ? '#fff' : '#000'} size='lg' radius='xl'
                        leftSection={
                            <Image src='/assets/ic_imge_group.svg' w={25} />
                        }
                        onClick={() => openEngineModal()}
                    >
                        Engine
                    </Button>
                </Flex>
            </Container>
        </>
    )
}

export default AddImages