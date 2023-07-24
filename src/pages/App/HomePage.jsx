import HeroLeft from "../../components/Blocks/HeroLeft";
import "../App/App.css";

export default function HomePage() {
  return (
    <>
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
          smallText={"Getting your products, right on time"}
        />
      </div>
    </>
  );
}
