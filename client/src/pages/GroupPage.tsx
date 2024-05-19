import Navigation from "../components/Navigation";
import Listing from "../components/Listing";
export default function GroupPage() {
  const mockListings = [
    {
      title: "Awesome Gaming Squad",
      price: 50,
      elo: 2,
      roles: ["Leader", "Sniper", "Support", "Scout"],
      description: "Join our squad for an epic gaming experience!",
      members: ["Alice", "Bob", "Charlie", "Dave"],
      listingOwner: "JohnDoe123",
      listingID: 1,
    },
    {
      title: "Pro League Team",
      price: 75,
      elo: 3200,
      roles: ["Tank", "Healer", "DPS"],
      description: "We are looking for dedicated players to join our team!",
      members: ["Eve", "Frank", "Grace"],
      listingOwner: "ProGamer456",
      listingID: 2,
    },
    {
      title: "Casual Weekend Warriors",
      price: 30,
      elo: 1800,
      roles: ["Leader", "Scout"],
      description: "Casual group for weekend gaming fun.",
      members: ["Hank", "Ivy"],
      listingOwner: "CasualGamer789",
      listingID: 3,
    },
    {
      title: "Awesome Gaming Squad",
      price: 50,
      elo: 2,
      roles: ["Leader", "Sniper", "Support", "Scout"],
      description: "Join our squad for an epic gaming experience!",
      members: ["Alice", "Bob", "Charlie", "Dave"],
      listingOwner: "JohnDoe123",
      listingID: 1,
    },
    {
      title: "Pro League Team",
      price: 75,
      elo: 3200,
      roles: ["Tank", "Healer", "DPS"],
      description: "We are looking for dedicated players to join our team!",
      members: ["Eve", "Frank", "Grace"],
      listingOwner: "ProGamer456",
      listingID: 2,
    },
    {
      title: "Casual Weekend Warriors",
      price: 30,
      elo: 1800,
      roles: ["Leader", "Scout"],
      description: "Casual group for weekend gaming fun.",
      members: ["Hank", "Ivy"],
      listingOwner: "CasualGamer789",
      listingID: 3,
    },
    {
      title: "Casual Weekend Warriors",
      price: 30,
      elo: 1800,
      roles: ["Leader", "Scout"],
      description: "Casual group for weekend gaming fun.",
      members: ["Hank", "Ivy"],
      listingOwner: "CasualGamer789",
      listingID: 3,
    },
    {
      title: "Awesome Gaming Squad",
      price: 50,
      elo: 2,
      roles: ["Leader", "Sniper", "Support", "Scout"],
      description: "Join our squad for an epic gaming experience!",
      members: ["Alice", "Bob", "Charlie", "Dave"],
      listingOwner: "JohnDoe123",
      listingID: 1,
    },
    {
      title: "Pro League Team",
      price: 75,
      elo: 3200,
      roles: ["Tank", "Healer", "DPS"],
      description: "We are looking for dedicated players to join our team!",
      members: ["Eve", "Frank"],
      listingOwner: "ProGamer456",
      listingID: 2,
    },
    // Add more mock listings as needed
  ];

  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-col w-full h-full flex-wrap overflow-y-scroll overflow-x-hidden p-10 bg-gray-100 items-center">
        <div className="title-container h-1/6 w-1/2 rounded-xl bg-gray-200 items-center mb-2">
          <div className="font-12 text-center mt-6 font-bold text-white text-6xl">
            Listings
          </div>
        </div>
        <div className="listings-container h-4/5 w-fill bg-gray-100 align-bottom grid grid-cols-3 justify-center">
          {mockListings.map((listing) => (
            <div className="m-2">
              <Listing key={listing.listingID} {...listing} />{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
