import { useEffect, useState } from "react";

interface SseResponseMessage {
  content?: string;
  time?: Date;
}

function App() {
  // SSE Message를 받으면 채울 객체
  const [sseMessageObject, setSseMessageObject] = useState<SseResponseMessage>(
    {}
  );

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8080/v1/events/inquiry/subscriptions"
    );

    eventSource.addEventListener("sse", (e) => {
      const data = JSON.parse(e.data) as SseResponseMessage;

      console.log("data: ", data);

      if (!data) {
        console.error("SSE Message >>> ", e.data);
      }

      if (!data?.time) {
        data.time = new Date();
      }

      setSseMessageObject(data);
    });

    eventSource.addEventListener("sse-test", (e) => {
      const data = JSON.parse(e.data) as SseResponseMessage;

      console.log("data: ", data);
    });

    return eventSource.close;
  }, []);

  return (
    <main className="p-10">
      <div>
        <ul>
          <li>메시지: {sseMessageObject.content ?? "(내용 없음)"}</li>
          <li>
            {sseMessageObject.time?.toLocaleString() ?? "(전송 받은 적 없음)"}
          </li>
        </ul>
      </div>
    </main>
  );
}

export default App;
