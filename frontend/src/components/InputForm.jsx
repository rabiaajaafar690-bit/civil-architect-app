import { useState } from "react";

const defaultValues = {
  width: 20,
  length: 15,
  floors: 3,
  apartments_per_floor: 2,
  rooms_per_apartment: 4,
};

export default function InputForm({ onSubmit, loading }) {
  const [form, setForm] = useState(defaultValues);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const fields = [
    { name: "width", label: "Width (m)", min: 5, max: 100 },
    { name: "length", label: "Length (m)", min: 5, max: 100 },
    { name: "floors", label: "Floors", min: 1, max: 20 },
    { name: "apartments_per_floor", label: "Apartments / Floor", min: 1, max: 10 },
    { name: "rooms_per_apartment", label: "Rooms / Apartment", min: 1, max: 8 },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">Building Parameters</h2>

      {fields.map((f) => (
        <div key={f.name}>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {f.label}
          </label>
          <input
            type="number"
            name={f.name}
            value={form[f.name]}
            onChange={handleChange}
            min={f.min}
            max={f.max}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        {loading ? "Generating…" : "Generate Plan"}
      </button>
    </form>
  );
}
