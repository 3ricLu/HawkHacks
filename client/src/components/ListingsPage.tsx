import React, { useState, useEffect } from 'react';

interface Listing {
  id: number;
  title: string;
  description: string;
  people_needed: number;
  price: number;
  elo: number;
}

const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setListings(data.listings);
        } else {
          console.error('Failed to fetch listings');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div>
      <h1>Job Listings</h1>
      {listings.map((listing) => (
        <div key={listing.id}>
          <h2>{listing.title}</h2>
          <p>{listing.description}</p>
          <p>People Needed: {listing.people_needed}</p>
          <p>Price: {listing.price}</p>
          <p>ELO: {listing.elo}</p>
        </div>
      ))}
    </div>
  );
};

export default ListingsPage;
