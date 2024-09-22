
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

export const toastShow = (msg, type = 'success') => {
  notifications.show({
    withBorder: true,
    withCloseButton: true,
    title: msg,
    message: type === 'success' ? "Successfully done" : "Something went wrong",
    color: type === 'success' ? "teal" : "red",
    icon: type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />,
  })
}