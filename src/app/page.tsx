import { Container } from "@UI/Container";
import { Typography } from "@UI/Typography";

const Home = () => (
  <Container ScreenType="full-screen" className="fixed" fullHeight asElement="main">
    <Typography asElement="h1">
      Welcome to the Next.js 15 App Router with TypeScript and Tailwind
    </Typography>
  </Container>
);

export default Home;
