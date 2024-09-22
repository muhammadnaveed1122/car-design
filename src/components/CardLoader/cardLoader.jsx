import { SimpleGrid } from '@mantine/core'
import React from 'react'
import CardSkeleton from './CardSkeleton'

const CardLoader = ({loading}) => {
    if (loading) {
        return <SimpleGrid cols={3} spacing="lg">
            {[...Array(3)].map((_, index) => (
                <CardSkeleton key={index} />
            ))}
        </SimpleGrid>
    }
    return null
}

export default CardLoader
