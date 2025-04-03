import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logOut } = UserAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false); // Assuming user data loading is complete once component mounts
    }, []);

    if (loading) {
        return null; // Render nothing while user data is loading
    }
    const handleLogout = async () => {
        try {
            await logOut()
            navigate('/')
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className='absolute w-full p-4 flex item-center justify-between z-50'>
            <Link to={'/'}>
                {/* <h1 className='uppercase text-[#fca312] font-nsans-bold cursor-pointer text-5xl'>netflix</h1> */}
                <img src="/logo_white.png" className='w-[320px] ml-[-10px]'/>
            </Link>

            {
                user?.email ? (
                    <div>
                        <Link to='/profile'>
                            <button className='capitalize pr-4'>profile</button>
                        </Link>
                        <button onClick={handleLogout} className='capitalize bg-[#fca312] px-6 py-2 rounded cursor-pointer'>logout</button>
                    </div>
                ) : (
                    <div>
                        <Link to='/login'>
                            <button className='capitalize pr-4'>login</button>
                        </Link>
                        <Link to='/signup'>
                            <button className='capitalize bg-[#fca312] px-6 py-2 rounded cursor-pointer'>signup</button>
                        </Link>
                    </div>
                )
            }
        </div >
    )
}

export default Navbar
