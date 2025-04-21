import React, { useEffect, useState } from 'react';
import './IGA.css'; // We'll create this separate CSS file
import { Link } from 'react-router-dom';

const Products_IGA = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/iga')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);
                console.error('Error fetching products:', error);
            });
    }, []);

    if (isLoading) return <div className="loading-container">Loading products...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;

    return (
        <div className="iga-container">
            {/* Navigation Header */}
            <nav className="store-nav">
                <Link to="/iga" className="store-nav-link active">IGA Sales</Link>
                <Link to="/aldi" className="store-nav-link">ALDI Sales</Link>
            </nav>
            
            <h1 className="page-title">IGA Specials</h1>
            
            {/* Product List */}
            <div className="product-list">
                {products.map((product, index) => {
                    const discount = product.discount || (product.formerPrice ? Math.round((1 - parseFloat(product.currentPrice.replace('$', '')) / parseFloat(product.formerPrice.replace('$', ''))) * 100) : null);
                    const discountLabel = discount > 30 ? '40% Off' : discount > 0 ? '25% Off' : 'Special';
                    
                    return (
                        <div key={index} className="product-item">
                            {/* Discount Badge */}
                            <div className="discount-badge">
                                {discountLabel}
                            </div>
                            
                            {/* Product Image */}
                            <div className="product-image-container">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="product-image" 
                                />
                            </div>
                            
                            {/* Product Details */}
                            <div className="product-details">
                                <h2 className="product-name">-{product.name}</h2>
                                
                                {/* Price Info */}
                                {product.formerPrice && (
                                    <div className="former-price">
                                        was {product.formerPrice}
                                    </div>
                                )}
                                <div className="current-price">
                                    {product.currentPrice}
                                </div>
                                
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Products_IGA;