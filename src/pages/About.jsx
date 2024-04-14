import React from 'react';
import Image1 from '../assets/Iman_Alii.jpg';

function About(){
    return (
        <div className="grid grid-cols-12 p-20 w-full h-[700px] bg-gray-100">
            <div className="h-full col-span-12 mx-6 md:col-span-6 md:mx-0 pr-2 md:pr-10">
                <h1 className="text-black font-bold text-5xl">
                    Welcome to Inventrix! <br />
                </h1>
                <p className="mt-8 mr-6 text-2xl text-black">
                We , <span className='font-semibold'>Ali</span>  and <span className='font-semibold'>Iman</span> , are two passionate students and budding Python developers in the field of AI.
                 Our project, Inventrix, is born out of a desire to simplify inventory and business management
                  for entrepreneurs and businesses everywhere. <br /> With a focus on efficiency and ease of use,
                   Inventrix aims to transform the way businesses handle their operations. It's more than just software;
                    it's a tool designed to streamline your workflow and support your success.
                    <br /> Join us on this journey to make business management effortless and intuitive.
                </p>
            </div>
            <img className="max-w-full h-auto col-span-12 md:col-span-6 md:px-0 ml-0 md:mr-4" 
            src={Image1} 
            loading="lazy" alt=""/>
        </div>
        
    );
}

export default About;
