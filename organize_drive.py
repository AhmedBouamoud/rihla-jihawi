"""
organize_drive.py
-----------------
Organizes Google Drive files into the following structure:

  [01] مؤسسة الحنان
    ├── [01.1] الأولى باك         ← DOCX files containing 'الكتيب' or '1BAC' / '1Bac'
    ├── [01.2] الثالثة إعدادي     ← HTML files (rijla_jihawi, tahaddi_jihawi, رحلة-الجهوي)
    └── [01.3] موارد الأتمتة      ← قالب الدروس, دروس للتحويل
  [02] البرمجة والتطوير            ← Make.com, JSON, blueprint files
  [03] الإدارة والأرشيف            ← duplicate / older-version files

Setup
-----
1. Go to https://console.cloud.google.com/ and create (or select) a project.
2. Enable the "Google Drive API" for that project.
3. Create OAuth 2.0 credentials (Desktop app) and download credentials.json
   to the same directory as this script.
4. pip install google-api-python-client google-auth-oauthlib
5. python organize_drive.py
   (A browser window will open on the first run to authorise access.)
"""

import os
import re
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SCOPES = ["https://www.googleapis.com/auth/drive"]

FOLDER_STRUCTURE = {
    "[01] مؤسسة الحنان": {
        "[01.1] الأولى باك": None,
        "[01.2] الثالثة إعدادي": None,
        "[01.3] موارد الأتمتة": None,
    },
    "[02] البرمجة والتطوير": None,
    "[03] الإدارة والأرشيف": None,
}

# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------

def get_service():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    return build("drive", "v3", credentials=creds)

# ---------------------------------------------------------------------------
# Folder helpers
# ---------------------------------------------------------------------------

def get_or_create_folder(service, name, parent_id=None):
    """Return the folder ID, creating it if it doesn't exist."""
    q = f"mimeType='application/vnd.google-apps.folder' and name='{name}' and trashed=false"
    if parent_id:
        q += f" and '{parent_id}' in parents"

    results = service.files().list(q=q, fields="files(id, name)").execute()
    files = results.get("files", [])
    if files:
        print(f"  ✓ Folder already exists: {name}")
        return files[0]["id"]

    metadata = {
        "name": name,
        "mimeType": "application/vnd.google-apps.folder",
    }
    if parent_id:
        metadata["parents"] = [parent_id]

    folder = service.files().create(body=metadata, fields="id").execute()
    print(f"  ✚ Created folder: {name}")
    return folder["id"]


def create_folder_tree(service):
    """Create the full folder hierarchy and return a dict of name → id."""
    ids = {}
    for top_name, children in FOLDER_STRUCTURE.items():
        top_id = get_or_create_folder(service, top_name)
        ids[top_name] = top_id
        if isinstance(children, dict):
            for child_name in children:
                child_id = get_or_create_folder(service, child_name, parent_id=top_id)
                ids[child_name] = child_id
    return ids

# ---------------------------------------------------------------------------
# File listing
# ---------------------------------------------------------------------------

def list_all_files(service):
    """Yield every non-folder, non-trashed file the user owns."""
    page_token = None
    while True:
        resp = service.files().list(
            q="mimeType != 'application/vnd.google-apps.folder' and trashed = false and owner = 'me'",
            fields="nextPageToken, files(id, name, mimeType, parents)",
            pageSize=200,
            pageToken=page_token,
        ).execute()
        for f in resp.get("files", []):
            yield f
        page_token = resp.get("nextPageToken")
        if not page_token:
            break

# ---------------------------------------------------------------------------
# Classification logic
# ---------------------------------------------------------------------------

def classify_file(name: str, mime: str) -> str | None:
    """
    Return the target folder key, or None if the file should stay put.

    Keys match the names in FOLDER_STRUCTURE (top-level or nested).
    """
    name_lower = name.lower()

    # --- [01.1] الأولى باك ---------------------------------------------------
    # .docx files containing 'الكتيب' or '1bac' / '1Bac'
    if mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        if "الكتيب" in name or re.search(r"1[Bb][Aa][Cc]", name):
            return "[01.1] الأولى باك"

    # --- [01.2] الثالثة إعدادي -----------------------------------------------
    # HTML files: rijla_jihawi, tahaddi_jihawi, رحلة-الجهوي, 3AC
    if mime == "text/html":
        if any(kw in name_lower for kw in ("rijla_jihawi", "tahaddi_jihawi",
                                            "رحلة-الجهوي", "رحلة_الجهوي", "3ac")):
            return "[01.2] الثالثة إعدادي"

    # --- [01.3] موارد الأتمتة ------------------------------------------------
    # Presentations/docs containing 'قالب الدروس' or in 'دروس للتحويل' context
    if "قالب الدروس" in name or "قالب_الدروس" in name:
        return "[01.3] موارد الأتمتة"
    if "للتحويل" in name or "تجريبي" in name:
        return "[01.3] موارد الأتمتة"

    # --- [02] البرمجة والتطوير ----------------------------------------------
    # Files related to Make.com, JSON blueprints, automation
    if any(kw in name_lower for kw in ("blueprint", ".json", "json structure",
                                        "make.com", "automation scenario")):
        return "[02] البرمجة والتطوير"
    if mime == "application/json":
        return "[02] البرمجة والتطوير"
    if "make" in name_lower and any(kw in name_lower for kw in
                                     ("prompt", "دليل", "scenario", "integration")):
        return "[02] البرمجة والتطوير"

    return None  # leave unchanged


def detect_duplicates(files: list) -> set:
    """
    Return IDs of files that appear to be duplicates.
    Heuristic: same name (ignoring trailing ' (N)' suffix) more than once.
    The most-recently-modified copy is kept; extras go to the archive.
    """
    from collections import defaultdict
    # Strip trailing duplicate markers like ' (1)', '-1', '-2'
    base_re = re.compile(r"[\s\-]+[\(\[]?\d+[\)\]]?\s*(\.\w+)?$")

    groups = defaultdict(list)
    for f in files:
        stem = os.path.splitext(f["name"])[0]
        base = base_re.sub("", stem).strip()
        ext  = os.path.splitext(f["name"])[1]
        groups[base + ext].append(f)

    archive_ids = set()
    for key, group in groups.items():
        if len(group) > 1:
            # keep the one whose name has no trailing marker (or if ambiguous, first found)
            canonical = [g for g in group if re.search(base_re, os.path.splitext(g["name"])[0]) is None]
            if not canonical:
                canonical = [group[0]]
            keep_id = canonical[0]["id"]
            for f in group:
                if f["id"] != keep_id:
                    archive_ids.add(f["id"])
    return archive_ids

# ---------------------------------------------------------------------------
# Move helper
# ---------------------------------------------------------------------------

def move_file(service, file_id, new_parent_id, current_parents):
    """Move a file by updating its parents."""
    service.files().update(
        fileId=file_id,
        addParents=new_parent_id,
        removeParents=",".join(current_parents or []),
        fields="id, parents",
    ).execute()

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=== Google Drive Organiser ===\n")

    service = get_service()

    print("Step 1: Creating folder structure …")
    folder_ids = create_folder_tree(service)
    print()

    print("Step 2: Listing all files …")
    files = list(list_all_files(service))
    print(f"  Found {len(files)} files.\n")

    print("Step 3: Detecting duplicates …")
    archive_ids = detect_duplicates(files)
    print(f"  Found {len(archive_ids)} duplicate(s) to archive.\n")

    print("Step 4: Moving files …")
    moved = 0
    archived = 0

    for f in files:
        fid    = f["id"]
        fname  = f["name"]
        fmime  = f["mimeType"]
        fparents = f.get("parents", [])

        # Archive duplicates first
        if fid in archive_ids:
            target_id = folder_ids["[03] الإدارة والأرشيف"]
            if target_id not in fparents:
                move_file(service, fid, target_id, fparents)
                print(f"  [ARCHIVE] {fname}")
                archived += 1
            continue

        # Classify by name / mime
        target_key = classify_file(fname, fmime)
        if target_key and target_key in folder_ids:
            target_id = folder_ids[target_key]
            if target_id not in fparents:
                move_file(service, fid, target_id, fparents)
                print(f"  [{target_key}] ← {fname}")
                moved += 1

    print(f"\nDone. {moved} file(s) moved, {archived} duplicate(s) archived.")


if __name__ == "__main__":
    main()
