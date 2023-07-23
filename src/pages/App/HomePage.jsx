import Hero from "../../components/Blocks/Hero";

export default function HomePage() {
  return (
    <>
      <div className="container">
        <Hero
          buttonText="Driver Login"
          link="/driver"
          img="https://picsum.photos/200/300"
        />
      </div>
    </>
  );
}
