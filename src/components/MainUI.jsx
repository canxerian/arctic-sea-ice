import { useDispatch, useSelector } from "react-redux";
import ArcticIceData from "../data/ArcticIceData.json";
import { MonthLookup } from "../data/MonthLookup";
import { setActiveIceDataIndex } from "../redux/appSlice";
import { FilterOptionDataLookup } from "../redux/FilterOptions";
import FilterButtonGroup from "./FilterButtonGroup";
import "./MainUI.scss";

const MainUI = () => {
    const activeIceDataIndex = useSelector(state => state.app.activeIceDataIndex);
    const filterOption = useSelector(state => state.app.currentFilter);
    const dispatch = useDispatch();

    const dataArray = FilterOptionDataLookup[filterOption];

    const onScroll = (e) => {
        const { height, width, x, y } = e.target.getBoundingClientRect();

        // The center positions of the scroll element
        const x1 = x + width / 2;
        const y1 = y + height / 2;

        // elementFromPoint gives the element at that particular point in the document
        const centerItem = document.elementFromPoint(x1, y1);
        const dataIndex = parseInt(centerItem.getAttribute("data-index"));

        if (dataIndex) {
            dispatch(setActiveIceDataIndex(dataIndex));
        }
        else if (!isNaN(dataIndex)) {
            // At the extremes of the scoll
            if (e.target.scrollTop < 20) {
                dispatch(setActiveIceDataIndex(0));
            }
            else {
                dispatch(setActiveIceDataIndex(dataArray.length - 1));
            }
        }
    }

    const extentRange = ArcticIceData.maxExtent - ArcticIceData.minExtent;
    const areaRange = ArcticIceData.maxArea - ArcticIceData.minArea;

    const listItems = dataArray.map((item, index) => {
        let className;
        if (index === activeIceDataIndex) {
            className = "active";
        }
        else if (index === activeIceDataIndex - 1 || index === activeIceDataIndex + 1) {
            className = "activeSibling";
        }

        const areaPercent = (item.area - ArcticIceData.minArea) / areaRange * 100;
        const bgColour = "#5B7099";
        const backgroundStyle = { background: `linear-gradient(90deg, ${bgColour} ${areaPercent}%, transparent 0%)` }

        return <li data-index={index} key={index} className={className} style={backgroundStyle}>
            {item.year} {MonthLookup[item.month]} - {item.area}
        </li>
    });

    // Create two empty list items at beginning/end. In CSS these are set to approx 50% height, 
    // so that actual list items appear in the center.
    listItems.unshift(<li key="first"></li>);
    listItems.push(<li key="last"></li>);

    return (
        <aside id="main-ui">
            <section id="filter-section">
                <h1>Filter by:</h1>
                <FilterButtonGroup />
            </section>
            <section id="data-list-section">
                <ul onScroll={onScroll}>
                    {listItems}
                </ul>
            </section>
            <section id="legend-section">
                <p>In million sq km</p>
            </section>
        </aside>
    );
}

export default MainUI;