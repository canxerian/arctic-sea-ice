import { useState } from "react";
import "./FilterButtonGroup.scss";

const FilterButton = ({ index, label, isActive, onClick }) => {
    const classes = ["filter-button"];
    if (isActive) {
        classes.push("active");
    }
    return <button key={index} className={classes.join(" ")} onClick={() => onClick(index)}>{label}</button>
}

/**
 * Render a group of buttons where only one can be selected
 * @param {object} obj 
 * @param {Array<string>} obj.labels array of button labels 
 * @returns React
 */
const FilterButtonGroup = ({ labels }) => {
    const [activeIndex, setActiveIndex] = useState(-1);

    return (
        <div className="filter-button-group">
            {labels.map((option, index) => <FilterButton
                index={index}
                label={option}
                isActive={index === activeIndex}
                onClick={(index) => setActiveIndex(index)} />)}
        </div>
    )
}

export default FilterButtonGroup;