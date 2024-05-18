import Navigation from "../components/Navigation.tsx";
import("../App.css");
export default function ListingsPage() {
  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-col w-full h-full flex-wrap overflow-y-scroll overflow-x-hidden p-10 bg-gray-100">
        <div className="listings-title h-36 w-96 border-2 mb-2 bg-gray-200"></div>
        <div className="postings-container flex flex-row h-fill w-full border-2">
          <div className="posting-container h-96 w-full border-2"></div>
          <div className="group-container h-96 w-64 border-2"></div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
