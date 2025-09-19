import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Button } from './ui/button';

const category = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile App Developer',
  'Game Developer',
  'DevOps Engineer',
  'Security Analyst',
  'Machine Engineer',
  'Cloud Engineer',
  'Product Manager',
];

const CategoryCarousel = () => {
  return (
    <div className="w-full px-6 md:px-16 py-16 bg-gradient-to-b from-white to-purple-50 rounded-3xl shadow-2xl">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#6A38C2] mb-10 drop-shadow-sm">
        Find Jobs by Category
      </h2>
      <Carousel className="max-w-7xl mx-auto relative">
        <CarouselContent className="flex gap-6">
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/3 lg:basis-1/4 flex justify-center"
            >
              <div className="w-full h-full p-5 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                <Button
                  variant="ghost"
                  className="w-full rounded-full bg-white text-[#3A0CA3] border-2 border-transparent hover:border-[#7209b7] hover:bg-[#7209b7] hover:text-white text-sm md:text-base font-semibold py-3 px-6 transition-all duration-300 shadow-sm"
                >
                  {cat}
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-2rem] md:left-[-2.5rem]" />
        <CarouselNext className="right-[-2rem] md:right-[-2.5rem]" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
