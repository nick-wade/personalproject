import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Navbar from '../components/Navbar';

const Products_ALDI = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/aldi') // Call backend API
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return(
        <div className='container mx-auto p-4'>
            <Navbar />
            <p>getting aldi products.. LOOOL not actually</p>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                navigation
                loop={true}
                className="pb-8"
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <div className="border p-4 rounded-lg shadow-lg text-center bg-white">
                            <h2 className="text-lg font-bold mt-2">{product.title}</h2>
                            <p className="text-gray-500">was {product.price}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
};

export default Products_ALDI;