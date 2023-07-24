import HeroLeft from "../../components/Blocks/HeroLeft";
import Nav from "../../components/Navbars/Nav";
import "../App/App.css";

export default function HomePage() {
  return (
    <>
      <Nav />
      <div className="container">
        <HeroLeft
          className={"driver"}
          buttonText={"Driver"}
          link={"/driver"}
          headerText={"Drive with us"}
          smallText={"Delivery, powered by the community"}
        />
      </div>
      <div className="container">
        <HeroLeft
          className={"user"}
          buttonText={"Customer"}
          link={"/user"}
          headerText={"Book A Delivery"}
          smallText={"Connecting Communities, Delivering Convenience"}
        />
      </div>
    </>
  );
}
