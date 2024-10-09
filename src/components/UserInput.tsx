import React from 'react';

interface UserInputProps {
  content: string;
}

const UserInput: React.FC<UserInputProps> = ({ content }) => {
  return (
    <div className="p-2 mb-2 w-full bg-cyan-800 rounded-lg border border-cyan-700">
      <h3 className="text-lg font-semibold text-right text-white">User</h3>
      <p className="text-sm text-white">{content}</p>
    </div>
  );
};

export default UserInput;
