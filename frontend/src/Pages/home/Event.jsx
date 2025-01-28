import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import event1 from "../../assets/event1.jpg";
import event2 from "../../assets/event2.jpeg";
import event3 from "../../assets/event3.jpeg";
import event4 from "../../assets/event4.jpeg";
import event5 from "../../assets/event5.jpeg";
import event6 from "../../assets/event6.jpeg";
import { FaTools } from "react-icons/fa";

const Event = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroImages = [
    {
      src: event1,
      alt: "DJ Performance 1",
    },
    {
      src: event2,
      alt: "DJ Performance 2",
    },
    {
      src: event3,
      alt: "DJ Performance 3",
    },
    {
      src: event4,
      alt: "DJ Performance 4",
    },
    {
      src: event5,
      alt: "DJ Performance 5",
    },
    {
      src: event6,
      alt: "DJ Performance 6",
    },
  ];

  const events = [
    {
      title: "ENDLESS REMIX",
      date: "MARCH 29, 2023",
      description:
        "The first remix is from DJB, who is well known for many great releases on his own label.",
      image: event1,
    },
    {
      title: "BURNING MAN",
      date: "MARCH 24, 2023",
      description:
        "I know what I was doing. I was going to Burning Man, but what I did not know was just how lit it would be.",
      image: event2,
    },
    {
      title: '"VENTO EP" ENDLESS',
      date: "MARCH 15, 2023",
      description:
        "In the wake of what has been a most creative year, VENTO EP is now out!",
      image: event3,
    },
  ];

  useEffect(() => {
    if (emblaApi) {
      const intervalId = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);

      emblaApi.on("select", () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      });

      return () => {
        clearInterval(intervalId);
        emblaApi.off("select");
      };
    }
  }, [emblaApi]);

  return (
    <div className="h-screen p-4  rounded-l-[35px] overflow-y-auto scrollbar-hide">
      <marquee behavior="scroll" direction="left" scrollamount="10">
        <code className="flex items-center gap-2 text-xs sm:text-sm text-green-500 font-medium">
          Page  under maintenance. We’ll be back shortly{" "}
          <FaTools className="text-green-500" size={16} />
        </code>
      </marquee>{" "}
      {/* Image Carousel */}
      <div className="relative lg:h-[80vh] h-[40vh] ">
        <div
          ref={emblaRef}
          className="h-full w-full overflow-hidden rounded-[25px] shadow-[#0000005c] shadow-lg"
        >
          <div className="flex h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] h-full rounded-[25px] relative"
              >
                {/* Slide Image */}
                <div
                  className="h-full w-full bg-cover bg-center rounded-[25px]"
                  style={{
                    backgroundImage: `url(${image.src})`,
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[rgba(219,39,120,0.96)] via-transparent to-transparent rounded-[25px]" />

                  {/* Event Text Content */}
                  <div className="absolute inset-y-0 left-0 p-8 text-white flex flex-col justify-center max-w-[60%]">
                    <h2 className="lg:text-[60px] text-[30px] font-black">
                      Event Title
                    </h2>
                    <p className="lg:text-[20px] text-[10px] font-bold mb-4">
                      Event Date: 12 Jan 2025
                    </p>
                    <div className="w-[50%] max-h-[270px] h-auto relative overflow-y-auto scrollbar-hide">
                      <p className="lg:text-[15px] text-[7px] ">
                        Event Description goes here. It can include important
                        information or highlights about the event. Event
                        Description goes here. It can include important
                        information or highlights about the event. Event
                        Description goes here. It can include important
                        information or highlights about the event. Event
                        Description goes here. It can include important
                        information or highlights about the event. Event
                        Description goes here. It can include important
                        information or highlights about the event. Event
                        Description goes here. It can include important
                        information or highlights about the event.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
            />
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-black mb-12">
          <span className="text-sm block mb-2 text-gray-600">EVENTS</span>
          UPCOMING DATES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[rgba(219,39,120,0.83)] via-[#002146a9] to-[#002146b8] backdrop-blur-[2px] shadow-[#0000007e] shadow-lg rounded-2xl overflow-hidden border border-gray-700"
            >
              <div
                className="relative h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-pink-500 text-sm mb-4">{event.date}</p>
                <p className="text-gray-300 text-sm mb-4">
                  {event.description}
                </p>
                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-xl shadow-md shadow-[#0000006c]">
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Event;
