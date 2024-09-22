import { Box, Button, Input, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect } from 'react';
import { toastShow } from '@/helpers';

function CopyModal({ url, setShare }) {
    const [opened, { open, close }] = useDisclosure(false);
    useEffect(() => {
        open()
    }, [])
    return (
        <Modal
            size="sm"
            opened={opened}
            onClose={() => {
                setShare(false)
                close()
            }}
            className='share-modal'
            style={{ background: "rgb(3, 94, 119)" }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            centered
        >

            <label>Share Link</label>
            <Box py="md">
                <Input aria-label='Share Link' value={`${window.location.origin}/market/${url}`} />
            </Box>
            <Box ta="end">
                <Button color="#027ae1" onClick={() => {
                    toastShow("Url copied")
                    navigator.clipboard.writeText(`${window.location.origin}/market/${url}`)
                    setShare(false)
                }
                }>
                    Copy Link
                </Button>
            </Box>

        </Modal>
    )
}

export default CopyModal