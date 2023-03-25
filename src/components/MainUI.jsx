import { useDispatch, useSelector } from "react-redux";
import ArcticIceData from "../data/ArcticIceData.json";
import { MonthLookup } from "../data/MonthLookup";
import { setActiveIceDataIndex } from "../redux/appSlice";
import { GetDataForFilter } from "../redux/FilterOptions";
import FilterButtonGroup from "./FilterButtonGroup";
import "./MainUI.scss";

const MainUI = () => {
    const activeIceDataIndex = useSelector(state => state.app.activeIceDataIndex);
    const filterOption = useSelector(state => state.app.currentFilter);
    const dispatch = useDispatch();

    const data = GetDataForFilter(filterOption).dataSet;
    const dataSet = data.dataSet;

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
                dispatch(setActiveIceDataIndex(dataSet.length - 1));
            }
        }
    }

    // const extentRange = ArcticIceData.maxExtent - ArcticIceData.minExtent;
    // const areaRange = ArcticIceData.maxArea - ArcticIceData.minArea;

    const listItems = dataSet.map((item, index) => {
        const className = index === activeIceDataIndex ? "active" : "";

        // const areaPercent = (item.area - ArcticIceData.minArea) / areaRange * 100;
        const areaPercent = item.area / ArcticIceData.maxArea * 100;
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
            <h1>Filter by:</h1>
            <FilterButtonGroup className={"button-group"} />
            <ul onScroll={onScroll}>
                {listItems}
            </ul>
            <p id="graph-label">In million sq km</p>
        </aside>
    );
}

export default MainUI;