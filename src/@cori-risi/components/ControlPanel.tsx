import * as React from 'react';
import { useEffect, useState } from 'react';
import { Input } from '@cori-risi/cori.data.api';

function ContorlPanel(props: { setFilterState: Function, title?: string}) {

    const [ checkboxFilter, setCheckboxFilter ] = useState(false);
    const [ rangeFilter, setRangeFilter ] = useState([ 0, 100 ]);

    useEffect(() => props.setFilterState({
        "checked": checkboxFilter,
        "range": rangeFilter
    }), [ checkboxFilter, rangeFilter ]);

    return (
        <div className="control-panel">
            {(!!props.title) &&
                <h3>{props.title}</h3>
            }
            <div>
                Turn on Filter &nbsp;
                <Input checked={checkboxFilter}
                       onChange={(evt) => setCheckboxFilter(!checkboxFilter)}
                       type="checkbox" />
            </div>
            <div>
                Limit upper percentile <br />
                <input value={rangeFilter[1]} min={"0"} max={"100"}
                       onChange={(evt) => setRangeFilter([ 0, +(evt.target.value)])} 
                       type="range" />
            </div>
        </div>
    );
}

export default React.memo(ContorlPanel);
