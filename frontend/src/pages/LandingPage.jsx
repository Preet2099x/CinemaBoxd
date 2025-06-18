import React from 'react';

const LandingPage = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional Overlay for Contrast */}
      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

      {/* Centered Text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20">
        <h1 className="text-5xl font-extrabold">CinemaBoxd</h1>
        <p className="text-xl mt-2">Loading Soon</p>
      </div>
    </div>
  );
};

export default LandingPage;
