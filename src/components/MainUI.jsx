import { useState } from "react";
import ArcticIceData from "../data/ArcticIceData.json";
import "./MainUI.scss";

const MainUI = () => {
    const [activeIndex, setActiveIndex] = useState(null);

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
                setActiveIndex(ArcticIceData.length - 1);
            }
        }
    }

    const listItems = ArcticIceData.map((item, index) => {
        let className;
        if (index === activeIndex) {
            className = "active";
        }
        else if (index === activeIndex - 1 || index === activeIndex + 1) {
            className = "activeSibling";
        }
        return <li data-index={index} key={index} className={className}>
            {item.year} {item.mo}
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