import React from 'react'
// import CollegeStatusCard from '../GComponents/CollegeStatusCard'
// import { FaSearchengin } from "react-icons/fa6";
// import React, { useEffect, useRef, useState } from 'react';
// import { FaSearchengin } from "react-icons/fa6";
import HighlightPlaceCard from '../../component/HighlightPlaceCard';
import HighlightCompanyCard from '../../component/HighlightCompanyCard'


const Highlight = () => {

  return (
    <div className='flex-grow  rounded-l-3xl'>
      <div className="relative flex flex-col flex-1  h-[100vh] rounded-l-[35px] w-[70%] overflow-y-auto scrollbar-hide">
      <div>
      
        <h1 className="text-[28px] text-center w-full font-bold p-2 mt-4 text-[rgb(22,22,59)]">
          Top Placements
        </h1>
        <div className=' w-full h-[350px] items-start overflow-y-auto scrollbar-hide'>
              
        <HighlightPlaceCard />

        </div>

        <h1 className="text-[28px] text-center w-full font-bold p-2 mt-7 text-[rgb(22,22,59)]">
          Top Companies
        </h1>
        <div className=' w-full h-[270px] items-start overflow-y-auto scrollbar-hide'>
            <HighlightCompanyCard/>
        </div>
      </div>
    </div>
    </div>
    
  )
}

export default Highlight
