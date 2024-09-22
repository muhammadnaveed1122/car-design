import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import { Text, Group, Button, rem, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import classes from '@/styles/DropzoneButton.module.css';
import { toastShow } from '@/helpers';
import { useRef } from 'react';

export function DropzoneButton({ children, buttonLabel, onChange, error  ,type}) {
  const theme = useMantineTheme();
  const openRef = useRef(null);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={onChange}
        onReject={(error) => {
          toastShow(error[0].errors[0].message, "error")
        }}
        className={classes.dropzone}
        radius="md"
        accept={type? []:[
          MIME_TYPES.png,
          MIME_TYPES.jpeg,
          MIME_TYPES.svg,
          MIME_TYPES.gif,
        ]}
        maxSize={29 * 1024 ** 2}
        style={{ borderColor: error ? "#fa5252" : "#ced4da" }}
      >
        {children ? children :
          <div style={{ pointerEvents: 'none' }}>
            <Group justify="center">
              <Dropzone.Accept>
                <IconDownload
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.red[6]}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
              </Dropzone.Idle>
            </Group>

            <Text ta="center" fw={700} fz="lg" mt="xl">
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>Image file less than 30mb</Dropzone.Reject>
              <Dropzone.Idle>Upload images</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed" px="lg">
              Drag&apos;n&apos;drop files here to upload. We can accept only <i>.jpg</i> <i>.png</i> files that
              are less than 30mb in size.
            </Text>
          </div>}
      </Dropzone>

      <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
        {buttonLabel || "Select files"}
      </Button>
    </div>
  );
}