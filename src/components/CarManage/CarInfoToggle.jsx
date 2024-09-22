import { Button, Group, Collapse, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function CarInfoToggle({ children, title, toggleOpened }) {
  const [opened, { toggle }] = useDisclosure(toggleOpened);

  return (
    <Box m={{ base: '14px 4px', sm: '14px' }}  className='light-shadow' style={{ borderRadius: 15 }}>
      <Group grow mb={5}>
        <Button variant="light" color="#3CDFCD" onClick={toggle} radius="lg">{title}</Button>
      </Group>

      <Collapse in={opened} py="lg" >
        {children}
      </Collapse>
    </Box>
  );
}