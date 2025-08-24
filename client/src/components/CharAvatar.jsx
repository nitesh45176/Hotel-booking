import React from 'react'
import { getInitials } from '../utils/helper';

export const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div
      className={`${width || 'w-12'} ${height || 'h-12'} flex items-center justify-center rounded-full text-white font-medium bg-gray-700 ${style || ''}`}
    >
      {getInitials(fullName || "") || "U"} 
    </div>
  );
};

export default CharAvatar;
