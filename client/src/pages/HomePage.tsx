import Navigation from "../components/Navigation";
import RegistrationForm from "../components/RegistrationForm";
import("../App.css");
export default function HomePage() {
  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-row w-full h-full flex-wrap overflow-y-scroll overflow-x-hidden p-10">
        <RegistrationForm />
      </div>
    </div>
  );
}
