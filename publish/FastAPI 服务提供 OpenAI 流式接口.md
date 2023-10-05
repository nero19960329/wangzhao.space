---
dateCreated: 2023-08-09T13:53
---
demo 代码如下：

```python
import requests
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse

app = FastAPI()


async def request_stream():
    header = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Bearer sk-xxx",  # OpenAI API Key
    }

    session = requests.Session()
    resp = session.post(
	    "https://api.openai.com/v1/completions",
        json={
            "model": "text-davinci-003",
            "prompt": "Count to 100, with a comma between each number and no newlines. 1, 2, 3, ",
            "max_tokens": 100,
            "temperature": 0,
            "stream": True,
        },
        headers=header,
        stream=True,
    )
    for line in resp.iter_lines():
        print(f"{line=}")
        if line:
            yield f"{line.decode('utf-8')}\n\n"


@app.post("/stream")
async def stream(request: Request):
    async def event_generator():
        async for message in request_stream():
            if await request.is_disconnected():
                break
            yield message
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/")
async def index():
    return "Hello World"


# if __name__ == '__main__':
#     for chunk in request_stream():
#         try:
#             chunk = json.loads(chunk.replace("data: ", ""))
#             print(chunk["choices"][0]["text"], end="", flush=True)
#         except:
#             continue
```