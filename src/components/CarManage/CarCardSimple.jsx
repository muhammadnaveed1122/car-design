import { Card, Image, Text, AspectRatio } from '@mantine/core';
import classes from './CarCardSimple.module.css';

export function CarCardSimple(props) {
  const imgUrls = JSON.parse(props?.images);
  const demoImage = imgUrls.length > 0 ? imgUrls[0] : "https://i.imgur.com/ZL52Q2D.png";

  return (
    <Card p="md" radius="md" component="a" href="#" className={classes.card}>
      <AspectRatio ratio={1920 / 1080}>
        <Image src={demoImage} />
      </AspectRatio>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
        {new Date(props?.createdAt).toDateString()}
      </Text>
      <Text className={classes.title} mt={5}>
        {props?.year} {props?.make} {props?.model}
      </Text>
    </Card>
  );
}