import { jsx } from "@hyperlight/jsx";
import { Request } from "@tinyhttp/app";

import "./module.css";

export default (state: any) => {
  return (
    <section>
      <p className="text">aaaa</p>
      <p>bbbb</p>
      <p>{state.text}</p>
      <p>{state.test}</p>
      <p>
        Server side prop {"=>"} {state.headers}
      </p>

      <input
        value={state.text}
        oninput={(state, event: { target: HTMLInputElement }) => {
          return { ...state, text: event.target.value };
        }}
      />
    </section>
  );
};

export const getServerSideState = (req: Request) => {
  return { test: "I <3 server side state", headers: req.headers["user-agent"] };
};

export const getInitialState = () => {
  return {
    text: "hello world",
  };
};
