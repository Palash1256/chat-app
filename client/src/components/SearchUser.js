import React, { useEffect, useState } from 'react'
import { GoSearch } from "react-icons/go";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast'
import axios from 'axios';
import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const currentUser = useSelector(state => state.user)

  const handelSearchUser = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true)
      const response = await axios.post(URL, {
        search: search
      })
      setLoading(false)
      // Filter out current user
      const filteredUsers = response.data.data.filter(
        user => user._id !== currentUser._id
      )
      setSearchUser(filteredUsers)

    }


    catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    handelSearchUser()
  }, [search])

  //console.log("searchUser",searchUser)

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10 overflow-auto'>
      <div className='w-full max-w-md mx-auto  mt-10' >
        {/* input search user */}
        <div className='bg-white rounded h-14 overflow-hidden flex position:sticky'>
          <input
            type='text'
            placeholder='Search usdrd by name, email...'
            className='w-full outline-none py-1 h-full px-4'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className='h-14 w-14 flex justify-center items-center'>
            <GoSearch size={20} />
          </div>
        </div>
        {/* display search user  */}
        <div className='bg-white mt-2 w-full p-4 rounded overflow-auto'>
          {/* no user found */}
          {
            searchUser.length === 0 && !loading && (
              <p className=' text-center text-slate-500'>No user found!</p>
            )
          }
          {
            loading && (
              <div className='flex justify-center'><Loading /></div>
            )
          }

          {
            searchUser.length !== 0 && !loading && (
              searchUser.map((user, index) => {
                return (
                  <UserSearchCard key={user._id} user={user} onClose={onClose} />
                )
              })
            )
          }
        </div>
      </div>

      <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white' onClick={onClose}>
        <button><IoCloseOutline size={25} /></button>
      </div>
    </div>
  )
}

export default SearchUser
