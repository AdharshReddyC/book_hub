import Popup from 'reactjs-popup'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {IoMdClose} from 'react-icons/io'
import {AiFillHome} from 'react-icons/ai'
import {BsInfoCircleFill} from 'react-icons/bs'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://res.cloudinary.com/dftcpr6nl/image/upload/v1667195295/website_logo_r0dym4.png"
              alt="website logo"
            />
          </Link>

          <Popup
            modal
            trigger={
              <button className="hamburger-icon-button" type="button">
                <GiHamburgerMenu size="30" />
              </button>
            }
            className="popup-content"
          >
            {close => (
              <div className="modal-container">
                <button
                  className="close-button"
                  type="button"
                  onClick={() => close()}
                >
                  <IoMdClose size="30" color="#616e7c" />
                </button>
                <ul className="nav-links-list">
                  <li className="nav-link-item">
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                  </li>
                  <li className="nav-link-item">
                    <Link to="/shelf" className="nav-link">
                      Bookshelves
                    </Link>
                  </li>
                  <li className="nav-link-item">
                    <button
                      type="button"
                      onClick={onClickLogout}
                      className="logout-mobile-btn"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </Popup>
        </div>

        <div className="nav-bar-large-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://res.cloudinary.com/dftcpr6nl/image/upload/v1667195295/website_logo_r0dym4.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/shelf" className="nav-link">
                Bookshelves
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)
