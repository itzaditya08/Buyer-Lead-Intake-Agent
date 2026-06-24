from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ExtractedCriteria(BaseModel):
    budget_max: Optional[float] = Field(default=None, description="Maximum budget explicitly specified by the buyer.")
    bedrooms_min: Optional[int] = Field(default=None, description="Minimum bedrooms required.")
    bathrooms_min: Optional[float] = Field(default=None, description="Minimum bathrooms required.")
    preferred_locations: List[str] = Field(default_factory=list, description="Target neighborhoods or municipalities.")
    property_types: List[str] = Field(default_factory=list, description="Extracted structural categories (e.g., Condo, Townhouse, SFH).")
    must_haves: List[str] = Field(default_factory=list, description="Non-negotiable functional requirements (e.g., pool, boat dock, gym).")

class RecommendedProperty(BaseModel):
    listing_id: str = Field(description="The unique system identifier for the listing.")
    mls_number: str = Field(description="The official public MLS entry sequence identifier.")
    address: str = Field(description="Full mailing/geographical destination address.")
    price: float = Field(description="Current listed market valuation price.")
    neighborhood: str = Field(description="Assigned region or neighborhood sector.")
    reason_for_match: str = Field(description="Granular evaluation explaining why this matching profile or alternative meets requirements.")

class NextActionPlan(BaseModel):
    strategy: str = Field(description="High-level communication strategy recommended for the realtor.")
    outbound_script: str = Field(description="Ready-to-use email or text communication template tailored for this specific lead.")

class LeadBriefResponse(BaseModel):
    lead_id: str = Field(description="Unique lookup tracking identifier for the inbound lead entry.")
    buyer_name: str = Field(description="Extracted consumer profile name.")
    buyer_summary: str = Field(description="A brief summary extracting key buyer intent and background signals.")
    extracted_constraints: ExtractedCriteria = Field(description="Structured criteria discovered by the parser engine.")
    recommended_properties: List[RecommendedProperty] = Field(description="Top 3 to 5 matching or alternative properties.")
    security_flag: bool = Field(description="True if an active instruction injection attempt was isolated and blocked.")
    realtor_context_and_concerns: str = Field(description="Crucial market reality callouts, impossible financial limits, or missing metadata warnings.")
    suggested_next_action: NextActionPlan = Field(description="Actionable multi-channel blueprints for the agent's first outbound response.")

class BulkProcessResponse(BaseModel):
    status: str
    processed_count: int
    total_available: int = Field(default=12, description="Total number of leads in the JSON file.")
    briefs: List[LeadBriefResponse]