class FileInfo:
    def __init__(self, file_path: str, file_hash: str = "", file_size: int = 0):
        self.file_path = file_path
        self.file_hash = file_hash
        self.file_size = file_size

class ExtractionResult:
    def __init__(self):
        self.columns_data = {}
        self.metadata = {}

class EnhancedFileService:
    async def validate_file(self, file):
        """Stub file validation always succeeds."""
        return {"valid": True}

    async def save_upload_secure(self, file, user_id: str):
        """Return minimal FileInfo for uploaded file."""
        return FileInfo(file.filename)

    async def extract_columns_enhanced(self, file_path: str, options=None):
        """Return empty ExtractionResult."""
        return ExtractionResult()

    async def cleanup_file(self, file_path: str, delay: int = 0):
        """Stub cleanup implementation."""
        return
