import { useEffect, useRef } from 'react';
import {addDays, format} from "date-fns";

export const createDays = (selectedMonth) => {
    console.log('get days')
    const first = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    let shiftDayOfWeek = format(first, "E") - 1;
    let day = shiftDayOfWeek > 0 ? addDays(first, shiftDayOfWeek * -1) : first;
    const days = Array.from(Array(35)).reduce((acc) => {

        acc.push({
            data: day,
            date: day.toDateString(),
            day: day.getDate(),
            currentMonth: day.getMonth() === selectedMonth.getMonth(),
            dayOfWeek: format(day, 'dddd'),
            month: format(day, 'MMMM'),
            year: format(day, 'YYYY')
        });
        day = addDays(day, 1);
        return acc;
    }, []);

    return days;
};

export function useWhyDidYouUpdate(name, props) {
    // Get a mutable ref object where we can store props ...
    // ... for comparison next time this hook runs.
    const previousProps = useRef();

    useEffect(() => {
        if (previousProps.current) {
            // Get all keys from previous and current props
            const allKeys = Object.keys({ ...previousProps.current, ...props });
            // Use this object to keep track of changed props
            const changesObj = {};
            // Iterate through keys
            allKeys.forEach(key => {
                // If previous is different from current
                if (previousProps.current[key] !== props[key]) {
                    // Add to changesObj
                    changesObj[key] = {
                        from: previousProps.current[key],
                        to: props[key]
                    };
                }
            });

            // If changesObj not empty then output to console
            if (Object.keys(changesObj).length) {
                console.log('[why-did-you-update]', name, changesObj);
            }
        }

        // Finally update previousProps with current props for next hook call
        previousProps.current = props;
    });
}
