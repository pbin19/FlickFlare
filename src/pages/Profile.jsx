import React, { useEffect, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { UserAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { createImageUrl } from '../services/movieServices';
import { arrayRemove, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { AiOutlineClose } from 'react-icons/ai';

const Profile = () => {
  const [movies, setMovies] = useState([]);
  const { user } = UserAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      if (user) {
        const docRef = doc(db, 'users', `${user.email}`);
        onSnapshot(docRef, (doc) => {
          if (doc.exists()) setMovies(doc.data().favShows);
        });
      }
    };
    fetchMovies();
  }, [user]);

  const slide = (offset) => {
    const slider = document.getElementById('slider');
    slider.scrollLeft += offset;
  };

  const handleUnlikeShow = async (movie) => {
    const userDoc = doc(db, 'users', user.email);
    await updateDoc(userDoc, {
      favShows: arrayRemove(movie),
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Fetching shows...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <img className='block w-full h-[500px] object-cover' src="/background_pic.png" alt="Banner" />
        <div className='bg-black/0 fixed top-0 left-0 w-full h-[500px]'>
          <div className='absolute top-[20%] p-4 md:p-8'>
            <h1 className='text-3xl md:text-5xl font-nsans-bold my-2'>My Shows</h1>
            <p className='font-nsans-light text-gray-400 text-lg'>{user.email}</p>
          </div>
        </div>

        <h2 className='font-nsans-bold md:text-xl p-4 capitalize'>Fav Shows</h2>
        <div className='relative flex items-center'>
          <MdChevronLeft onClick={() => slide(-500)} className='bg-white rounded-full absolute left-2 opacity-80 text-gray-700 z-10  group-hover:block cursor-pointer' size={25} />

          <div id={`slider`} className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide'>
            {movies.map((movie) => (
              <div key={movie.id} className='relative w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block rounded-lg overflow-hidden cursor-pointer m-2'>
                <img className='w-full h-40 block object-cover object-top' src={createImageUrl(movie.backdrop_path ?? movie.poster_path, "w500")} alt={movie.title} />
                <div className='absolute top-0 left-0 w-full h-40 bg-black/80 opacity-0 hover:opacity-100'>
                  <p className='whitespace-normal text-xs md:text-sm flex justify-center items-center h-full font-nsans-bold'>{movie.title}</p>
                  <AiOutlineClose onClick={() => handleUnlikeShow(movie)} size={20} className='absolute top-2 right-2 cursor-pointer' />
                </div>
              </div>
            ))}
          </div>

          <MdChevronRight onClick={() => slide(500)} className='bg-white rounded-full absolute right-2 opacity-80 text-gray-700 z-10  group-hover:block cursor-pointer' size={25} />
        </div>

      </div>
    </div>
  );
}

export default Profile;
