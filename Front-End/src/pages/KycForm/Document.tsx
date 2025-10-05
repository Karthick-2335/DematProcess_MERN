import React, { useState } from "react";
import DropzoneComponent from "../../components/form/form-elements/DropZone";

const Document: React.FC = () => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<(string | null)[]>(Array(6).fill(null));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedImages = [...images];
      updatedImages[step - 1] = reader.result as string;
      setImages(updatedImages);
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log("Uploaded Images:", images);
    alert("All images uploaded successfully!");
  };

  return (
    <div className="w-full max-w-5xl p-6 rounded-2xl shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Step {step} of 6
      </h2>
      {/* Progress Bar */}
      <div className="flex mb-6 justify-between">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`h-2 w-full mx-1 rounded-full ${
              i < step ? "bg-blue-500" : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
        {images[step - 1] ? (
          <img
            src={images[step - 1]!}
            alt={`Stage ${step}`}
            className="mx-auto rounded-lg max-h-56 object-cover"
          />
        ) : (
          <p className="text-gray-400">No image uploaded yet</p>
        )}

        <label className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition">
          {images[step - 1] ? "Replace Image" : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          Back
        </button>

        {step < 6 ? (
          <button
            onClick={nextStep}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Document;
