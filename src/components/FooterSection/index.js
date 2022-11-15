import './index.css'
import {FaGoogle, FaInstagram, FaTwitter, FaYoutube} from 'react-icons/fa'

const FooterSection = () => (
  <div className="footer-container">
    <div className="icons-container">
      <button className="icon">
        <FaGoogle />
      </button>
      <button className="icon">
        <FaInstagram />
      </button>
      <button className="icon">
        <FaTwitter />
      </button>
      <button className="icon">
        <FaYoutube />
      </button>
    </div>
    <p className="contact-us">Contact us</p>
  </div>
)

export default FooterSection
