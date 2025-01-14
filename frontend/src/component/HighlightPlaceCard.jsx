// import React from 'react'

// const HighlightPlaceCard = () => {
//   return (
//     <div className='bg-[#ffffff89] p-5 text-center justify-items-center h-[270px] w-[230px] rounded-2xl border border-[#ffffff] shadow-lg shadow-[#0000009b]'>
//       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2VUAIsETs2BVS1XRsMmMv4YkyovdUxJRRvw&s" alt="Student Image" className='h-[100px] w-[90px] object-cover rounded-xl'/>
//       <ul className="list-none m-0 text-[rgb(22,22,59)]">
//               <li className="text-xl mt-3 font-extrabold text-[rgb(22,22,59)]">
//                 <strong>Student Name</strong>
//                 <div className="flex items-center justify-center text-base font-bold px-3 mb-1 gap-5 text-[rgb(22,22,59)]">
//                  <p>Branch</p> <p>Sem</p>
//                 </div>
//               </li>
//               <li>
//                 <h6 className="text-xl font-bold px-3 text-[rgb(48,48,128)]">
//                   Web Developer
//                 </h6>
//               </li>
              
//               <li className="text-base flex items-center">
//                 <strong>Package :</strong>
//                 <h6 className=" font-bold text-green-600 uppercase ml-1 px-3">
//                   10LPA CTC
//                 </h6>
//               </li>
//             </ul>
//     </div>
//   )
// }

// export default HighlightPlaceCard








import React, { useEffect, useRef, useState } from 'react';


const HighlightPlaceCard = () => {

  const scrollContainer = useRef(null);
    const [centerCardIndex, setCenterCardIndex] = useState(0);
    const cardWidth = 250; // Width for each card
    const gap = 20; // Gap between cards
    const totalCards = 8; // Total number of unique cards
    const infiniteMultiplier = 50; // Multiplier for infinite scrolling
  
    useEffect(() => {
      const container = scrollContainer.current;
      let isUserInteracting = false;
  
      // Infinite scroll logic
      const handleScroll = () => {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const visibleWidth = container.clientWidth;
  
        // Check for boundaries to reset the scroll position
        if (container.scrollLeft >= maxScrollLeft) {
          container.scrollLeft = container.scrollLeft - maxScrollLeft + visibleWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft = maxScrollLeft - visibleWidth;
        }
  
        // Update centered card index
        const scrollPosition = container.scrollLeft + container.offsetWidth / 2.5; // Center of the visible area
        const rawIndex = Math.round(scrollPosition / (cardWidth + gap));
        const adjustedIndex = rawIndex % totalCards; // Map to original card index
        setCenterCardIndex(adjustedIndex < 0 ? adjustedIndex + totalCards : adjustedIndex);
      };
  
      const autoScroll = () => {
        if (!isUserInteracting) {
          container.scrollLeft += 5; // Adjust scroll speed here
        }
      };
  
      // Detect user interaction to pause auto-scrolling
      const handleMouseDown = () => (isUserInteracting = true);
      const handleMouseUp = () => (isUserInteracting = false);
  
      container.addEventListener('scroll', handleScroll);
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseup', handleMouseUp);
  
      const scrollInterval = setInterval(autoScroll, 20);
  
      return () => {
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseup', handleMouseUp);
        clearInterval(scrollInterval);
      };
    }, []);


  return (

        <div
          className="flex items-center w-full h-[100%] overflow-x-auto scrollbar-hide relative"
          ref={scrollContainer}
          style={{ scrollBehavior: 'smooth' }}
        >
          {Array.from({ length: totalCards * infiniteMultiplier }).map((_, index) => (
            <div
              key={index}
              className={`college-card relative transition-all duration-500 ${
                index % totalCards === centerCardIndex ? 'scale-110 blur-0 z-10' : 'scale-90 blur-sm'
              }`}
              style={{
                minWidth: `${cardWidth}px`,
                minHeight: '200px',
                margin: `0 ${gap / 2}px`,
              }}
            >

              
                <div className='bg-[#ffffff6f] p-5 text-center justify-items-center h-[270px] w-[230px] rounded-2xl border border-[#ffffffc4] shadow-lg shadow-[#0000009b]'>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2VUAIsETs2BVS1XRsMmMv4YkyovdUxJRRvw&s" alt="Student Image" className='h-[100px] w-[90px] object-cover rounded-xl'/>
                    <ul className="list-none m-0 text-[rgb(22,22,59)]">
                            <li className="text-xl mt-3 font-extrabold text-[rgb(22,22,59)]">
                            <strong>Student Name</strong>
                            <div className="flex items-center justify-center text-base font-bold px-3 mb-1 gap-5 text-[rgb(22,22,59)]">
                                <p>Branch</p> <p>Sem</p>
                            </div>
                            </li>
                            <li>
                            <h6 className="text-xl font-bold px-3 text-[rgb(48,48,128)]">
                                Web Developer
                            </h6>
                            </li>
                            
                            <li className="text-base flex items-center">
                            <strong>Package :</strong>
                            <h6 className=" font-bold text-green-600 uppercase ml-1 px-3">
                                10LPA CTC
                            </h6>
                            </li>
                        </ul>
                </div>


            </div>
          ))}
        </div>
  )
}

export default HighlightPlaceCard
