import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import Listing from "../components/Listing";

interface Listing {
  title: string;
  price: number;
  elo: number;
  roles: string[];
  description: string;
  members: string[];
  listingOwner: string;
  listingID: number;
  people_needed: number;
}

export default function GroupPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listings");
        const data = await response.json();
        console.log("Fetched listings:", data.listings);
        const sanitizedListings = data.listings.map((listing: Listing) => ({
          ...listing,
          members: listing.members || [],
        }));
        setListings(sanitizedListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleJoin = async (listingID: number) => {
    try {
      console.log("Joining listing ID:", listingID);
      const response = await fetch(`/api/listings/join/${listingID}`, {
        method: "POST",
      });
      if (response.ok) {
        console.log("Join successful");

        // Refetch the updated listings after a successful join
        const updatedListingsResponse = await fetch("/api/listings");
        const updatedListingsData = await updatedListingsResponse.json();
        console.log("Updated listings after join:", updatedListingsData.listings);

        const sanitizedListings = updatedListingsData.listings.map((listing: Listing) => ({
          ...listing,
          members: listing.members || [],
        }));
        setListings(sanitizedListings);
        console.log("State updated with new listings:", sanitizedListings);
      } else {
        console.error("Error joining listing:", response.statusText);
      }
    } catch (error) {
      console.error("Error joining listing:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
          {listings.map((listing) => (
            <div key={listing.listingID} className="m-2">
              <Listing {...listing} onJoin={handleJoin} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
