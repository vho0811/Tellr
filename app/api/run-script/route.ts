import { NextRequest } from "next/server";
import {RunEventType, RunOpts} from "@gptscript-ai/gptscript"
import fs from 'fs';

import { GPTScript } from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptInstance";
const script = "app/api/run-script/story-book.gpt"

/**
 * Story Generation API Route
 * 
 * This API endpoint handles requests to generate children's stories using GPTScript.
 * It processes the request, runs the story-book.gpt script, and streams the results
 * back to the client using Server-Sent Events (SSE).
 * 
 * The route accepts:
 * - story: The story prompt or complete story text
 * - pages: Number of pages to generate
 * - path: Directory where the story should be saved
 * 
 * @route POST /api/run-script
 */
export async function POST(request: NextRequest){
    // Extract request parameters
    const {story, pages, path} = await request.json()
    
    /**
     * Directory Initialization
     * 
     * Ensures the target directory exists before writing story files.
     * Creates the directory if it doesn't exist to prevent file system errors.
     */
    try {
        if (!fs.existsSync(path)) {
            console.log(`[DEBUG] Creating base directory: ${path}`);
            fs.mkdirSync(path, { recursive: true });
        }
    } catch (error) {
        console.error("[DEBUG] Error creating directory:", error);
    }
    
    // Escape quotes in the story text to prevent command injection issues
    const escapedStory = story.replace(/"/g, '\\"');
    
    console.log(`[DEBUG] Processing story request with path: ${path}`);

    // Configure GPTScript run options
    const opts: RunOpts = {
        disableCache: true, // Always generate fresh content
        input: `--story "${escapedStory}" --pages ${pages} --path ${path}`,
    };
    
    /**
     * Stream Processing
     * 
     * Creates a ReadableStream to handle Server-Sent Events (SSE) for real-time
     * progress updates while the story is being generated.
     */
    try {
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
            async start(controller){
                try{
                    console.log("[DEBUG] Starting script execution");
                    // Initialize GPTScript run
                    const run = await g.run(script, opts)

                    /**
                     * Event Handling
                     * 
                     * Listens for events from the GPTScript execution and forwards them
                     * to the client. This provides real-time progress updates during
                     * story generation.
                     */
                    run.on(RunEventType.Event, (data) => {
                        // Ensure data is properly serializable to prevent stream errors
                        const safeData = JSON.parse(JSON.stringify(data));
                        
                        // Format data as SSE event and send to client
                        controller.enqueue(encoder.encode(`event: ${JSON.stringify(safeData)}\n\n`));
                    })
                    
                    // Wait for script completion
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

        /**
         * Response Configuration
         * 
         * Returns the event stream with appropriate headers for SSE.
         * This allows the client to receive real-time updates.
         */
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