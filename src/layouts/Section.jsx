import { Title, Text, Container } from '@mantine/core';
import classes from '@/styles/Section.module.css';

export default function Section({ children, title, isGradient, size = "lg", ...props }) {

  return (
    <section className={isGradient ? classes.gradientSection : classes.section} {...props}>
      {title && <div className={classes.titleContainer}>
        {isGradient ?
          <Text className={classes.title} variant="gradient"
            gradient={{ from: 'ocean-blue.1', to: 'ocean-blue.0', deg: 90 }}>{title}</Text>
          : <Title order={2} className={classes.title}>{title}</Title>}
      </div>}
      <Container className={classes.inner} size={size}>
        {children}
      </Container>
    </section>
  );
}