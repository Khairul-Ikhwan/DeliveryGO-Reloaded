import DriverLogin from "../../components/Login/DriverLogin";
import DesktopNav from "../../components/Navbars/DesktopNav";
import "./App.css";

export default function App() {
  return (
    <main className="App">
      <DesktopNav />
      <h1>Powered by the community</h1>
      <DriverLogin />
    </main>
  );
}
