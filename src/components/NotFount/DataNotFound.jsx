import { Table, Text } from '@mantine/core';

const NoAccountFound = ({ description }) => (
    <Table.Tr>
        <Table.Td colSpan={9}>
            <Text fw={500} ta="center">
                {description}
            </Text>
        </Table.Td>
    </Table.Tr>
);
export default NoAccountFound