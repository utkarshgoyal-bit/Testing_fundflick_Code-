import React from 'react';

const DashBoardWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen px-10 bg-color-background w-full max-md:px-2">{children}</div>;
};

export default DashBoardWrapper;
