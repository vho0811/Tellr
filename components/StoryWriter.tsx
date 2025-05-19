"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Frame } from "@gptscript-ai/gptscript"
import renderEventMessage from "@/lib/renderEventMessage"

function StoryWriter() {
  const [story, setStory] = useState<string>("")
  const [pages, setPages] = useState<number>()
  const [runStarted, setRunStarted] = useState<boolean>(false)
  const [runFinished, setRunFinished] = useState<boolean | null>(null)
  const [progress, setProgress] = useState("")
  const [events, setEvents] = useState<Frame[]>([])
  const [currentTool, setCurrentTool] = useState("")
  const storiesPath = "public/stories"
  async function runScript(){
    setRunStarted(true)
    setRunFinished(false)
    const response = await fetch("/api/run-script", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({story, pages, path: storiesPath})
    })
        if(response.ok && response.body){
            console.log("Response received")
            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            handleStream(reader, decoder)
            
        }
        else{
            setRunFinished(true)
            setRunStarted(false)
            console.error("Failed to start streaming")
            
        }
}
async function handleStream(reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder){
    let result = ""
    while(true){
        const {done, value} = await reader.read()
        if(done) break;
        const chunk = decoder.decode(value, {stream: true})
        const eventData = chunk
        .split("\n\n")
        .filter((line)=> line.startsWith("event:"))
        .map((line)=> line.replace(/^event: /, ""))
        eventData.forEach(data=>{
            try{
                const parsedData = JSON.parse(data);
                if (parsedData.type === "callProgress"){
                    if (Array.isArray(parsedData.output)) {
                        const lastOutput = parsedData.output[parsedData.output.length - 1];
                        if (typeof lastOutput === 'string') {
                            setProgress(lastOutput);
                        } else if (lastOutput) {
                            setProgress(JSON.stringify(lastOutput));
                        }
                    } else if (typeof parsedData.output === 'string') {
                        setProgress(parsedData.output);
                    } else if (parsedData.output) {
                        setProgress(JSON.stringify(parsedData.output));
                    }
                    
                    if (parsedData.tool && parsedData.tool.description) {
                        setCurrentTool(parsedData.tool.description);
                    } else {
                        setCurrentTool("");
                    }
                }
                else if(parsedData.type === "callStart"){
                    setCurrentTool(parsedData.tool?.description || "")
                }
                else if(parsedData.type === "runFinish"){
                    setRunFinished(true)
                    setRunStarted(false)
                }
                else{
                    setEvents((prevEvents)=>[...prevEvents, parsedData])
                }
            }
            catch(error){
                console.error("Error parsing event data:", error)
            }
    })
    }
}

  return (
    <div className="flex flex-col p-10 container">
        <section className="flex-1 flex flex-col border border-[3px] border-[#D6C9F0]
        rounded-md p-10 space-y-2">
            <Textarea
            value={story}
            placeholder="Write a story about a robot and a human who become friends..."
            className="bg-[#EDE9F7] text-black flex-1"
            onChange={(e) => setStory(e.target.value)}
            />
            <Select onValueChange={value => setPages(parseInt(value))}>
            <SelectTrigger className="w-full ">
             
                    <SelectValue placeholder="How many pages should the story be?" />
                </SelectTrigger>
                <SelectContent className=" w-full text-indigo-900">
                    {Array.from({length:10},(_,i)=>(
                        <SelectItem key={i} value={`${i+1}`}>{i+1}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={runScript} disabled={!story || !pages} className="cursor-pointer w-full bg-[#2C2D77] hover:bg-[#23245e] text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400">
  Spin The Tale
</Button>


        </section>
        <section className="flex-1 pb-5 mt-5">
            <div className="flex flex-col-reverse w-full bg-[#FCF4D9] space-y-2 overflow-y-auto
 rounded-md text-indigo-900 font-serif text-lg p-10 h-96 border border-[#D6C9F0] shadow-inner">
        <div>
            {runFinished === null && (
                <p className="italic text-center animate-pulse mr-5">
                I'm waiting for you to <span className="font-semibold">Spin the Tale...</span>
                </p>
            )}
                
                    <span className="mr-5">
                        {">>"}
                    </span>
                    {progress}
                </div>
                {/* Current Tool */}
                {currentTool && (
                    <div className="py-10">
                        <span className="mr-5">
                            {"--- [Current Tool] ---"}
                            {currentTool}
                        </span>
                    </div>
                )}
                {/* Render Events ... */}
                <div className= "space-y-5">
                    {events.map((event: Frame, index) => (
                        <div key={index}>
                            <span className="mr-5">{">>"}</span>
                            {renderEventMessage(event)}
                        </div>
                    ))}
                </div>
                {runStarted && (
                    <div>
                        <span className="mr-5 animate-in">
                            {"--- [AI Storyteller Has Started] ---"}
                        <br/>
                        </span>
                    </div>
                )}
            </div>
        </section>


    </div>
  )
}

export default StoryWriter