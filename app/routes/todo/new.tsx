import React from "react";
import { Form, useFetcher } from "remix";
import type { ActionFunction } from "remix";
import { loader } from "..";

export const action: ActionFunction = ({ request }) => {};

export default function New() {
  const fetcher = useFetcher();

  const loader = React.useCallback(() => {
    fetcher.load("/todo");
    console.log(fetcher.data);
  }, [fetcher.data, fetcher.load]);

  React.useEffect(() => {
    loader();
  }, []);

  return (
    <Form>
      {JSON.stringify(fetcher, null, 2)}
      <h1>This is a form</h1>
    </Form>
  );
}
