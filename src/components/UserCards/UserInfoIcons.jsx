import { IconPhoneCall, IconAt } from '@tabler/icons-react';
import { Avatar, Text, Group } from '@mantine/core';
import classes from './UserInfoIcons.module.css';

export function UserInfoIcons({userInfo}) {
  return (
    <div>
      <Group wrap="nowrap">
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            Software engineer
          </Text>

          <Text fz="lg" fw={500} className={classes.name}>
            {userInfo?.firstName} {userInfo?.lastName}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {userInfo?.email}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {userInfo?.phone}
            </Text>
          </Group>
        </div>
      </Group>
    </div>
  );
}