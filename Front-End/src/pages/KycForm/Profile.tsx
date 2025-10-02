import React from "react";
import { StageProps } from "./Registration";
import Input from "../../components/form/input/InputField";

const Profile = ({ btnPrevious, btnNext, activeTab }: StageProps) => {
  const btnSave = () => {
    btnNext();
    alert("Profile");
  };
  return (
    <div>
      <h1>I am From Profile</h1>
      <Input></Input>
      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={btnPrevious}
          disabled={activeTab <= 1}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          ⬅ Back
        </button>
        {activeTab < 6 ? (
          <button
            onClick={btnSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Next ➡
          </button>
        ) : (
          <button
            onClick={() => {
              alert("Form has been submitter");
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Submit{" "}
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
