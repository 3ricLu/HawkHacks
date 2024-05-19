import Navigation from "../components/Navigation";
import Listing from "../components/Listing";
import React, { useEffect, useState } from "react";

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
        const response = await fetch("/api/listings", {
          credentials: 'include', // Include credentials with fetch requests
        });
        const data = await response.json();
        console.log("Fetched listings:", data.listings);
        // Ensure members is an array
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
      const response = await fetch(`/api/listings/join/${listingID}`, {
        method: "POST",
        credentials: 'include', // Include credentials with fetch requests
      });
      if (response.ok) {
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.listingID === listingID
              ? { ...listing, members: [...listing.members, "NewMember"] } // Replace "NewMember" with actual user
              : listing
          )
        );
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
