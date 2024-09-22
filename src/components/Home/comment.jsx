import { CommentSimple } from '../CommentSimple';
import { Carousel } from '@mantine/carousel';
import { Box } from '@mantine/core';

export default function Comment({ comments }) {
    return (
        <Carousel
            slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
            slideGap={{ base: 20 }}
            loop
            align="start"
            controlSize={40}
            slidesToScroll={1}
            className="contactUsCarousel"
        >
            {
                comments.map((comment, i) => (
                    <Carousel.Slide key={`why${i}`}>
                        <Box mx="auto" maw={600}>
                            <CommentSimple
                                key={i}
                                image={comment.image}
                                name={comment.name}
                                title={comment.title}
                                content={comment.content} />
                        </Box>
                    </Carousel.Slide>
                ))}
        </Carousel>
    )
}
