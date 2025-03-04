import React from "react";
import HomeLayout from "../Layouts/HomeLayout";
import aboutImg from "../assets/images/about.png";
import CarouselSlide from "../Components/CarouselSlide";
import { celebrities } from "../Constants/CelebrityData";

const AboutUs = () => {
  return (
    <HomeLayout>
      <div className="pl-20 pt-20 flex flex-col text-white">
        <div className="flex items-center gap-5 mx-10">
          <section className="w-1/2 space-y-10">
            <h1 className="text-5xl text-yellow-500 font-semibold">
              Affordable and quality eduction
            </h1>
            <p className="text-xl text-gray-200">
              Our goal is to provide the affordable and quality eduction to the
              world. We are providing the platform the aspiring teachers and
              students to share their skills, creativity and knowledge to each
              other to empower and contribute in the growth and wellness of
              mankind.
            </p>
          </section>

          <div className="w-1/2">
            <img
              id="test1"
              style={{ filter: "drop-shadow(0px 10px 10px rgb(0,0,0))" }}
              className="drop-shadow-2xl"
              src={aboutImg}
              alt="about img"
            />
          </div>
        </div>

        <div className="carousel w-1/2 m-auto my-48">
          {celebrities &&
            celebrities.map((curCelebrity) => {
              return (
                <CarouselSlide
                  {...curCelebrity}
                  key={curCelebrity.slideNumber}
                  totalSlides={celebrities.length}
                />
              );
            })}
        </div>
      </div>
    </HomeLayout>
  );
};

export default AboutUs;
