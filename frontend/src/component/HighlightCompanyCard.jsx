import React, { useEffect, useRef, useState } from 'react';


const HighlightCompanyCard = () => {

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

              
                <div className='bg-[#ffffff49] p-4 text-center flex flex-col flex-1 items-center justify-center h-[200px] w-[200px] rounded-2xl border border-[#ffffff87] shadow-lg shadow-[#0000009b]'>
                    <img src="https://media.istockphoto.com/id/1313644269/vector/gold-and-silver-circle-star-logo-template.jpg?s=612x612&w=0&k=20&c=hDqCI9qTkNqNcKa6XS7aBim7xKz8cZbnm80Z_xiU2DI=" 
                        alt="Student Image" 
                        className='h-[80px] w-[80px] object-cover rounded-xl'/>
                    <ul className="list-none m-0 text-[rgb(22,22,59)]">
                        <li className="text-xl mt-3 font-extrabold text-[rgb(22,22,59)]">
                            <strong>Company Name</strong>
                        </li>
                        
                    </ul>
                </div>


            </div>
          ))}
        </div>
  )
}

export default HighlightCompanyCard
