"use client";

import { Splide, SplideSlide } from "react-splide-ts";
import "@splidejs/react-splide/css";

import Image from "next/image";
import FirstTimeVisitor from "@/utils/FirstTimeVisitor/page";

const HeroBanners = () => {
  return (
    <section className="mx-aut py-0 h-fit pb-3">
      <Splide
        options={{
          rewind: true,
          rewindSpeed: 2000,
          rewindByDrag: true,
          focus: "center",
          arrows: false,
          type: "loop",
          autoplay: true,
          speed: 1000,
          interval: 5000,
          width: 1200,
          gap: "1rem",
          perPage: 2,
          perMove: 1,
          breakpoints: {
            740: {
              perPage: 1,
              // width: `auto`,
            },
          },
          classes: {
            // Add classes for pagination.
            pagination: "splide__pagination your-class-pagination", // container
            page: "splide__pagination__page", // each button
          },
        }}
        aria-label="Reviews from Users"
      >
        <SplideSlide>
          <div className="">
            <Image
              src={`/home.jpg`}
              width={400}
              height={200}
              alt="Image 1"
              className="object-cover w-[100%] h-[100%] rounded"
            />
          </div>
        </SplideSlide>

        <SplideSlide>
          <div className="">
            <Image
              src={`/home.jpg`}
              width={400}
              height={200}
              alt="Image 1"
              className="object-cover w-[100%] h-[100%] rounded"
            />
          </div>
        </SplideSlide>

        <SplideSlide>
          <div className="">
            <Image
              src={`/unsplash.jpg`}
              width={400}
              height={200}
              alt="Image 1"
              className="object-cover w-[100%] h-[100%] rounded"
            />
          </div>
        </SplideSlide>

        <SplideSlide>
          <div className="">
            <Image
              src={`/unsplash.jpg`}
              width={400}
              height={200}
              alt="Image 1"
              className="object-cover w-[100%] h-[100%] rounded"
            />
          </div>
        </SplideSlide>
      </Splide>
      <FirstTimeVisitor />
    </section>
  );
};

export default HeroBanners;
