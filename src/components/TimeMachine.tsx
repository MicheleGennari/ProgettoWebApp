"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FaRegHourglassHalf } from "react-icons/fa6";
import { LuTimerReset } from "react-icons/lu";
import { timeMachine } from "../reactiveVars";
import { useReactiveVar } from "@apollo/client";
import { Input } from "./ui/input";
import dayjs from "dayjs";
// import { TIME_MACHINE_FRAGMENT } from "@/localGql/localOperations";

export function TimeMachine() {
  // const [date, setDate] = useState(new Date());
  const timeMachineState = useReactiveVar(timeMachine);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <FaRegHourglassHalf />
          <span className="hidden md:inline">
            {timeMachineState.format("DD/MM/YYYY HH:mm")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-5">
        <Button onClick={() => timeMachine(dayjs())}>
          <LuTimerReset />
          <span>Reset Time Machine</span>
        </Button>
        <Input
          onChange={(e) => {
            let [newHour, newMinute] = e.target.value.split(":");
            timeMachine(
              timeMachineState
                .hour(parseInt(newHour))
                .minute(parseInt(newMinute)),
            );
          }}
          className="inline-block wrap"
          type="time"
          value={timeMachineState.format("HH:mm")}
        />
        <Calendar
          mode="single"
          selected={timeMachineState.toDate()}
          required={true}
          onSelect={(_, newDate) =>
            timeMachine(
              dayjs(newDate)
                .add(timeMachineState.hour(), "hour")
                .add(timeMachineState.minute(), "minute"),
            )
          }
        />
      </PopoverContent>
    </Popover>
  );
}

// function useTimeMachine() {
//   const client = useApolloClient();

//   const ref = setTimeMachine(new Date(), client);

//   return useFragment({ fragment: TIME_MACHINE_FRAGMENT, from: "ROOT_QUERY" });
// }

// function setTimeMachine(NewDate: Date, client: ApolloClient<object>) {
//   return client.writeFragment({
//     id: "ROOT_QUERY",
//     fragment: TIME_MACHINE_FRAGMENT,
//     data: {
//       TimeMachine: NewDate,
//     },
//   });
// }
