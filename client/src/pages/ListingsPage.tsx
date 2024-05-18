import Navigation from "../components/Navigation.tsx";
import("../App.css");
export default function ListingsPage() {
  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-row w-full h-full flex-wrap overflow-y-scroll overflow-x-hidden p-10"></div>
    </div>
  );
}
