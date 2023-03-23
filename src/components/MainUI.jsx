import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArcticIceData from "../data/ArcticIceData.json";
import { MonthLookup } from "../data/MonthLookup";
import { setActiveIceDataIndex } from "../redux/appSlice";
import "./MainUI.scss";

const MainUI = () => {
    const activeIceDataIndex = useSelector(state => state.app.activeIceDataIndex);
    const dispatch = useDispatch();

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
                dispatch(setActiveIceDataIndex(ArcticIceData.data.length - 1));
            }
        }
    }

    const extentRange = ArcticIceData.maxExtent - ArcticIceData.minExtent;
    const areaRange = ArcticIceData.maxArea - ArcticIceData.minArea;

    const listItems = ArcticIceData.data.map((item, index) => {
        let className;
        if (index === activeIceDataIndex) {
            className = "active";
        }
        else if (index === activeIceDataIndex - 1 || index === activeIceDataIndex + 1) {
            className = "activeSibling";
        }

        const minColour = "red";
        const maxColour = "green";

        const areaPercent = (item.area - ArcticIceData.minArea) / areaRange * 100;
        const bgColour = areaPercent < 30 ? "red" : "green";
        const backgroundStyle = { background: `linear-gradient(90deg, ${bgColour} ${areaPercent}%, transparent 0%)` }

        return <li data-index={index} key={index} className={className} style={backgroundStyle}>
            {item.year} {MonthLookup[item.mo]} - {areaPercent.toFixed(2)}%
        </li>
    });

    return (
        <aside id="data-list-aside">
            <h1>Filter by:</h1>
            <ul onScroll={onScroll}>
                {listItems}
            </ul>
        </aside>
    );
}

export default MainUI;