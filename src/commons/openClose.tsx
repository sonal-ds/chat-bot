import * as React from "react";

import { StaticData } from "../../../sites-global/staticData";
import Timer from "../locationDetail/countdown";

interface Interval {
  start: string;
  end: string;
}
interface Hours {
  reopenDate?: string;


}

let currentInterval: Interval | null = null;
let nextInterval: Interval | null = null;

export const OpenStausFunctions = {
  formatOpenNowString: (
    hoursData: { [key: string]: object },
    timeZone: string
  ) => {
    const now = new Date();
    const currentTime = new Date(
      now.toLocaleString("en-US", { timeZone: timeZone })
    );

    const week = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const tomorrow = new Date(currentTime.getTime() + 60 * 60 * 24 * 1000);
    let nextTomorrow = new Date(tomorrow.getTime() + 86400000);
    let Day = 0;
    const yesterday = new Date(currentTime.getTime() - 60 * 60 * 24 * 1000);
    const nowTimeNumber =
      currentTime.getHours() + currentTime.getMinutes() / 60;

    const intervalsToday = OpenStausFunctions.getIntervalOnDate(
      currentTime,
      hoursData
    );
    const intervalsTomorrow = OpenStausFunctions.getIntervalOnDate(
      tomorrow,
      hoursData
    );
    const intervalsnextTommorow = OpenStausFunctions.getIntervalOnDate(
      nextTomorrow,
      hoursData
    );
    const intervalsYesterday = OpenStausFunctions.getIntervalOnDate(
      yesterday,
      hoursData
    );
    let openRightNow = false;

    if (intervalsYesterday) {
      for (let i = 0; i < intervalsYesterday.length; i++) {
        const interval = intervalsYesterday[i];
        const startIntervalNumber = OpenStausFunctions.timeStringToNumber(
          interval.start
        );
        const endIntervalNumber = OpenStausFunctions.timeStringToNumber(
          interval.end
        );

        // If end overflows to the next day (i.e. today).
        if (endIntervalNumber < startIntervalNumber) {
          if (nowTimeNumber < endIntervalNumber) {
            currentInterval = interval;
            openRightNow = true;
          }
        }
      }
    }

    // Assumes no overlapping intervals
    if (intervalsToday) {
      for (let i = 0; i < intervalsToday.length; i++) {
        const interval = intervalsToday[i];
        const startIntervalNumber = OpenStausFunctions.timeStringToNumber(
          interval.start
        );
        const endIntervalNumber = OpenStausFunctions.timeStringToNumber(
          interval.end
        );

        // If current time doesn't belong to one of yesterdays interval.
        if (currentInterval == null) {
          if (endIntervalNumber < startIntervalNumber) {
            if (nowTimeNumber >= startIntervalNumber) {
              currentInterval = interval;
              openRightNow = true;
            }
          } else if (
            nowTimeNumber >= startIntervalNumber &&
            nowTimeNumber < endIntervalNumber
          ) {
            currentInterval = interval;

            openRightNow = true;
          }
        }

        if (nextInterval == null) {
          if (startIntervalNumber > nowTimeNumber) {
            nextInterval = interval;
          }
        } else {
          if (
            startIntervalNumber > nowTimeNumber &&
            startIntervalNumber <
              OpenStausFunctions.timeStringToNumber(nextInterval.start)
          ) {
            nextInterval = interval;
          }
        }
      }
    }

    let nextIsTomorrow = false;

    // If no more intervals in the day
    if (nextInterval == null) {
      if (intervalsTomorrow) {
        if (intervalsTomorrow.length > 0) {
          nextInterval = intervalsTomorrow[0];
          Day = tomorrow.getDay();

          nextIsTomorrow = true;
        }
      } else if (intervalsnextTommorow) {
        if (intervalsnextTommorow.length > 0) {
          nextInterval = intervalsnextTommorow[0];
          Day = nextTomorrow.getDay();

          nextIsTomorrow = true;
        }
      } else if (
        OpenStausFunctions.getIntervalOnDate(
          new Date(nextTomorrow.getTime() + 86400000),
          hoursData
        )
      ) {
        nextTomorrow = new Date(nextTomorrow.getTime() + 86400000);
        Day = nextTomorrow.getDay();
        const nextintervals = OpenStausFunctions.getIntervalOnDate(
          nextTomorrow,
          hoursData
        );
        if (nextintervals.length > 0) {
          nextInterval = nextintervals[0];
          nextIsTomorrow = true;
        }
      } else if (
        OpenStausFunctions.getIntervalOnDate(
          new Date(nextTomorrow.getTime() + 172800000),
          hoursData
        )
      ) {
        nextTomorrow = new Date(nextTomorrow.getTime() + 172800000);
        Day = nextTomorrow.getDay();
        const nextintervals = OpenStausFunctions.getIntervalOnDate(
          nextTomorrow,
          hoursData
        );
        if (nextintervals.length > 0) {
          nextInterval = nextintervals[0];
          nextIsTomorrow = true;
        }
      } else if (
        OpenStausFunctions.getIntervalOnDate(
          new Date(nextTomorrow.getTime() + 86400000 + 172800000),
          hoursData
        )
      ) {
        nextTomorrow = new Date(nextTomorrow.getTime() + 86400000 + 172800000);
        Day = nextTomorrow.getDay();
        const nextintervals = OpenStausFunctions.getIntervalOnDate(
          nextTomorrow,
          hoursData
        );
        if (nextintervals.length > 0) {
          nextInterval = nextintervals[0];
          nextIsTomorrow = true;
        }
      }
    }

    if (openRightNow) {
      if (
        currentInterval &&
        currentInterval.start === "00:00" &&
        currentInterval.end === "23:59"
      ) {
        return <div className={"openAll"}>Open 24 Hours</div>;
      } else if (currentInterval) {
        return (
          <div className={"opendot green-dot openAll"}>
            <div className="hours-info ">
              <span className="font-second-main-font font-bold">
                {" "}
                Open now -{" "}
              </span>
              <span className="lowercase">
                {OpenStausFunctions.formatTime(currentInterval.start).replace(
                  ":00",
                  ""
                )}
              </span>
              {" to "}
              <span className="lowercase">
                {OpenStausFunctions.formatTime(currentInterval.end).replace(
                  ":00",
                  ""
                )}
              </span>
            </div>
          </div>
        );
      }
    } else if (nextInterval) {
      if (nextIsTomorrow) {
        return (
          <div className={"closeddot 4 openAll"}>
            <div className="red-dot">
              <div className="hours-info ">
                <span className="font-second-main-font font-bold">
                  Closed -{" "}
                </span>
                {"Opens at "}
                <span className="lowercase">
                  {OpenStausFunctions.formatTime(nextInterval.start).replace(
                    ":00",
                    ""
                  )}
                </span>{" "}
                {week[Day]}
              </div>
            </div>{" "}
          </div>
        );
      } else {
        return (
          <div className={"closeddot 3 openAll"}>
            <div className="red-dot">
              <div className="hours-info">
                <span className="font-second-main-font font-bold">
                  Closed -{" "}
                </span>
                {"Opens at "}
                <span className="lowercase">
                  {OpenStausFunctions.formatTime(nextInterval.start).replace(
                    ":00",
                    ""
                  )}
                </span>
              </div>{" "}
            </div>{" "}
          </div>
        );
      }
    } else {
      return (
        <div className="closeddot 2 openAll">
          <div className="red-dot">
            <div className="hours-info ">Closed</div>{" "}
          </div>
        </div>
      );
    }
  },
  getYextTimeWithUtcOffset: (entityUtcOffsetSeconds: number) => {
    const now = new Date();
    let utcOffset = 0;
    if (entityUtcOffsetSeconds) {
      utcOffset = entityUtcOffsetSeconds * 1000;
    }
    if (utcOffset !== 0) {
      const localUtcOffset = now.getTimezoneOffset() * 60 * 1000;
      return new Date(now.valueOf() + utcOffset + localUtcOffset);
    }
    return now;
  },
  parseTimeZoneUtcOffset: (timeString: string) => {
    if (!timeString) {
      return 0;
    }
    const parts = timeString.split(":");
    const hours = parseInt(parts[0].replace(/\u200E/g, ""), 10);
    const minutes = parseInt(parts[1].replace(/\u200E/g, ""), 10);
    if (hours < 0) {
      return -(Math.abs(hours) + minutes / 60) * 60 * 60;
    }
    return (hours + minutes / 60) * 60 * 60;
  },

  timeStringToNumber: (timeString: string) => {
    const parts = timeString.split(":");
    const hours = parseInt(parts[0].replace(/\u200E/g, ""), 10);
    const minutes = parseInt(parts[1].replace(/\u200E/g, ""), 10);
    return hours + minutes / 60;
  },
  getIntervalOnDate: (
    date: Date,
    hoursData: { [key: string]: object } | undefined
  ) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const dateString =
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (day < 10 ? "0" + day : day);
    const dayOfWeekString = days[date.getDay()];

    // Check for holiday
    if (hoursData && hoursData.holidayHours) {
      for (let i = 0; i < hoursData.holidayHours.length; i++) {
        const holiday = hoursData.holidayHours[i];
        if (holiday.date == dateString) {
          if (holiday.openIntervals) {
            return holiday.openIntervals;
          } else if (holiday.isClosed === true) {
            return null; // On holiday but closed
          }
        }
      }
    }

    // Not on holiday
    if (
      hoursData &&
      hoursData[dayOfWeekString] &&
      hoursData[dayOfWeekString].openIntervals
    ) {
      return hoursData[dayOfWeekString].openIntervals;
    } else {
      return null;
    }
  },
  formatTime: (time: string) => {
    const tempDate = new Date("January 1, 2020 " + time);
    const localeString = "en-US";

    return tempDate.toLocaleTimeString(localeString.replace("_", "-"), {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  },
  getUtcOffsetFromTimeZone: (timeZone: string, date = new Date()) => {
    const tz = date
      .toLocaleString("en-gb", { timeZone, timeStyle: "long" })
      .split(" ")
      .slice(-1)[0];

    const dateString = date.toString();
    const offset =
      Date.parse(`${dateString} UTC`) - Date.parse(`${dateString} ${tz}`);
    return OpenStausFunctions.msToTime(offset);
  },
  msToTime: (duration: number) => {
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = hours < 10 ? hours : hours;
    return hours + ":00";
  },
};

export default function OpenClose(props: { hours?: Hours; timezone: string }) {
  let formatOptions: Intl.DateTimeFormatOptions[];
  let formattedDate: string;
  let dateInNewFormat: string | undefined;
  
  function joinDateTime(date: Date, options: Intl.DateTimeFormatOptions[], separator: string) {
    function formatDate(option: Intl.DateTimeFormatOptions) {
      const formatter = new Intl.DateTimeFormat("en", option);
      return formatter.format(date);
    }
    return options.map(formatDate).join(separator);
  }
  
  if (props.hours && props.hours.reopenDate) {
    formatOptions = [{ day: "numeric" }, { month: "long" }, { year: "numeric" }];
    formattedDate = joinDateTime(new Date(props.hours.reopenDate), formatOptions, " ");
    dateInNewFormat = formattedDate;
  }

  return (
    <>
      {props.hours && props.hours.reopenDate ? (
        <>
          <h3 className="text-2xl md:text-[28px] notHighlight">
            {StaticData.tempClosed}
          </h3>
          <p className="mt-4">
            <Timer dateNewFormat={dateInNewFormat} hours={props.hours} />
          </p>{" "}
        </>
      ) : props.hours ? (
        <div className="closeing-div notHighlight">
          {OpenStausFunctions.formatOpenNowString(props.hours, props.timezone)}
        </div>
      ) : (
        <div className="closeddot  1">
          <div className="red-dot notHighlight">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
            >
              <circle
                data-name="Ellipse 5"
                cx="4"
                cy="4"
                r="4"
                fill="#ad1e1f"
              />
            </svg>
            <div className="hours-info font-second-main-font ">Closed</div>{" "}
          </div>
        </div>
      )}
    </>
  );
}
