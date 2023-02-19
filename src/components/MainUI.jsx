import { useState } from "react";
import ArcticIceData from "../data/ArcticIceData.json";
import { MonthLookup } from "../data/MonthLookup";
import "./MainUI.scss";

const MainUI = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = (e) => {
        const { height, width, x, y } = e.target.getBoundingClientRect();

        // The center positions of the scroll element
        const x1 = x + width / 2;
        const y1 = y + height / 2;

        // elementFromPoint gives the element at that particular point in the document
        const centerItem = document.elementFromPoint(x1, y1);
        const dataIndex = parseInt(centerItem.getAttribute("data-index"));

        if (dataIndex) {
            setActiveIndex(dataIndex);
        }
        else {
            // At the extremes of the scoll
            if (e.target.scrollTop < 20) {
                setActiveIndex(0);
            }
            else {
                setActiveIndex(ArcticIceData.data.length - 1);
            }
        }
    }

    const extentRange = ArcticIceData.maxExtent - ArcticIceData.minExtent;
    const areaRange = ArcticIceData.maxArea - ArcticIceData.minArea;

    const listItems = ArcticIceData.minMaxAreaByYear.map((item, index) => {
        let className;
        if (index === activeIndex) {
            className = "active";
        }
        else if (index === activeIndex - 1 || index === activeIndex + 1) {
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
            <ul onScroll={onScroll}>
                {listItems}
            </ul>
        </aside>
    );
}

export default MainUI;