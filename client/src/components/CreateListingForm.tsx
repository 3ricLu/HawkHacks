import React, { useState } from 'react';

interface Listing {
  title: string;
  description: string;
  people_needed: number;
  price: number;
  elo: number;
}

interface CreateListingFormProps {
  onSave: (listing: Listing) => void;
}

const CreateListingForm: React.FC<CreateListingFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<Listing>({
    title: '',
    description: '',
    people_needed: 0,
    price: 0,
    elo: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Listing created successfully!');
        setErrors({});
        onSave(formData);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: 'An error occurred during listing creation' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Job Title"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Job Description"
      />
      <input
        type="number"
        name="people_needed"
        value={formData.people_needed.toString()}
        onChange={handleChange}
        placeholder="Number of People Needed"
      />
      <input
        type="number"
        name="price"
        value={formData.price.toString()}
        onChange={handleChange}
        placeholder="Price"
      />
      <input
        type="number"
        name="elo"
        value={formData.elo.toString()}
        onChange={handleChange}
        placeholder="Elo"
      />

      {errors.general && <p className="error">{errors.general}</p>}

      <button type="submit">Create Listing</button>

      {success && <p className="success">{success}</p>}
    </form>
  );
};

export default CreateListingForm;
