import { Tabs } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import ImageGallery from "react-image-gallery";
import { replaceBaseUrl } from "@/helpers";
import cameraIcon from "../../../public/assets/ic_camera.svg"
import carIcon from "../../../public/assets/ic_car.svg"
import seatIcon from "../../../public/assets/ic_car_seat.svg"
import settingTcon from "../../../public/assets/ic_setting.svg"
import Image from 'next/image';
import { ImageWatermark, Watermark } from 'watermark-js-plus';
import WatermarkedImage from './WatermarkedImage';
import ImageWithWatermark from './WatermarkedImage';

const dummyImgs = [{
  original: "https://placehold.co/640x480?text=NoImage",
  thumbnail: "https://placehold.co/320x240?text=NoImage",
}]
const CarImageGallery = ({ car }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('main-gallery');
  const thumbnailRef = useRef(null);

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
  console.log(tabThumbnails[activeTab], 'tabThumbnails[activeTab]')

  // const items = urlImages.map((url, index) => ({
  //   original: url,
  //   thumbnail: url, // You can set a different thumbnail if needed
  //   renderItem: () => (
  //     <WatermarkedImage src={url} alt={`Image ${index + 1}`} />
  //   ),
  // }));
  return (
    <>
      <Tabs className="gallery-tabs" value={activeTab} onChange={handleTabChange} orientation="vertical" radius="lg" shadow="sm">
        <Tabs.List>
          {/* {urlImages.length > 0 && ( */}
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
          {/* )} */}
          {/* {urlImagesExterior.length > 0 && ( */}
          <Tabs.Tab value="exterior"
            leftSection={
              <div className="icon">
                <Image src={carIcon} />
              </div>
            }
          >
            <div className="empty-area"></div>
            Exterior ({urlImagesExterior.length > 0 ? urlImagesExterior.length : 0})
          </Tabs.Tab>
          {/* // )} */}
          {/* {urlImagesInterior.length > 0 && ( */}
          <Tabs.Tab value="interior"
            leftSection={
              <div className="icon">
                <Image src={seatIcon} />
              </div>
            }
          >
            <div className="empty-area"></div>
            Interior ({urlImagesInterior.length > 0 ? urlImagesInterior.length : 0})
          </Tabs.Tab>
          {/* // )} */}
          {/* {urlImagesEngine.length > 0 && ( */}
          <Tabs.Tab value="engine"
            leftSection={
              <div className="icon">
                {/* <IconSettings className="img" /> */}
                <Image src={settingTcon} />
              </div>
            }
          >
            <div className="empty-area"></div>
            Engine ({urlImagesEngine.length > 0 ? urlImagesEngine.length : 0})
          </Tabs.Tab>
          {/* )} */}
        </Tabs.List>

        {urlImages.length > 0 && (
          <Tabs.Panel value="main-gallery">
            <>
              {/* <div>
                <h1>Image with Watermark</h1>
                <ImageWithWatermark
                  src="/cex-light-logo.png"
                  watermarkImage="https://cdn.jsdelivr.net/gh/zhensherlock/oss@main/uPic/github-mkWBiK.png"
                />
              </div> */}
              <ImageGallery
                items={urlImages}
                showThumbnails={false}
                showPlayButton={false}
                startIndex={currentIndexByTab['main-gallery']}
                onSlide={(currentIndex) => setCurrentIndexByTab((prev) => ({ ...prev, 'main-gallery': currentIndex }))}
              />
            </>
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
        {tabThumbnails[activeTab] && tabThumbnails[activeTab]?.map((item, index) => (
          <img
            key={index}
            src={item.thumbnail}
            alt={item.originalAlt}
            className={`thumbnail ${index === currentIndexByTab[activeTab] ? 'active' : ''}`}
            onClick={() => onThumbnailClick(index)}
          />
        ))}
      </div>
    </>
  )
}

export default CarImageGallery