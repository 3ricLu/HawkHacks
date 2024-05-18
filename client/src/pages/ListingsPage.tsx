import Navigation from "../components/Navigation.tsx";
import { useState, ChangeEvent, FormEvent } from "react";
import "../App.css";

export default function ListingsPage() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [postings, setPostings] = useState<
    { name: string; description: string; roles: string[]; id: number }[]
  >([]);
  const [roleAssignments, setRoleAssignments] = useState<{
    [key: number]: { role: string; filled: boolean }[];
  }>({});
  const [selectedPostingId, setSelectedPostingId] = useState<number | null>(
    null
  );

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);
  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) =>
    setDescription(event.target.value);
  const handleRolesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rolesArray = event.target.value.split(",").map((role) => role.trim());
    setRoles(rolesArray);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPostingId = postings.length + 1; // simple id generation
    const newPosting = { name, description, roles, id: newPostingId };
    setPostings([...postings, newPosting]);
    // Generate mock role assignments data
    const newRoleAssignments = roles.map((role) => ({
      role,
      filled: Math.random() < 0.5,
    })); // Randomly decide if a role is filled
    setRoleAssignments({
      ...roleAssignments,
      [newPostingId]: newRoleAssignments,
    });

    // Clear the fields after submission
    setName("");
    setDescription("");
    setRoles([]);
  };

  const handlePostingClick = (id: number) => {
    setSelectedPostingId(id);
  };

  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-col w-full h-full flex-wrap overflow-y-scroll overflow-x-hidden p-10 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="create-new-posting h-36 w-96 border-2 mb-2 flex flex-col p-4"
        >
          <input
            type="text"
            placeholder="Name of the posting"
            value={name}
            onChange={handleNameChange}
            className="mb-2"
          />
          <input
            type="text"
            placeholder="Description of the posting"
            value={description}
            onChange={handleDescriptionChange}
            className="mb-2"
          />
          <input
            type="text"
            placeholder="List of required roles (separated by commas)"
            value={roles.join(", ")}
            onChange={handleRolesChange}
            className="mb-2"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </button>
        </form>
        <div className="postings-container flex flex-row h-fill w-full border-2">
          <div className="posting-container h-96 w-full border-2 p-4 overflow-y-auto">
            {postings.map((posting) => (
              <div
                key={posting.id}
                className="mb-4 p-2 border-b cursor-pointer"
                onClick={() => handlePostingClick(posting.id)}
              >
                <h3>{posting.name}</h3>
                <p>{posting.description}</p>
                <ul>
                  {posting.roles.map((role, index) => (
                    <li key={index}>{role}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="group-container h-96 w-64 border-2 p-4 overflow-y-auto">
            {selectedPostingId && roleAssignments[selectedPostingId] ? (
              roleAssignments[selectedPostingId].map((assignment, index) => (
                <div key={index} className="mb-4 p-2">
                  <span>{assignment.role}:</span>{" "}
                  <strong>{assignment.filled ? "Filled" : "Vacant"}</strong>
                </div>
              ))
            ) : (
              <p>Select a posting to see role details.</p>
            )}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
