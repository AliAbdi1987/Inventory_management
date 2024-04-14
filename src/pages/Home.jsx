import React from 'react';
import Image1 from '../assets/img1.png';
import Image2 from '../assets/img2.png';
import Image3 from '../assets/img3.png';
import Image4 from '../assets/Inventrix_home.jpg';

function Home(){
    return (
    <>
        <div className="grid grid-cols-12 p-10 w-full bg-white">
            <div className="h-full col-span-12 my-10 mx-6 md:col-span-6 md:mx-0 pr-2 md:pr-10">
                <h1 className="text-black font-bold text-5xl">
                    Optimising how businesses <br />
                        <span className='text-9xl font-semibold supertext'>works</span>
                    
                </h1>
                <p className="mt-8 mr-6 text-2xl text-black">
                Power your entire business operation – full inventory management from
                 promotion on hundreds of marketplaces, to order management to warehouse
                  management with full control of shipping orchestration – from a single, centralised platform.
                </p>
            </div>
            <img className="max-w-full h-auto col-span-12 md:col-span-6 md:px-0 ml-0 md:mr-4" 
            src={Image4}
            loading="lazy" alt=""/>
        </div>

        <div className="grid grid-cols-12 p-20 px-10 w-full bg-gray-100">
          <img
            className="max-w-full h-auto col-span-12 md:col-span-6 px-10 pr-10 "
            src={Image3}
            loading="lazy"
            alt=""
          />
          <div class="h-full col-span-12 mx-6 md:col-span-6 md:mx-0 pl-2 md:pl-10">
            <h2 class="text-black font-bold text-5xl ">
              Get up and running. Fast.
            </h2>
            <p class="mt-8 text-xl text-black">
              Our experts have nailed fast-track implementation, but it does
              need your commitment too. Our onboarding specialists can get you
              up and running in as little as 14 days. It can take longer
              dependent on your availability and the scope of the project, our
              average time to value is 40 days.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 p-20 w-full bg-white">
          <div className="h-full col-span-12 mx-6 md:col-span-6 md:mx-0 pr-2 md:pr-10">
            <h1 className="text-black font-bold text-5xl">
              Happier employees, <br /> happier customers
            </h1>
            <p className="mt-8 mr-6 text-2xl text-black">
              Top business companies love automation. It helps them process,
              pack and ship orders faster which makes their employees’ lives
              easier and their customers happier. <br />
              With Inventrix, you can set up powerful automations in just a few
              clicks. It’s not just about reducing costs – it’s about using
              automation to create a scalable operating model that’s ready to
              grow when you are.
            </p>
          </div>
          <img
            className="max-w-full h-auto col-span-12 md:col-span-6 md:px-0 ml-0 md:mr-4"
            src={Image2}
            loading="lazy"
            alt=""
          />
        </div>

        <div className=" mx-0 py-8 w-full p-4 bg-gray-100">
          <h2 class="text-center text-3xl font-semibold mb-4">
            Reliable. Scalable. No Surprises.
          </h2>

          <p class="text-center mb-4">
            Top business and retail brands trust Inventrix to power their entire
            commerce operations. With many years experience, hundreds of
            integrations and tools to save your teams tons of time, wouldn’t
            you?
          </p>

          <div class="flex justify-center  space-x-4 my-8">
            {/* <!-- First Column --> */}
            <div class="flex-1 text-center">
              <img
                src="https://www.linnworks.com/wp-content/uploads/2023/08/reliable-accurate-purple.svg"
                alt="Reliable, accurate data"
                class="mx-auto w-16 h-16"
              />
              <p class="mt-2 font-bold">
                Reliable, accurate data you can trust
              </p>
            </div>

            {/* <!-- Second Column --> */}
            <div class="flex-1 text-center">
              <img
                src="https://www.linnworks.com/wp-content/uploads/2023/08/inventory-visibility-purple.svg"
                alt="Inventory Visibility"
                class="mx-auto w-18 h-14"
              />
              <p class="mt-2 font-bold">
                Save your time to manage easily your customers and employees
                information
              </p>
            </div>

            {/* <!-- Third Column --> */}
            <div class="flex-1 text-center">
              <img
                src="https://www.linnworks.com/wp-content/uploads/2023/08/communication-purple.svg"
                alt="Communication"
                class="mx-auto w-15 h-14"
              />
              <p class="mt-2 font-bold">
                all sales are visible from a single dashboard
              </p>
            </div>

            {/* <!-- Fourth Column --> */}
            <div class="flex-1 text-center">
              <img
                src="https://www.linnworks.com/wp-content/uploads/2023/08/channels-purple.svg"
                alt="Channels"
                class="mx-auto w-17 h-16"
              />
              <p class="mt-2 font-bold">
                Manage your orders and add them to your inventory by one click
              </p>
            </div>
          </div>
        </div>
      </>
    );
}

export default Home;
