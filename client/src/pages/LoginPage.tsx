import Navigation from "../components/Navigation";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-row w-full h-full flex-wrap overflow-y-scroll overflow-x-hidden p-10">
        <LoginForm
          onLogin={function (username: string): void {
            throw new Error("Function not implemented.");
          }}
        ></LoginForm>
      </div>
    </div>
  );
}
