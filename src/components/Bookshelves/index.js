import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillStarFill, BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FooterSection from '../FooterSection'
import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Bookshelves extends Component {
  state = {
    bookshelfName: 'ALL',
    searchText: '',
    apiStatus: apiStatusConstants.initial,
    booksList: [],
    activeShelfId: bookshelvesList[0].id,
  }

  componentDidMount() {
    this.getBooks()
  }

  getBooks = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {bookshelfName, searchText} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${bookshelfName}&search=${searchText}`
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
        title: book.title,
        readStatus: book.read_status,
        rating: book.rating,
        authorName: book.author_name,
        coverPic: book.cover_pic,
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

  onClickShelf = event => {
    this.setState({bookshelfName: event.target.value}, this.getBooks)
  }

  onChangeSearchInput = event => {
    this.setState({searchText: event.target.value})
  }

  renderSearchSection = () => {
    const {bookshelfName, searchText} = this.state
    const shelfItem = bookshelvesList.filter(
      eachItem => eachItem.value === bookshelfName,
    )

    const shelf = shelfItem[0].label

    return (
      <div className="top-container">
        <h1 className="books-shelf-title">{shelf} Books</h1>
        <div className="search-container">
          <input
            type="search"
            onChange={this.onChangeSearchInput}
            value={searchText}
            className="search-input"
            placeholder="Search"
          />
          <button
            onClick={this.getBooks}
            type="button"
            testid="searchButton"
            className="search-button"
          >
            <BsSearch />
          </button>
        </div>
      </div>
    )
  }

  renderNavBar = () => {
    console.log('navbar')
    return (
      <nav className="nav-container">
        <h1 className="bookshelves-heading">Bookshelves</h1>
        <ul className="shelf-names-list">
          {bookshelvesList.map(eachItem => {
            const {bookshelfName} = this.state

            const isActive = eachItem.value === bookshelfName
            const shelfClassName = isActive
              ? `active-shelf-name-button`
              : `shelf-name-button`
            return (
              <li key={eachItem.id} className="shelf-name-list-item">
                <button
                  value={eachItem.value}
                  onClick={this.onClickShelf}
                  className={shelfClassName}
                >
                  {eachItem.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderBooks = () => {
    const {booksList, searchText} = this.state
    const shouldShowBooksList = booksList.length > 0

    return shouldShowBooksList ? (
      <ul className="books-list">
        {booksList.map(eachBook => {
          const {id, title, readStatus, rating, authorName, coverPic} = eachBook
          return (
            <Link to={`/books/${id}`} key={id} className="link-item">
              <li className="list-item">
                <img className="cover-image" src={coverPic} alt={title} />
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
              </li>
            </Link>
          )
        })}
      </ul>
    ) : (
      <div className="no-books-view">
        <img
          src="https://res.cloudinary.com/dftcpr6nl/image/upload/v1667216083/search_not_found_ujemaa.png"
          alt="no books"
        />
        <p>Your search for {searchText} did not find any matches.</p>
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

  renderBooksList = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBooks()
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
      <div className="shelf-page">
        <Header />
        <div className="navbar-and-bookslist-container">
          {this.renderNavBar()}
          <div className="search-and-bookslist-container">
            {this.renderSearchSection()}

            {this.renderBooksList()}
          </div>
        </div>

        <FooterSection />
      </div>
    )
  }
}

export default Bookshelves
