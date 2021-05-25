import React, { useState, useEffect } from 'react';
import "./CategoryCard.css";

const CategoryCard = (props) => {

    return <div className="category-grid-item">
        <img className="category-grid-img" src={props.img} alt="" />
        <button className="category-grid-btn" type="button">
            <p className="category-grid-title">{props.title}</p>
        </button>
    </div>
}

export default CategoryCard;