'use client';
import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/services/revenue';
import { Revenue } from '@/app/lib/definitions';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { setRevenue } from '@/redux/features/revenueSlice';

export default function RevenueChart() {
  const dispatch = useDispatch<AppDispatch>();
  const revenue: Revenue[] = useSelector(
    (state: RootState) => state.revenueReducer.revenueList
  );

  const fetchAndSetRevenue = async () => {
    const data = await fetchRevenue();
    dispatch(setRevenue(data));
  };

  useEffect(() => {
    fetchAndSetRevenue();
  }, []);
  const chartHeight = 350;

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      <div className="rounded-xl bg-neutral-800 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-neutral-800 p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-neutral-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-amber-500"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-neutral-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-neutral-500" />
          <h3 className="ml-2 text-sm text-neutral-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
};
