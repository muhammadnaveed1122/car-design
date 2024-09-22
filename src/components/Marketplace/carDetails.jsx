
import { Card, Grid, Text, Stack, Container, Tabs, } from "@mantine/core";
import { carService, userCarService } from "@/services";
import { useLoadingContext } from "@/providers/LoadingProvider";
import CarSideBar from "./carDetailsSideBar";
import { IconCar, IconSettings } from "@tabler/icons-react";
import ImageGallery from "react-image-gallery";
import { replaceBaseUrl } from "@/helpers";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { toastShow } from "@/helpers";
import cameraIcon from "../../../public/assets/ic_camera.svg"
import carIcon from "../../../public/assets/ic_car.svg"
import seatIcon from "../../../public/assets/ic_car_seat.svg"
import settingTcon from "../../../public/assets/ic_setting.svg"
import Image from "next/image";
import CarImageGallery from "../CarImageGallery/CarImageGallery";

const dummyImgs = [{
    original: "https://placehold.co/640x480?text=NoImage",
    thumbnail: "https://placehold.co/320x240?text=NoImage",
}]
export default function CarDetails({ carId, carInfo }) {

    const [car, setCar] = useState(carInfo);
    const [myPrice, setMyPrice] = useState(0);

    const [fakeView, setFakeViews] = useState(
        Math.floor(Math.random() * (150 - 60 + 1)) + 60
    );

    const router = useRouter();

    const imgUrlsInterior = car.interiorImages ? JSON.parse(car.interiorImages) : [];
    const imgUrlsExterior = car.exteriorImages ? JSON.parse(car.exteriorImages) : [];
    const imgUrlsEngine = car.engineImages ? JSON.parse(car.engineImages) : [];
    const carImgUrls = car.images ? JSON.parse(car.images) : [];
    const imgUrls = [...imgUrlsInterior, ...imgUrlsExterior, ...carImgUrls, ...imgUrlsEngine];

    const urlImagesInterior =
        imgUrlsInterior.length > 0
        && imgUrlsInterior.map((image) => ({
            original: replaceBaseUrl(image),
            thumbnail: replaceBaseUrl(image),
        }))
    const urlImagesEngine = imgUrlsEngine.length > 0 && imgUrlsEngine.map((image) => ({
        original: replaceBaseUrl(image),
        thumbnail: replaceBaseUrl(image),
    }))
    const urlImagesExterior =
        imgUrlsExterior.length > 0
        && imgUrlsExterior.map((image) => ({
            original: replaceBaseUrl(image),
            thumbnail: replaceBaseUrl(image),
        }))
    const urlImages =
        imgUrls.length > 0
            ? imgUrls.map((image) => ({
                original: replaceBaseUrl(image),
                thumbnail: replaceBaseUrl(image),
            }))
            : dummyImgs;

    const getCarDetails = async () => {
        userCarService.getSlugData(carId).then((carData) => {
            setCar(carData);
            if (carData.status !== "LIVE") {
                router.push("/");
            }
        });
    };
    useEffect(() => {
        if (carId) {
            getCarDetails()
        }
    }, [carId]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('main-gallery');
    const thumbnailRef = useRef(null);

    // Object to keep track of the current index for each tab
    const [currentIndexByTab, setCurrentIndexByTab] = useState({
        'main-gallery': 0,
        'exterior': 0,
        'interior': 0,
        'engine': 0
    });
    const tabThumbnails = {
        'main-gallery': urlImages,
        'exterior': urlImagesExterior,
        'interior': urlImagesInterior,
        'engine': urlImagesEngine,
    };

    const centerThumbnail = (index) => {
        const thumbnailsContainer = thumbnailRef.current;
        if (thumbnailsContainer) {
            const thumbnail = thumbnailsContainer.children[index];
            if (thumbnail) {
                const thumbnailsContainerWidth = thumbnailsContainer.clientWidth;
                const thumbnailWidth = thumbnail.clientWidth;
                const scrollPosition = thumbnail.offsetLeft - (thumbnailsContainerWidth / 2) + (thumbnailWidth / 2);
                thumbnailsContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            }
        }
    };
    useEffect(() => {
        centerThumbnail(currentIndexByTab[activeTab]);
    }, [currentIndexByTab, activeTab]);

    // Handle thumbnail click and update current index for the active tab
    const onThumbnailClick = (index) => {
        setCurrentIndexByTab((prev) => ({
            ...prev,
            [activeTab]: index
        }));
        centerThumbnail(index);
    };
    const handleTabChange = (tabValue) => {
        setActiveTab(tabValue);
    };

    return (
        <Container size="xl" p={'0 10px'}>
            <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <CarImageGallery  car={car} />
                    {/* <Tabs className="gallery-tabs" value={activeTab} onChange={handleTabChange} orientation="vertical" radius="lg" shadow="sm">
                        <Tabs.List>
                            {urlImages.length > 0 && (
                                <Tabs.Tab value="main-gallery"
                                    leftSection={
                                        <div className="icon">
                                            <Image src={cameraIcon} />
                                        </div>
                                    }
                                >
                                    <div className="empty-area"></div>
                                    Main Images ({urlImages.length})
                                </Tabs.Tab>
                            )}
                            {urlImagesExterior.length > 0 && (
                                <Tabs.Tab value="exterior"
                                    leftSection={
                                        <div className="icon">
                                            <Image src={carIcon} />
                                        </div>
                                    }
                                >
                                    <div className="empty-area"></div>
                                    Exterior ({urlImagesExterior.length})
                                </Tabs.Tab>
                            )}
                            {urlImagesInterior.length > 0 && (
                                <Tabs.Tab value="interior"
                                    leftSection={
                                        <div className="icon">
                                            <Image src={seatIcon} />
                                        </div>
                                    }
                                >
                                    <div className="empty-area"></div>
                                    Interior ({urlImagesInterior.length})
                                </Tabs.Tab>
                            )}
                            {urlImagesEngine.length > 0 && (
                                <Tabs.Tab value="engine"
                                    leftSection={
                                        <div className="icon">
                                          
                                            <Image src={settingTcon} />
                                        </div>
                                    }
                                >
                                    <div className="empty-area"></div>
                                    Engine ({urlImagesEngine.length})
                                </Tabs.Tab>
                            )}
                        </Tabs.List>

                        {urlImages.length > 0 && (
                            <Tabs.Panel value="main-gallery">
                                <ImageGallery
                                    items={urlImages}
                                    showThumbnails={false}
                                    showPlayButton={false}
                                    startIndex={currentIndexByTab['main-gallery']}
                                    onSlide={(currentIndex) => setCurrentIndexByTab((prev) => ({ ...prev, 'main-gallery': currentIndex }))}
                                />
                            </Tabs.Panel>
                        )}
                        {urlImagesExterior.length > 0 && (
                            <Tabs.Panel value="exterior">
                                <ImageGallery
                                    items={urlImagesExterior}
                                    showThumbnails={false}
                                    showPlayButton={false}
                                    startIndex={currentIndexByTab['exterior']}
                                    onSlide={(currentIndex) => setCurrentIndexByTab((prev) => ({ ...prev, 'exterior': currentIndex }))}
                                />
                            </Tabs.Panel>
                        )}
                        {urlImagesInterior.length > 0 && (
                            <Tabs.Panel value="interior">
                                <ImageGallery
                                    items={urlImagesInterior}
                                    showThumbnails={false}
                                    showPlayButton={false}
                                    startIndex={currentIndexByTab['interior']}
                                    onSlide={(currentIndex) => setCurrentIndexByTab((prev) => ({ ...prev, 'interior': currentIndex }))}
                                />
                            </Tabs.Panel>
                        )}
                        {urlImagesEngine.length > 0 && (
                            <Tabs.Panel value="engine">
                                <ImageGallery
                                    items={urlImagesEngine}
                                    showThumbnails={false}
                                    showPlayButton={false}
                                    startIndex={currentIndexByTab['engine']}
                                    onSlide={(currentIndex) => setCurrentIndexByTab((prev) => ({ ...prev, 'engine': currentIndex }))}
                                />
                            </Tabs.Panel>
                        )}
                    </Tabs>

                    <div className="thumbnails-wrapper" ref={thumbnailRef}>
                        {tabThumbnails[activeTab]?.map((item, index) => (
                            <img
                                key={index}
                                src={item.thumbnail}
                                alt={item.originalAlt}
                                className={`thumbnail ${index === currentIndexByTab[activeTab] ? 'active' : ''}`}
                                onClick={() => onThumbnailClick(index)}
                            />
                        ))}
                    </div> */}
                    <Card
                        visibleFrom="sm"
                        mt="xl"
                        withBorder
                        mx={{ sm: "md" }}
                        radius="lg"
                        shadow="sm"
                    >
                        <Card.Section withBorder inheritPadding p="lg">
                            <Stack align="center" gap={0}>
                                <IconCar
                                    size={30}
                                    stroke={1.6}
                                    color="var(--mantine-color-ocean-blue-filled)"
                                />
                                <Text fz={14} c="ocean-blue" fw={500}>
                                    Vehicle Description
                                </Text>
                            </Stack>
                        </Card.Section>
                        <Card.Section withBorder inheritPadding>
                            <div
                                className="ck-editor-text"
                                dangerouslySetInnerHTML={{ __html: car?.specs }}
                            />
                        </Card.Section>
                    </Card>
                </Grid.Col>
                <CarSideBar
                    car={car}
                    fakeView={fakeView}
                    myPrice={myPrice}
                    setMyPrice={setMyPrice}
                    getCarDetails={getCarDetails}
                />
                <Grid.Col hiddenFrom="sm" span={{ base: 12, md: 8 }}>
                    <Card withBorder mx={{ sm: "md" }} radius="lg" shadow="sm">
                        <Card.Section withBorder inheritPadding p="lg">
                            <Stack align="center" gap={0}>
                                <IconCar
                                    size={30}
                                    stroke={1.6}
                                    color="var(--mantine-color-ocean-blue-filled)"
                                />
                                <Text fz={14} c="ocean-blue" fw={500}>
                                    Vehicle Description
                                </Text>
                            </Stack>
                        </Card.Section>
                        <Card.Section withBorder inheritPadding>
                            {/* <ScrollArea p="xl">{parse(car?.specs || "")}</ScrollArea> */}
                            <div
                                className="ck-editor-text"
                                dangerouslySetInnerHTML={{ __html: car?.specs }}
                            />
                        </Card.Section>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
