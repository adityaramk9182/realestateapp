import React from 'react'
import { useParams } from 'react-router-dom'

const Listing = () => {
    const [listingData, setListingData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const params = useParams();

    React.useEffect(()=>{
        const fetchListing = async() => {
            try{
                setLoading(true);
                const res = await fetch(`/api/v1/listing/getlisting/${params.id}`);
                const data = await res.json();
                console.log(data);
                if(data.success === false){
                    setError(data.message);
                    setLoading(false);
                    console.log('fetch Error')
                }
                setLoading(false);
                setListingData(data);
            }catch(err){
                console.log(err)
            }
        }
        fetchListing()
    },[])

  return (
    <main className='flex justify-content-center align-items-center'>
        {
            loading ? 
            (<div>Loading</div>) :
            (<section className='flex flex-col justify-content-center align-items-center'>
            <section className='flex flex-col justify-content-center align-items-center'>
                <img className='listing-slideimage' src={listingData && listingData.imageUrls[0]} alt='imageslider'/>
                {
                    listingData && listingData.imageUrls.length > 1 ?
                    (<div className='flex justify-content-center align-items-center gap-3'>
                        {
                            listingData.imageUrls.map((item)=>{
                                return <img src={item} alt='image'/>
                            })
                        }
                    </div>) : null
                }
            </section>
            </section>)
        }
    </main>
  )
}

export default Listing