import { Skeleton, Group, Stack } from '@mantine/core';

function CardSkeleton() {
    return (
        <Stack spacing="md">
            <Skeleton height={200} width="100%" />
            <Skeleton height={24} width="70%" />
            <Skeleton height={24} width="50%" />
            <Skeleton height={24} width="30%" />
            <Group spacing="md">
                <Skeleton height={20} width="40%" />
                <Skeleton height={20} width="40%" />
            </Group>
        </Stack>
    );
}

export default CardSkeleton;
