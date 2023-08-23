
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Server from '../../utils/Server'
import { CiUser, CiHome } from 'react-icons/ci'

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext)
  const Navigator = useNavigate()

  const logout = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    const res = Server.get('/user/logout',config )
    setUser(null)
    localStorage.clear()
    Navigator('/')
    return res
  }

  useEffect(() => {
    console.log("listening user")
  }, [user])



  return (
    <div className="navbar sticky top-0 right-0 left-0 z-50 bg-base-100 px-4 border-b pr-5">
      <div className="flex-1">
        <Link to="/" className=" normal-case text-2xl cursor-pointer font-semibold tracking-wider">Blogger</Link>
      </div>
      <div className="flex-none space-x-3">

        <Link to="/"><CiHome className="h-8 w-8 " /></Link>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-md btn-ghost btn-circle avatar">
            {user ? <img src={user.picture} className=' object-cover  rounded-full' />
            :<CiUser className="h-5/6 w-11/12"/>}
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            {user ? <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li> : null}
            <li><Link to="/write">Create Blog</Link></li>
            {!user ? <li><Link to="/signin">Login</Link></li> :
              <li onClick={logout}><a>Logout</a></li>
            }

            {user ? <li><a>Settings</a></li> : null}

          </ul>
        </div>

      </div>
    </div>
  )
}

export default Navbar


// {user ? <> <Link to="/">My Blogs</Link>
//           <Link to="/write">Create</Link>
//           <button onClick={logout}>logout</button>
//         </> :
//           <Link to="/signin">Login</Link>
//         }