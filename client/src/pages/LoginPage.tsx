import Navigation from "../components/Navigation";

export default function LoginPage() {
  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-row w-full h-full flex-wrap overflow-y-scroll overflow-x-hidden p-10"></div>
    </div>
  );
}
