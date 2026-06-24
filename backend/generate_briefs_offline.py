import os
import json
import asyncio
import time
from llm_service import LeadIntakeAgent

async def generate_all_leads():
    print("Starting Smart AI Batch Processor...")
    
    # 1. Initialize the actual AI Agent
    agent = LeadIntakeAgent()
    
    # 2. Load the inquiries configuration resource
    inquiries_path = os.path.join(os.path.dirname(__file__), "data", "sample_buyer_inquiries.json")
    if not os.path.exists(inquiries_path):
        print(f"Error: Source file not found at {inquiries_path}")
        return
        
    with open(inquiries_path, "r") as f:
        leads = json.load(f)

    # 3. Target folder to save final deliverables
    output_dir = os.path.join(os.path.dirname(__file__), "generated_briefs")
    os.makedirs(output_dir, exist_ok=True)

    print(f"Loaded {len(leads)} total leads from source data.")
    print("Checking for previously completed work to prevent duplicate API overhead...\n")

    for idx, lead in enumerate(leads):
        lead_id = lead.get('lead_id')
        output_file = os.path.join(output_dir, f"{lead_id}_brief.json")
        
        # FIX: Check if file already exists on the disk before making the API call
        if os.path.exists(output_file):
            print(f"[{idx+1}/{len(leads)}] Skipping {lead_id} -> Already processed successfully.")
            continue

        print(f"[{idx+1}/{len(leads)}] Processing {lead_id} via Gemini API...")
        
        success = False
        while not success:
            try:
                # Execute the production LLM workflow pipeline
                brief = await agent.execute_workflow(lead)
                
                # Write individual clean structured JSON file to output workspace
                with open(output_file, "w") as out_f:
                    out_f.write(brief.model_dump_json(indent=4))
                
                print(f"Success! Brief saved to cache: {output_file}")
                success = True
                
                # Sleep interval spacing to protect the 15 RPM free-tier quota limits
                if idx < len(leads) - 1:
                    print("Sleeping 45 seconds to refresh background API window safety limits...")
                    time.sleep(45)
                    
            except Exception as e:
                error_msg = str(e)
                if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                    print(f"Free-Tier Quota Limit Intercepted. Cooling down for 90 seconds...")
                    time.sleep(90) 
                else:
                    print(f"Critical structural processing error on {lead_id}: {error_msg}")
                    break # Break inner retry loop if it's a syntax or system code error

    print("\n ONSITE BATCH RUN CYCLE COMPLETE! Review output resources in the 'generated_briefs' directory.")

if __name__ == "__main__":
    asyncio.run(generate_all_leads())