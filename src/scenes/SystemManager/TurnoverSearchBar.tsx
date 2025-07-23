import React, { useEffect, useState } from "react";
import { DatePicker, Select, Button, Space } from "antd";
import type { RangeValue } from "rc-picker/lib/interface";
import moment, { Moment } from "moment";
import { SearchOutlined, StepBackwardOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SearchProps {
    onSearch: (fromDate?: Date, toDate?: Date, shiftID?: number[]) => void;
    onBack: () => void;
}

const TurnoverSearchBar: React.FC<SearchProps> = ({ onSearch, onBack }) => {
    const [dateRange, setDateRange] = useState<RangeValue<Moment>>([moment().startOf('day'), moment().endOf('day')]);
    useEffect(() => {
        handleSearch();
    }, []);
    const handleSearch = () => {
        const fromDate = dateRange?.[0]?.toDate();
        const toDate = dateRange?.[1]?.toDate();
        onSearch(fromDate, toDate);
    };

    return (
        <Space>
            <Button onClick={onBack} icon={<StepBackwardOutlined />}></Button>

            <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                format="YYYY-MM-DD"
                inputReadOnly
            />
            <Button icon={<SearchOutlined />} type="primary" onClick={handleSearch}>
            </Button>
        </Space>
    );
};

export default TurnoverSearchBar;
