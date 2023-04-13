import { useDispatch, useSelector } from "react-redux";
import { MonthLookup } from "../data/MonthLookup";
import { setActiveIceDataIndex } from "../redux/appSlice";
import { ArcticDataProperty, GetDataForFilter } from "../redux/FilterOptions";
import FilterButtonGroup from "./FilterButtonGroup";
import "./MainUI.scss";

const MaxItemValue = 20;        // Used for plotting length of bars

const MainUI = () => {
    const activeIceDataIndex = useSelector(state => state.app.activeIceDataIndex);
    const filterOption = useSelector(state => state.app.currentFilter);
    const dispatch = useDispatch();

    const data = GetDataForFilter(filterOption);

    const onScroll = (e) => {
        const { height, width, x, y } = e.target.getBoundingClientRect();
        // The center positions of the scroll element
        const x1 = x + width / 2;
        const y1 = y + height / 2;

        // elementFromPoint gives the element at that particular point in the document
        const centerItem = document.elementFromPoint(x1, y1);
        if (!centerItem) return;

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
                dispatch(setActiveIceDataIndex(data.dataSet.length - 1));
            }
        }
    }

    const listItems = data.dataSet.map((item, index) => {
        const className = index === activeIceDataIndex ? "active" : "";
        const dataItemValue = data.property === ArcticDataProperty.Area ? item.area : item.extent;

        const areaPercent = dataItemValue / MaxItemValue * 100;
        const bgColour = "var(--purple-dark)";
        const backgroundStyle = { background: `linear-gradient(90deg, ${bgColour} ${areaPercent}%, transparent 0%)` }

        return <li data-index={index} key={index} className={className} style={backgroundStyle}>
            {item.year} {MonthLookup[item.month]} - {dataItemValue}
        </li>
    });

    // Create two empty list items at beginning/end. In CSS these are set to approx 50% height, 
    // so that actual list items appear in the center.
    listItems.unshift(<li key="first"></li>);
    listItems.push(<li key="last"></li>);

    return (
        <>
            <section className="filters">
                <h4>Filter by:</h4>
                <FilterButtonGroup />
            </section>
            <ul className="custom-scrollbar" onScroll={onScroll}>
                {listItems}
            </ul>
            <section className="legend">
                <p id="graph-label">In million sq km</p>
            </section>
        </>
    );
}

export default MainUI;