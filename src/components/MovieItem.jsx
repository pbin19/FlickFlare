import React, { useState } from 'react';
import { createImageUrl } from '../services/movieServices';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoIosClose } from 'react-icons/io';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext';
import { db } from '../services/firebase';

const MovieItem = ({ movie }) => {
    const { title,release_date, backdrop_path, poster_path, overview } = movie;
    const [like, setLike] = useState(false);
    const [showOverview, setShowOverview] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const { user } = UserAuth();

    const markFavShow = async () => {
        const userEmail = user?.email;
        if (userEmail) {
            const userDoc = doc(db, 'users', userEmail);
            const newLike = !like; // Toggle the like state
            setLike(newLike); // Update the like state
            await updateDoc(userDoc, {
                favShows: arrayUnion({ ...movie }),
            });
        } else {
            alert('Login to save a movie');
        }
    };

    const playTrailer = async () => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                    `${title} trailer`
                )}&key=AIzaSyCM0JY_sLy5kfD5z0C4n1YMf3skSIx_vro&type=video&videoEmbeddable=true`
            );
            const data = await response.json();
            const videoId = data.items[0]?.id.videoId;

            if (videoId) {
                window.open(`https://www.youtube.com/watch?v=${videoId}`);
            } else {
                console.error('No trailer found');
            }
        } catch (error) {
            console.error('Error fetching trailer:', error);
        }
    };

    const toggleOverview = () => {
        setShowOverview(!showOverview);
        setShowCloseButton(!showCloseButton);
    };

    const closeOverview = () => {
        setShowOverview(false);
        setShowCloseButton(false);
    };

    return (
        <div className="relative w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block rounded-lg overflow-hidden cursor-pointer m-2">
            <div className="relative">
                <img
                    className="w-full h-40 block object-cover object-top"
                    src={createImageUrl(backdrop_path ?? poster_path, 'w500')}
                    alt={movie.title}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/80 opacity-0 hover:opacity-100">
                    <p onClick={playTrailer} className="whitespace-normal text-xs md:text-sm flex justify-center items-center h-full font-nsans-bold">
                        {movie.title}
                    </p>
                    <div className="cursor-pointer">
                        {/* Call markFavShow when heart icon is clicked */}
                        {like ? (
                            <FaHeart size={20} className="absolute top-2 left-2 text-gray-300" onClick={markFavShow} />
                        ) : (
                            <FaRegHeart size={20} className="absolute top-2 left-2 text-gray-300" onClick={markFavShow} />
                        )}
                        <AiOutlineInfoCircle
                            size={20}
                            className="absolute top-2 right-2 text-gray-300 cursor-pointer"
                            onClick={toggleOverview}
                        />
                    </div>
                </div>
            </div>
            {showOverview && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-4 overflow-y-auto rounded-lg z-50">
                    <div className="max-w-md  m-8">
                        <div className="flex py-10 justify-between items-center mb-2">
                            <h2 className=" text-xl font-semibold">{movie.title}</h2>
                            {showCloseButton && (
                                <IoIosClose
                                    size={40}
                                    className="text-gray-300 cursor-pointer"
                                    onClick={closeOverview}
                                />
                            )}
                        </div>
                        
                        <p className=" text-left whitespace-pre-line">{release_date}</p>
                        <p className="py-10 text-left whitespace-pre-line">{overview}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieItem;
