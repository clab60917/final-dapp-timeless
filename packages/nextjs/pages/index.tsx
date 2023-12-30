//import Link from "next/link";
import React, { useState } from "react";
import type { NextPage } from "next";
import { StarIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion-item bg-base-200 ${isOpen ? "open" : ""}`}>
      <h3 className="accordion-header">
        <button className="accordion-button btn btn-primary btn-block" onClick={() => setIsOpen(!isOpen)}>
          {question}
        </button>
      </h3>
      {isOpen && <div className="accordion-body p-4">{answer}</div>}
    </div>
  );
};

const Testimonial = ({ text, author }) => (
  <div className="bg-base-100 p-4 rounded-lg shadow">
    <StarIcon className="h-5 w-5 text-yellow-400" />
    <p className="text-sm">{text}</p>
    <p className="text-sm font-bold">{author}</p>
  </div>
);

const Home: NextPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 lg:pt-20">
        <div className="px-5 justify-center space-y-10 md:text-center mx-auto flex h-full w-full max-w-4xl flex-col md:items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black">
            Find the watch of your dream.
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Discover physical NFTs.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl sm:text-lg md:text-xl md:leading-8">
            Explore our exclusive marketplace for luxury watch NFTs, where each NFT is linked to an authentic physical
            timepiece. Purchase an NFT and become the owner of a tangible luxury watch, blending digital innovation with
            classic elegance.
          </p>
        </div>

        <a href="http://localhost:3000/marketplace" className="pt-12" target="_blank" rel="noopener noreferrer">
          <button className="btn btn-outline btn-info">Visit the Marketplace</button>
        </a>

        {/* Testimonials Section */}
        <div className="py-12">
          <h2 className="text-center text-3xl font-bold mb-6">What Our Customers Say</h2>
          <div className="flex gap-4 justify-center">
            <Testimonial text="I love my new NFT watch! The quality is unmatched." author="Alex" />
            <Testimonial text="A unique blend of technology and style." author="Sam" />
            <Testimonial text="A unique blend of technology and style." author="Sam" />
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div
          className="upcoming-events-section bg-cover bg-center py-12"
          style={{ backgroundImage: "url(/event-img.png)" }}
        >
          <div className="bg-black bg-opacity-50 p-10 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Upcoming Events</h2>
            <p className="text-xl text-white mb-6">
              Join us for our next exclusive watch launch event this winter. Stay tuned for more details!
            </p>
            <button className="btn btn-primary" onClick={handleButtonClick}>
              Learn More
            </button>
          </div>
        </div>

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-xl">
              <p className="text-lg">New events are not available now, come back later !</p>
              <button className="btn btn-primary mt-4" onClick={closePopup}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="py-12">
          <h2 className="text-center text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccordionItem
              question="How do I purchase a watch NFT?"
              answer="Visit our marketplace and select the watch that resonates with you."
            />
            <AccordionItem
              question="Can I see the watch in person?"
              answer="Yes, appointments can be made to view our collection physically."
            />
            <AccordionItem
              question="What payment methods are accepted?"
              answer="We accept various cryptocurrencies and traditional payment methods."
            />
            <AccordionItem
              question="Is there a warranty on the watches?"
              answer="Yes, each watch comes with a manufacturer's warranty."
            />
            <AccordionItem
              question="How are the NFTs authenticated?"
              answer="Each NFT is verified for authenticity and linked to its physical counterpart."
            />
            {/* ...autres questions... */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
