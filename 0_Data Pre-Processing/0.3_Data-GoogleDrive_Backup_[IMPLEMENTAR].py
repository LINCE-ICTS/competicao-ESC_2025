from __future__ import annotations
import os
import sys
import argparse
import mimetypes
from pathlib import Path
from typing import Dict, List
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upload one or more local folders (recursively) to a target path in Google Drive.
Requires: google-api-python-client google-auth-httplib2 google-auth-oauthlib
Create OAuth client credentials (OAuth 2.0 Client IDs) and save as `credentials.json`
in the same folder as this script. The first run will open a browser to authorize
and save a token to `token.json`.

Example:
    python 0.3_Data-GoogleDrive_Backup.py \
        --sources "C:/path/to/folder1" "D:/another/folder2" \
        --drive-path "Backups/2025/ESC"

This will create (if needed) Drive folders Backups -> 2025 -> ESC under My Drive
and upload the folders preserving structure.
"""


# If modifying these scopes, delete token.json.
SCOPES = ['https://www.googleapis.com/auth/drive.file']  # limited to files created/opened by the app
# For full drive access use: 'https://www.googleapis.com/auth/drive'

CREDENTIALS_FILE = Path(__file__).with_name('credentials.json')
TOKEN_FILE = Path(__file__).with_name('token.json')


def authenticate() -> 'Resource':
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_FILE.exists():
                print(f"Missing {CREDENTIALS_FILE}. Create OAuth 2.0 client credentials and save as this file.")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, 'w', encoding='utf-8') as f:
            f.write(creds.to_json())
    service = build('drive', 'v3', credentials=creds, cache_discovery=False)
    return service


def find_folder(service, name: str, parent_id: str | None) -> str | None:
    q_parts = [
        f"name = '{name.replace(\"'\", \"\\\\'\")}'",
        "mimeType = 'application/vnd.google-apps.folder'",
        "trashed = false"
    ]
    if parent_id:
        q_parts.append(f"'{parent_id}' in parents")
    else:
        q_parts.append("'.' in parents" if False else "root in parents")
    q = " and ".join(q_parts)
    res = service.files().list(q=q, spaces='drive', fields='files(id, name)', pageSize=10).execute()
    files = res.get('files', [])
    if files:
        return files[0]['id']
    return None


def create_folder(service, name: str, parent_id: str | None) -> str:
    file_metadata = {
        'name': name,
        'mimeType': 'application/vnd.google-apps.folder'
    }
    if parent_id:
        file_metadata['parents'] = [parent_id]
    created = service.files().create(body=file_metadata, fields='id').execute()
    return created['id']


def ensure_drive_path(service, path: str) -> str:
    """
    Ensure that a Drive path (like "Backups/2025/ESC") exists under My Drive.
    Returns the folder id of the final segment.
    """
    path = Path(path)
    parent_id = None  # None -> root
    for part in path.parts:
        # skip empty parts (leading/trailing slashes)
        if not part:
            continue
        folder_id = find_folder(service, part, parent_id)
        if not folder_id:
            folder_id = create_folder(service, part, parent_id)
            print(f"Created Drive folder: {part} (id={folder_id})")
        parent_id = folder_id
    return parent_id or 'root'


def upload_file(service, local_path: Path, parent_id: str):
    mime_type, _ = mimetypes.guess_type(str(local_path))
    media = MediaFileUpload(str(local_path), mimetype=mime_type or 'application/octet-stream', resumable=True)
    file_metadata = {
        'name': local_path.name,
        'parents': [parent_id]
    }
    created = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"Uploaded: {local_path} -> id={created.get('id')}")


def upload_folder_recursive(service, local_folder: Path, drive_parent_id: str):
    """
    Upload the contents of local_folder into drive_parent_id, creating subfolders as needed.
    The local_folder itself will be created as a folder inside drive_parent_id.
    """
    if not local_folder.exists() or not local_folder.is_dir():
        print(f"Skipping non-folder: {local_folder}")
        return

    # Create root folder for this local_folder
    root_drive_id = find_folder(service, local_folder.name, drive_parent_id)
    if not root_drive_id:
        root_drive_id = create_folder(service, local_folder.name, drive_parent_id)
        print(f"Created Drive folder for {local_folder}: id={root_drive_id}")

    # Walk and keep mapping of local dir -> drive folder id
    dir_map: Dict[str, str] = {str(local_folder.resolve()): root_drive_id}
    for current_dir, subdirs, files in os.walk(local_folder):
        current_dir_path = Path(current_dir).resolve()
        parent_drive_id = dir_map.get(str(current_dir_path))
        if parent_drive_id is None:
            # If a parent mapping is missing, create it relative to local_folder
            relative = current_dir_path.relative_to(local_folder.resolve())
            # ensure chain
            parent_drive_id = root_drive_id
            for part in relative.parts:
                if not part:
                    continue
                existing = find_folder(service, part, parent_drive_id)
                if not existing:
                    existing = create_folder(service, part, parent_drive_id)
                parent_drive_id = existing
            dir_map[str(current_dir_path)] = parent_drive_id

        # create subfolders in Drive and map them
        for d in subdirs:
            sub_local = current_dir_path / d
            exists = find_folder(service, d, parent_drive_id)
            if not exists:
                exists = create_folder(service, d, parent_drive_id)
                print(f"Created Drive subfolder: {sub_local} -> id={exists}")
            dir_map[str(sub_local.resolve())] = exists

        # upload files
        for f in files:
            local_file = current_dir_path / f
            try:
                upload_file(service, local_file, parent_drive_id)
            except Exception as e:
                print(f"Failed to upload {local_file}: {e}")


def parse_args():
    p = argparse.ArgumentParser(description="Upload specified local folders to a Google Drive path.")
    p.add_argument('--sources', nargs='+', required=True, help='One or more local folder paths to upload.')
    p.add_argument('--drive-path', required=True,
                   help='Target path on Drive (e.g. "Backups/2025/ESC"). Will be created if missing.')
    return p.parse_args()


def main():
    args = parse_args()
    service = authenticate()
    drive_folder_id = ensure_drive_path(service, args.drive_path)
    for s in args.sources:
        local = Path(s).expanduser()
        if not local.exists():
            print(f"Source does not exist: {local}")
            continue
        if local.is_file():
            # if user gives a file, just upload into drive_folder_id
            upload_file(service, local, drive_folder_id)
        else:
            upload_folder_recursive(service, local, drive_folder_id)


if __name__ == '__main__':
    main()