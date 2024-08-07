import * as React from 'react';
import { useEffect, useState } from 'react';
import { Input } from '@cori-risi/cori.data.api';

function ContorlPanel(props: { setFilterState: Function, title?: string}) {

    const [ checkboxFilter, setCheckboxFilter ] = useState(false);
    const [ rangeFilter, setRangeFilter ] = useState([ 1, 100 ]);
    const [ sizeFilter, setSizeFilter ] = useState([ 1, 100 ]);

    useEffect(() => props.setFilterState({
        "checked": checkboxFilter,
        "range": rangeFilter,
        "size": sizeFilter[1]
    }), [ checkboxFilter, rangeFilter, sizeFilter ]);

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
                <input value={rangeFilter[1]} min={rangeFilter[0]} max={"100"}
                       onChange={(evt) => setRangeFilter([ rangeFilter[0], +(evt.target.value)])}
                       type="range" />
            </div>
            <div>
                Limit size of grid units <br />
                <input value={sizeFilter[1]} min={sizeFilter[0]} max={"100"}
                       onChange={(evt) => setSizeFilter([ sizeFilter[0], +(evt.target.value)])}
                       type="range" />
            </div>
        </div>
    );
}

export default React.memo(ContorlPanel);
