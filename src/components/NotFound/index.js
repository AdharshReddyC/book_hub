import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dftcpr6nl/image/upload/v1667201882/page_not_found_no2zdg.png"
      alt="not found"
      className="not-found-img"
    />
    <h1>Page Not Found</h1>
    <p className="description">
      we are sorry, the page you requested could not be found
    </p>
    <Link to="/">
      <button className="go-to-home-button">Go Back to Home</button>
    </Link>
  </div>
)

export default NotFound
