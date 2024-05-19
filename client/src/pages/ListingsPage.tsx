import React, { useState, ChangeEvent, FormEvent } from "react";
import Navigation from "../components/Navigation";
import "../App.css";

interface Listing {
  title: string;
  description: string;
  people_needed: number;
  price: number;
  elo: number;
}

const ListingsPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [peopleNeeded, setPeopleNeeded] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [elo, setElo] = useState<number>(0);
  const [postings, setPostings] = useState<Listing[]>([]);
  const [selectedPosting, setSelectedPosting] = useState<Listing | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string | null>(null);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTitle(event.target.value);
  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(event.target.value);
  const handlePeopleNeededChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPeopleNeeded(Number(event.target.value));
  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPrice(Number(event.target.value));
  const handleEloChange = (event: ChangeEvent<HTMLInputElement>) =>
    setElo(Number(event.target.value));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          people_needed: peopleNeeded,
          price,
          elo,
        }),
      });

      if (response.ok) {
        const newPosting: Listing = {
          title,
          description,
          people_needed: peopleNeeded,
          price,
          elo,
        };
        setPostings([...postings, newPosting]);
        setSuccess("Listing created successfully!");
        setErrors({});
        // Clear the form
        setTitle("");
        setDescription("");
        setPeopleNeeded(0);
        setPrice(0);
        setElo(0);
      } else {
        const errorData = await response.json();
        setErrors(
          errorData.errors || {
            general: "An error occurred during listing creation",
          }
        );
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    }
  };

  const handlePostingClick = (posting: Listing) => {
    setSelectedPosting(posting);
  };

  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-col w-full h-full flex-wrap overflow-y-scroll overflow-x-hidden p-10 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="create-new-posting h-auto w-96 bg-gray-200 mb-2 flex flex-col p-4 rounded-xl"
        >
          <div className="text-white text-xl mb-2">Create a New Posting</div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            className="mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
            className="mb-2 rounded-xl bg-purple-100 h-24 text-white p-2 mb-2 placeholder-white"
          />
          <div className="text-white">Members Needed</div>
          <input
            type="number"
            placeholder="Number of People Needed"
            value={peopleNeeded}
            onChange={handlePeopleNeededChange}
            className="mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
          />
          <div className=" text-white">Price</div>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={handlePriceChange}
            className="mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
          />
          <div className="text-white">Elo</div>
          <input
            type="number"
            placeholder="Elo"
            value={elo}
            onChange={handleEloChange}
            className="mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
          />
          <button
            type="submit"
            className="bg-gray-100 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl h-9 text-white p-2 mb-2 ml-2 mr-2 placeholder-white mt-2"
          >
            Create
          </button>
          {errors.general && (
            <p className="error text-white">{errors.general}</p>
          )}
          {success && (
            <p className="success text-white text-center">{success}</p>
          )}
        </form>
        <div className="postings-container flex flex-row h-fill w-full">
          <div className="posting-container h-96 w-96 p-4 overflow-y-auto bg-gray-200 ml-10 items-center justify-center rounded-xl">
            <div className="text-white text-xl mb-2">Previous Listings</div>
            {postings.map((posting, index) => (
              <div
                key={index}
                className="mb-4 p-2 border-b cursor-pointer"
                onClick={() => handlePostingClick(posting)}
              >
                <p className="text-white">Posting #{index + 1}</p>{" "}
                <p className="w-full bg-purple-100 h-1"></p>
                <h3 className="text-white text-2xl">{posting.title}</h3>
                <p className="text-white">{posting.description}</p>
                <p className="text-white">
                  People Needed: {posting.people_needed}
                </p>
                <p className="text-white">Price: ${posting.price}</p>
                <p className="text-white">Elo: {posting.elo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
