import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import './main.css';
import Navbar from '../components/Navbar';

const Products_IGA = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/iga', {
        })
        
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);
    console.log(products);
    // Check if products are loaded and not empty

    return (
        <div className="container mx-auto p-4">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">IGA Specials</h1>
            
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
                            <img src={product.image} alt={product.name} className="mx-auto h-32 object-contain" />
                            <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                            <p className="text-green-600 font-bold">{product.currentPrice}</p>
                            <p className="text-sm text-gray-500 line-through">{product.formerPrice}</p>
                            {/* No URL in your data, so either remove this or link to IGA with product name */}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Products_IGA;
