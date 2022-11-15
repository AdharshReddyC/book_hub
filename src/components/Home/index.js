import {Component} from 'react'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import FooterSection from '../FooterSection'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
  }

  state = {
    booksList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getBooks()
  }

  getBooks = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.books.map(book => ({
        id: book.id,
        authorName: book.author_name,
        coverPic: book.cover_pic,

        title: book.title,
      }))
      this.setState({
        booksList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  next() {
    this.Slider.slickNext()
  }

  previous() {
    this.slider.slickPrev()
  }

  renderBooksSlider = () => {
    const {booksList} = this.state

    return (
      <div className="slick-container">
        <Slider {...settings}>
          {booksList.map(eachBook => {
            const {id, authorName, coverPic, title} = eachBook
            return (
              <Link to={`/books/${id}`} key={id} className="link-item">
                <div className="slick-item">
                  <img className="logo-image" src={coverPic} alt={title} />
                  <h1 className="slider-title">{title}</h1>
                  <p className="slider-author">{authorName}</p>
                </div>
              </Link>
            )
          })}
        </Slider>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://res.cloudinary.com/dftcpr6nl/image/upload/v1667207668/home_failure_mwl54r.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button onClick={this.getBooks}>Try Again</button>
    </div>
  )

  renderPopularBooks = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBooksSlider()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {booksList} = this.state
    console.log(booksList)
    return (
      <div className="home-container">
        <Header className="header" />
        <div className="home-top-container">
          <h1 className="fav-books-heading">Find Your Next Favorite Books?</h1>
          <p className="home-description">
            You are in the right place. Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
          <Link to="/shelf">
            <button type="button" className="find-books-button">
              Find Books
            </button>
          </Link>
        </div>
        <div className="sliderContainer">
          <div className="slider-header">
            <h1 className="top-rated-heading">Top Rated Books</h1>
            <Link to="/shelf">
              <button type="button" className="findBooksButtonLarge">
                Find Books
              </button>
            </Link>
          </div>

          {this.renderPopularBooks()}
        </div>
        <FooterSection />
      </div>
    )
  }
}
export default Home
