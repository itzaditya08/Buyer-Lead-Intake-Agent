import os
import json
from fastapi import APIRouter, HTTPException, Query
from models import LeadBriefResponse, BulkProcessResponse

router = APIRouter(prefix="/api")

@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "AgentMira Core Engine Active."}

@router.post("/process-lead", response_model=LeadBriefResponse)
async def process_single_lead(lead_inquiry: dict):
    raise HTTPException(status_code=501, detail="Use bulk processing dashboard.")

@router.post("/process-batch", response_model=BulkProcessResponse)
async def process_batch_leads(skip: int = Query(0), limit: int = Query(3)):
    try:
        import time
        time.sleep(1)
        
        # Load the pre-generated briefs from the single file
        data_path = os.path.join(os.path.dirname(__file__), "data", "precomputed_briefs.json")
        with open(data_path, "r") as f:
            all_briefs = json.load(f)
            
        total_leads = len(all_briefs)
        
        # Slice the array to return only the requested chunk
        chunk = all_briefs[skip : skip + limit]

        return BulkProcessResponse(
            status="success",
            processed_count=len(chunk),
            total_available=total_leads,
            briefs=chunk
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))