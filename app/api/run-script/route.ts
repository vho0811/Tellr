import { NextRequest } from "next/server";
import {RunEventType, RunOpts} from "@gptscript-ai/gptscript"
import fs from 'fs';

import { GPTScript } from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptInstance";
const script = "app/api/run-script/story-book.gpt"

export async function POST(request: NextRequest){
    const {story, pages, path} = await request.json()
    
    // Make sure the stories directory exists
    try {
        if (!fs.existsSync(path)) {
            console.log(`[DEBUG] Creating base directory: ${path}`);
            fs.mkdirSync(path, { recursive: true });
        }
    } catch (error) {
        console.error("[DEBUG] Error creating directory:", error);
    }
    
    // Escape any quotes in the story
    const escapedStory = story.replace(/"/g, '\\"');
    
    console.log(`[DEBUG] Processing story request with path: ${path}`);

    const opts: RunOpts = {
        disableCache: true,
        input: `--story "${escapedStory}" --pages ${pages} --path ${path}`,
    };
    
    try {
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
            async start(controller){
                try{
                    console.log("[DEBUG] Starting script execution");
                    const run = await g.run(script, opts)

                    run.on(RunEventType.Event, (data) => {
                        // Ensure data is properly serializable
                        const safeData = JSON.parse(JSON.stringify(data));
                        
                        // Send the event with proper formatting
                        controller.enqueue(encoder.encode(`event: ${JSON.stringify(safeData)}\n\n`));
                    })
                    
                    const result = await run.text();
                    console.log("[DEBUG] Script completed successfully");
                    controller.close()
                }
                catch(error){
                    console.error("[DEBUG] Script error:", error);
                    controller.error(error)
                }
            }
        })
        return new Response(stream,{
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            }
        })
    }catch(error){
        console.error("[DEBUG] API route error:", error);
        return new Response(JSON.stringify({error: String(error)}), {status: 500})
    }
}