import Hero from "../../components/Blocks/Hero";

export default function HomePage() {
  return (
    <>
      <div className="container">
        <Hero
          buttonText="Driver Login"
          link="/driver"
          img="https://images.pexels.com/photos/4604599/pexels-photo-4604599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        />
      </div>
    </>
  );
}
