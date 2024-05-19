import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface ListingProps {
  title: string;
  price: number;
  elo: number;
  roles: string[];
  description: string;
  members: string[];
  listingOwner: string;
  listingID: number;
  people_needed: number;
  onJoin: (listingID: number) => void;
  currentUser: string;
}

const Listing: React.FC<ListingProps> = ({
  title,
  price,
  elo,
  roles = [],
  description,
  members = [],
  listingOwner,
  listingID,
  people_needed,
  onJoin,
  currentUser,
}) => {
  const handleJoinClick = () => {
    console.log(`Joining listing with ID: ${listingID}, Current members: ${members.length}`);
    if (members.length < people_needed && currentUser !== listingOwner) {
      onJoin(listingID);
    }
  };

  return (
    <div className="listing-container w-80 h-fill mt-2 mx-1 mb-1 bg-gray-200 rounded-3xl">
      <div className="listings-title flex flex-row object-contain justify-between">
        <h1 className="title-text text-white font-bold py-4 pl-5 text-xl">
          {title}
        </h1>
        <div className="placeholder"></div>
        <FontAwesomeIcon
          icon={faRightToBracket}
          className={`join-icon w-6 h-6 pr-5 pt-5 justify-self-end text-white hover:cursor-pointer ${
            members.length >= people_needed || currentUser === listingOwner ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleJoinClick}
        />
      </div>
      {elo < 1000 && (
        <h2>
          <div className="difficulty-bar w-full h-1 bg-green"></div>
        </h2>
      )}
      {elo >= 1000 && elo < 2000 && (
        <h2>
          <div className="difficulty-bar w-full h-1 bg-yellow"></div>
        </h2>
      )}
      {elo > 2000 && (
        <h2>
          <div className="difficulty-bar w-full h-1 bg-red"></div>
        </h2>
      )}
      <h1 className="description text-white px-3 py-2 text-l">{description}</h1>
      <h1 className="roles text-white px-3 py-2 text-l">
        <div>Roles:</div> {roles.join(", ")}
      </h1>
      <div className="members-and-price-container w-fill h-10 bg-gray-200 flex justify-between rounded-3xl">
        <h1 className="slots-taken font-bold text-purple-200 px-3 text-xl text-left">
          {members.length}/{people_needed}
        </h1>
        <div className="placeholder"> </div>
        <h1 className="price font-bold text-purple-200 px-3 text-xl">
          {price}C
        </h1>
      </div>
      <div className="members-list text-white px-3 py-2 text-l">
        Members: {members.join(", ")}
      </div>
    </div>
  );
};

export default Listing;
