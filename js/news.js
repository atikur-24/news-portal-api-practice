let loadData = [];
// load data in news api
const loadCategories= async () => {
    const URL = 'https://openapi.programming-hero.com/api/news/categories';
    try {
        const res = await fetch(URL);
        const data = await res.json();
        showCategories(data.data.news_category)
    } catch (error) {
        console.log(error)
    }
}

// show the news categories
const showCategories = (data) => {
    // capture categories container to append all the category link
    const categoriesContainer = document.getElementById('categories-container');
    data.forEach(singleCategory => {
        categoriesContainer.innerHTML += `<a onclick="loadCategoriesNews('${singleCategory.category_id}', '${singleCategory.category_name}')" class="nav-link" href="#">${singleCategory?.category_name}</a>`;
    })
}

// fetch all news available in a category
const loadCategoriesNews = async (categoryId, categoryName) => {
    const URL = `https://openapi.programming-hero.com/api/news/category/${categoryId}`;
     try {
        const res = await fetch(URL);
        const data = await res.json();
        loadData = data.data;
        showAllNews(data.data, categoryName);
     }
     catch (error) {
        console.log(error);
     }
}

// show all news name and count in alert box and display card in news
const showAllNews = (data, categoryName) => {
    document.getElementById('news-count').innerText = data.length;
    document.getElementById('category-name').innerText = categoryName;
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    data.forEach(singleNews => {
        const { _id, title, thumbnail_url, details, author, total_view, rating } = singleNews;
        const { img, name, published_date } = author;
        newsContainer.innerHTML +=`
        <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4 p-3">
            <img src="${thumbnail_url ? thumbnail_url : 'image not available'}" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8 d-flex flex-column">
            <div class="card-body">
              <h5 class="card-title fw-bold mb-3">${title ? title : 'Not available'}</h5>
              <p class="card-text text-secondary-emphasis">${details.slice(0, 200)}...</p>
            </div>
            <div class="card-footer border-0 bg-body d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex gap-3 align-items-center justify-content-center">
                  <img height="40px" width="40px" src="${img ? img : 'image not found'}" class="img-fluid rounded-circle" alt="...">
                  <div>
                    <p class= "mb-0">${name ? name : 'Not available'}</p>
                    <p class= "mb-0 text-muted">${published_date ? published_date : 'published date not found'}</p>
                  </div>
                </div>
                <div class="d-flex gap-3">
                  <i class="fas fa-eye"></i>
                  <p>${total_view ? total_view : 'Not available'}</p>
                </div>
                <div class="d-flex gap-3">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star-half"></i>
                  <p>${rating.number ? rating.number : 'Not available'}</p>
                </div>
                <div class="mb-3">
                  <button onclick="loadNewsDetails('${_id}')" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#newsDetails">details</button>
                </div>
            </div>
          </div>
        </div>
      </div>
        `
    })
}

// load new details
const loadNewsDetails = newsId => {
  const URL =`https://openapi.programming-hero.com/api/news/${newsId}`;
  fetch(URL)
    .then(res => res.json())
    .then(data => showNewsDetails(data.data[0]))
}

// show news details
const showNewsDetails = newsDetails => {
  const {title, details, others_info} = newsDetails;
  document.getElementById('modal-title').innerText =`${title ? title : 'Title Not found'}`;
  document.getElementById('badge').innerText =`${others_info.is_trending ? 'Trending' : ''}`;
  document.getElementById('details-news').innerText =`${details ? details : 'Details not available'}`;
}

// show trending news
const showTrending = () => {
  const trendingNews = loadData.filter(singleData => singleData.others_info.is_trending === true);
  const categoryName = document.getElementById('category-name').innerText; 
  showAllNews(trendingNews, categoryName);
}

const showTodayPick = () => {
  const todayPickNews = loadData.filter(singleNews => singleNews.others_info.is_todays_pick === true);
  const todayPickName = document.getElementById('category-name').innerText;
  showAllNews(todayPickNews, todayPickName);
}