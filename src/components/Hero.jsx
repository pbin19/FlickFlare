import React, { useEffect, useState } from 'react'
import endpoints, { createImageUrl } from '../services/movieServices';
import axios from 'axios';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext';
import { db } from '../services/firebase';

const Hero = () => {
    const [like, setLike] = useState(false);
    const { user } = UserAuth();

    const markFavShow = async () => {
        const userEmail = user?.email;
        if (userEmail) {
            const userDoc = doc(db, 'users', userEmail);
            setLike(!like);
            await updateDoc(userDoc, {
                favShows: arrayUnion({ ...movie }),
            });
        } else {
            alert('Login to save a movie');
        }
    };

    const [movie, setMovie] = useState({});
    useEffect(() => {
        axios.get(endpoints.popular).then((response) => {
            const movies = response.data.results;
            const randomMovie = movies[Math.floor(Math.random() * movies.length)]
            setMovie(randomMovie);
        })
    }, []);

    const truncate=(str,length)=>{
        if(!str) return "";
        return str.length>length?str.slice(0,length)+"...":str;
    }
    const playTrailer = async () => {
        // Fetch trailer using YouTube Data API
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                    `${title} trailer`
                )}&key=AIzaSyCM0JY_sLy5kfD5z0C4n1YMf3skSIx_vro&type=video&videoEmbeddable=true`
            );
            const data = await response.json();
            const videoId = data.items[0]?.id.videoId;

            // Open trailer in a new window
            if (videoId) {
                window.open(`https://www.youtube.com/watch?v=${videoId}`);
            } else {
                console.error('No trailer found');
            }
        } catch (error) {
            console.error('Error fetching trailer:', error);
        }
    };
    if (!movie)
        return (
            <>
                <p>fetching movie...</p>
            </>
        );
    const{title,backdrop_path,release_date,overview}=movie;
    
    return (
        <div className='w-full h-[550px] lg:h-[850px]' >
            <div className='w-full h-full'>
                <div className='absolute w-full h-[550px] lg:h-[850px] bg-gradient-to-r from-black'/>
                    <img 
                    className='w-full h-full object-cover object-top'
                    src={createImageUrl(backdrop_path,"original")} alt={title}/>
                    <div className='bg-black/40 fixed top-0 left-0 w-full h-full'/>
        
                <div className=' absolute w-full top-[20%] lg:top-[35%] p-4 md:p-8'>
                    <h1 className='text-3xl md:text-6xl font-nsans-bold'>{title}</h1>
                    <div className='mt-8 mb-4'>
                        <button onClick={playTrailer} className='capitalize border bg-[#fca312] text-black py-2 px-6'>play</button>
                        <button onClick={markFavShow} className='capitalize border border-gray-300 py-2 px-5 ml-4 focus:bg-gray-300 focus:text-black'>Favorite</button>
                    </div>
                    <p className='text-gray-400 text-sm'>{release_date}</p>
                    <p className='w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200'>{truncate(overview,165)}</p>
                </div>
            </div>
        </div>
    )
}

export default Hero