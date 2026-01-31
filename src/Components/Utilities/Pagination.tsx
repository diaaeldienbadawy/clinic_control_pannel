import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { useNav } from '../../MyLib/Structure/CustomHock/useNav';
import { Params, useLocation, useNavigate, useParams } from 'react-router-dom';

const Pagination = (props:{pagesCount?:number,initial:number, path?:string , onPageChange?:(page:string)=>void}) => {
    const location = useLocation()
    const navigator = useNavigate()

    const [loaded, setLoaded] = useState(false)

    const updatePage = (page:string)=>{
        const searchParams = new URLSearchParams(location?.search);
        if(page != searchParams.get('page')){
          searchParams.set('page', page);
          navigator({
              pathname: location?.pathname,
              search: searchParams.toString()
            }, { replace: true });
        }

    }

    const handlePageClick = (event: { selected: number }) => {
      const page= (event.selected+1).toString()
      updatePage(page)
      if(loaded){
        if(props.onPageChange)props.onPageChange(page)
      }
      else setLoaded(true)
    };
    
      return (
        <ReactPaginate
          breakLabel="..."
          nextLabel="التالى"
          onPageChange={(a)=>handlePageClick(a)}
          pageRangeDisplayed={3}
          
          initialPage={Number( new URLSearchParams(location?.search).get('page'))?Number( new URLSearchParams(location?.search).get('page'))-1:props.initial}
          pageCount={props.pagesCount??1}
          previousLabel="السابق"
          renderOnZeroPageCount={null}
          className='pagination d-flex flex-wrap justify-content-center c-pointer'

          nextLinkClassName='py-1 px-3 border rounded-start-3 bg-hover-gray text-decoration-none color-I'
          previousLinkClassName='py-1 px-3 border rounded-end-3 bg-hover-gray text-decoration-none color-I'
          pageLinkClassName='py-1 px-3 border rounded-0 bg-hover-gray text-decoration-none  color-I'
          breakLinkClassName='py-1 px-3 border rounded-0 bg-hover-gray text-decoration-none color-I'
          activeLinkClassName='py-1 px-3 border rounded-0 text-decoration-none btn-clr-II'

          nextClassName='py-2'
          previousClassName='py-2'
          pageClassName='py-2'
          breakClassName='py-2'


        />
      );
}

export default Pagination
