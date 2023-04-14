import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentFilter } from "../redux/appSlice";
import { FilterOptions } from "../redux/FilterOptions";
import "./FilterButtonGroup.scss";
import "../images/chevron-right.svg";
import { useMediaScreen } from "../hooks/useMediaScreen.js";

const getTitle = (label) => `Filter by ${label.toLowerCase()}`;

const FilterButton = ({ label, isActive, onClick }) => {
    const classes = ["filter-button"];
    if (isActive) {
        classes.push("active");
    }
    return (
        <div>
            <button title={getTitle(label)} className={classes.join(" ")} onClick={() => onClick(label)}>{label}</button>
        </div>
    );
}

/**
 * Render a group of buttons where only one can be selected
 */
const FilterButtonGroup = () => {
    const [showNext, setShowNext] = useState();
    const [showPrev, setShowPrev] = useState();
    const divRef = useRef();

    const currentFilter = useSelector(state => state.app.currentFilter);
    const dispatch = useDispatch();

    const mediaScreen = useMediaScreen();

    const filters = Object.values(FilterOptions);

    useEffect(() => {
        onScroll();
    }, [mediaScreen])

    const onScroll = () => {
        const target = divRef.current;
        if (target.offsetWidth <= window.scrollWidth) {
            setShowNext(false);
            return;
        }

        const scrollEndX = target.scrollWidth - target.offsetWidth;

        setShowPrev(target.scrollLeft > 0);
        setShowNext(Math.ceil(target.scrollLeft) < scrollEndX);
    }

    const onClickPrev = () => {
        const targetLeft = divRef.current.scrollLeft - divRef.current.offsetWidth;
        divRef.current.scroll({ left: targetLeft, behavior: "smooth" });
    }

    const onClickNext = () => {
        const targetLeft = divRef.current.scrollLeft + divRef.current.offsetWidth;
        divRef.current.scroll({ left: targetLeft, behavior: "smooth" });
    }

    return (
        <div ref={divRef} onScroll={onScroll} className="filter-button-group custom-scrollbar">
            {filters.map(filter => <FilterButton key={filter}
                label={filter}
                isActive={filter === currentFilter}
                onClick={label => dispatch(setCurrentFilter(label))}
            />)}
            {showPrev && <button onClick={onClickPrev} className="scroll-button prev" />}
            {showNext && <button onClick={onClickNext} className="scroll-button next" />}
        </div >
    )
}

export default FilterButtonGroup;