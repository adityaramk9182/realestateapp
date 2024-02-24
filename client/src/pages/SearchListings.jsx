import React from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

const SearchListings = () => {
  const [filterSearch, setFilterSearch] = React.useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "created_at",
    order: 'desc'
  });
  const [loading, SetLoading] = React.useState(false)
  const [listings, SetListings] = React.useState([])
  const [showmore, SetShowMore] = React.useState(false)
  const navigate = useNavigate();

  const handleOnchange = (e) => {
    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
      setFilterSearch({...filterSearch, type : e.target.value});
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFilterSearch({...filterSearch, [e.target.id] : e.target.checked || e.target.checked === 'true' ? true : false});
    }

    if(e.target.id === 'searchTerm'){
      setFilterSearch({...filterSearch, searchTerm : e.target.value});
    }

    if(e.target.id === 'sort_order'){
      let sort = e.target.value.split('_')[0] || 'created_at';
      let order = e.target.value.split('_')[1] || 'desc';
      setFilterSearch({...filterSearch, sort, order});
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', filterSearch.searchTerm);
    urlParams.set('type', filterSearch.type);
    urlParams.set('parking', filterSearch.parking);
    urlParams.set('furnished', filterSearch.furnished);
    urlParams.set('offer', filterSearch.offer);
    urlParams.set('sort', filterSearch.sort);
    urlParams.set('order', filterSearch.order);
    const searchParam = urlParams.toString();
    navigate(`/search?${searchParam}`)
  }

  React.useState(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get('searchTerm');
    const typeUrl = urlParams.get('type');
    const parkingUrl = urlParams.get('parking');
    const furnishedUrl = urlParams.get('furnished');
    const offerUrl = urlParams.get('offer');
    const sortUrl = urlParams.get('sort');
    const orderUrl = urlParams.get('order');

    if (
      searchTermUrl ||
      typeUrl ||
      parkingUrl ||
      furnishedUrl ||
      offerUrl ||
      sortUrl ||
      orderUrl
    ) {
      setFilterSearch({
        searchTerm:searchTermUrl || '',
        type:typeUrl || 'all',
        parking:parkingUrl === 'true' ? true : false,
        furnished:furnishedUrl === 'true' ? true : false,
        offer:offerUrl === 'true' ? true : false,
        sort:sortUrl || 'created_at',
        order:orderUrl || 'desc'
      });

      const fetchListings = async() => {
        try{
          SetLoading(true);
          const searchQuery = urlParams.toString();
          const res = await fetch(`/api/v1/listing/all-listings?${searchQuery}`);
          const data = await res.json();
          SetListings(data.Listings);
          SetLoading(false);
          if (data.Listings.length > 9) {
            SetShowMore(true)
          }
        }catch(err){
          console.log(err)
        }
      }
      fetchListings();
    }
    },[window.location.search])

  const handleShowMore = () => {
    const totalListings = listings.length;
    const startIndex = totalListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString();
    const res = fetch(`/api/v1/listing/all-listings?${searchQuery}`)
    const data = res.json();
    if (data.Listings.length < 9) {
      SetShowMore(false)
    }
    SetListings([...listings, ...data.Listings]);
  }

  return (
    <main className="flex flex-col md:flex-row gap-2">
      <section className="p-7 border-b-2 md:border-r-2 md:min-h-screen font-semibold text-slate-600">
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Search Term :</label>
            <input
              className="border rounded-lg p-3 w-auto"
              type="text"
              id="searchTerm"
              placeholder="search.."
              value={filterSearch.searchTerm}
              onChange={handleOnchange}
            />
          </div>

          <div className="flex justify-start items-start gap-2">
            <p>Type :</p>
            <div className="flex justify-center items-center gap-1">
              <input 
                type="checkbox" 
                id='all'
                onChange={handleOnchange}
                checked={filterSearch.type === 'all'}
              />
              <label>Rent & Sale</label>
            </div>
            <div className="flex justify-center items-center gap-1">
              <input 
                type="checkbox" 
                id='rent'
                onChange={handleOnchange}
                checked={filterSearch.type === 'rent'}
              />
              <label>Rent</label>
            </div>
            <div className="flex justify-center items-center gap-1">
              <input 
                type="checkbox" 
                id='sale'
                onChange={handleOnchange}
                checked={filterSearch.type === 'sale'}
              />
              <label>Sale</label>
            </div>
            <div className="flex justify-center items-center gap-1">
              <input 
                type="checkbox" 
                id='offer'
                onChange={handleOnchange}
                checked={filterSearch.offer}
              />
              <label>Offer</label>
            </div>
          </div>

          <div className="flex justify-start items-start gap-2">
            <p>Amenities :</p>
            <div className="flex justify-center items-center gap-1">
              <input 
                type="checkbox" 
                id='parking'
                onChange={handleOnchange}
                checked={filterSearch.parking}
              />
              <label>Parking</label>
            </div>
            <div className="flex justify-center items-center gap-1">
              <input 
                type="checkbox" 
                id='furnished'
                onChange={handleOnchange}
                checked={filterSearch.furnished}
              />
              <label>Furnished</label>
            </div>
          </div>

          <div className="flex justify-start items-center gap-2">
            <label>Sort By :</label>
            <select id="sort_order" defaultValue={'created_at_desc'} className="border rounded-md p-3" onChange={handleOnchange}>
              <option value="regularPrice_desc">Latest</option>
              <option value="regularPrice_asc">Oldest</option>
              <option value="createdAt_desc">High Price</option>
              <option value="createdAt_asc">Low Price</option>
            </select>
          </div>

          <div>
            <button type="submit" className="border rounded-md text-white bg-gray-600 w-full p-2 uppercase hover:opacity-95">
              Search
            </button>
          </div>
        </form>
      </section>

      <section className="flex flex-col justify-start items-start gap-2">
        <h1 className="text-2xl text-slate-700 border-b font-semibold p-3 mt-5">Listing results :</h1>

        <div className="flex flex-wrap gap-4">
        {!loading && listings.length === 0 && (
          <p className="text-md text-center">No Listings Found</p>
        )}

        {loading && (
          <p className="text-xl text-center">Loading...</p>
        )}

        {!loading && listings.length > 0 && (
          listings.map((item, index)=>{
            return(
              <div className="p-2">
                <ListingCard key={index} listing={item}/>
              </div>
            )
          })
        )}
        </div>
        {showmore && (<div className="flex justify-center items-center w-full">
          <button className="text-green-600 text-lg bg-transparent hover:border-b-2 border-green-600" onClick={handleShowMore}>show more</button>
        </div>)}
      </section>
    </main>
  );
};

export default SearchListings;
