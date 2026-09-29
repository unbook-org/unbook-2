from typing import Optional
from ninja import Schema


class SigaaSyncRequest(Schema):
    semester: str = "2026.1"
    limit: Optional[int] = None
    dry_run: bool = False
    skip_professors: bool = False
    skip_classes: bool = False


class SigaaSyncResponse(Schema):
    status: str
    message: str
    output: str
