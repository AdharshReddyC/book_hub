import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import FooterSection from '../FooterSection'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookDetails extends Component {
  state = {
    bookDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getBookDetails()
  }

  getFormattedData = book => ({
    id: book.id,
    authorName: book.author_name,
    coverPic: book.cover_pic,
    aboutBook: book.about_book,
    rating: book.rating,
    readStatus: book.read_status,
    title: book.title,

    aboutAuthor: book.about_author,
  })

  getBookDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.book_details)
      this.setState({
        bookDetails: updatedData,
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

  renderFailureView = () => (
    <div>
      <img
        src="https://res.cloudinary.com/dftcpr6nl/image/upload/v1667207668/home_failure_mwl54r.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button onClick={this.getBookDetails}>Try Again</button>
    </div>
  )

  renderBookDetails = () => {
    const {bookDetails} = this.state
    const {
      id,
      authorName,
      title,
      aboutAuthor,
      aboutBook,
      rating,
      readStatus,
      coverPic,
    } = bookDetails

    return (
      <div className="book-details-container">
        <div className="details-top-container">
          <img src={coverPic} alt={title} className="cover-pic" />

          <div className="overview-container">
            <h1 className="title">{title}</h1>
            <p className="author-name">{authorName}</p>
            <div className="rating-container">
              <p className="avg-rating">Avg Rating </p>
              <p className="rating">
                <span className="rating-icon">
                  <BsFillStarFill />
                </span>
                {rating}
              </p>
            </div>

            <div className="status-container">
              <p className="status">Status: </p>
              <p className="read-status"> {readStatus}</p>
            </div>
          </div>
        </div>
        <hr className="hor-line" />
        <div className="detailed-description-container">
          <h1 className="description-heading">About Author</h1>
          <p className="description-paragraph">{aboutAuthor}</p>
          <h1 className="description-heading">About Book</h1>
          <p className="description-paragraph">{aboutBook}</p>
        </div>
      </div>
    )
  }

  renderBookDetailsContainer = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBookDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="book-details-page">
        <Header />

        {this.renderBookDetailsContainer()}
        <FooterSection />
      </div>
    )
  }
}

export default BookDetails
