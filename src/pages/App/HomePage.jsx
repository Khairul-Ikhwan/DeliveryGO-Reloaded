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
        />
      </div>
      <div className="container">
        <HeroLeft
          className={"user"}
          buttonText={"Customer"}
          link={"/user"}
          headerText={"Book A Delivery"}
        />
      </div>
    </>
  );
}
