import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentFilter } from "../redux/appSlice";
import FilterOptions from "../redux/FilterOptions";
import "./FilterButtonGroup.scss";

const FilterButton = ({ label, isActive, onClick }) => {
    const classes = ["filter-button"];
    if (isActive) {
        classes.push("active");
    }
    return <button className={classes.join(" ")} onClick={() => onClick(label)}>{label}</button>
}

/**
 * Render a group of buttons where only one can be selected
 */
const FilterButtonGroup = () => {
    const currentFilter = useSelector(state => state.app.currentFilter);
    const dispatch = useDispatch();

    const filters = Object.values(FilterOptions);

    return (
        <div className="filter-button-group">
            {filters.map(filter => <FilterButton key={filter}
                label={filter}
                isActive={filter === currentFilter}
                onClick={label => dispatch(setCurrentFilter(label))}
            />)}
        </div>
    )
}

export default FilterButtonGroup;