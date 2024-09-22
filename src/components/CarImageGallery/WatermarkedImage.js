// components/ImageWithWatermark.js
import { useEffect, useRef, useState } from 'react';
import { ImageWatermark } from 'watermark-js-plus';

const defaultWatermarkImage = 'https://cdn.jsdelivr.net/gh/zhensherlock/oss@main/uPic/github-mkWBiK.png';

const ImageWithWatermark = ({ src, watermarkImage = defaultWatermarkImage, alt, ...props }) => {
  const imgRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImageLoad = () => {
    setImgLoaded(true);
  };

  useEffect(() => {
    if (imgRef.current && imgLoaded) {
      const watermark = new ImageWatermark({
        contentType: 'image',
        image: watermarkImage,
        imageWidth: 200,
        width: imgRef.current.width,
        height: imgRef.current.height,
        dom: imgRef.current,
        rotate: 0,
        translatePlacement: 'bottom-end',
      });

      watermark.create(); // Add watermark

      return () => {
        watermark.destroy(); // Remove watermark
      };
    }
  }, [watermarkImage, imgLoaded]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className="image-watermark-image"
      style={{ maxWidth: '100%', height: 'auto', display: imgLoaded ? 'block' : 'none' }} // Hide until loaded
      onLoad={handleImageLoad}
      {...props}
    />
  );
};

export default ImageWithWatermark;
