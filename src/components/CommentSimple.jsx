import { Text, Avatar, Group, Box } from '@mantine/core';

export function CommentSimple({ image, name, title, content }) {
  return (
    <>
      <Group>
        <Avatar
          src={image}
          alt={name}
          radius="xl"
        />
        <Box>
          <Text size="sm" c="#fff">{name}</Text>
          <Text size="xs" c="#eee">
            {title}
          </Text>
        </Box>
      </Group>
      <Text pt="sm" size="sm" c="#EEE" display={{base: "none", xs: "block"}}>{content}</Text>
    </>
  );
}
