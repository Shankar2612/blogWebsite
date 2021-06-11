import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./CategoryCard.css";

const CategoryCard = (props) => {
    return <div className="category-grid-item">
        <img className="category-grid-img" src={props.img} alt="" />
        <Link to={"/" + props.title} className="category-grid-btn" type="button">
            <p className="category-grid-title">{props.title}</p>
        </Link>
    </div>
}

export default CategoryCard;